#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rusqlite::{params, Connection, OptionalExtension};
use serde::Serialize;
use std::{fs, path::PathBuf, sync::Mutex};
use tauri::Manager;
struct Store { conn: Mutex<Connection>, path: PathBuf }
#[derive(Serialize)]
struct Snapshot { revision: i64, data: Option<String> }
fn init(conn: &Connection) -> Result<(), String> {
    conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;
        CREATE TABLE IF NOT EXISTS snapshots(id INTEGER PRIMARY KEY CHECK(id IN(1,2)), revision INTEGER NOT NULL, payload TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY,value TEXT NOT NULL); PRAGMA user_version=1;")
        .map_err(|e|e.to_string())
}
fn load(conn: &Connection) -> Result<Snapshot, String> {
    let row=conn.query_row("SELECT revision,payload FROM snapshots WHERE id=1",[],|r|Ok((r.get(0)?,r.get(1)?)))
        .optional().map_err(|e|e.to_string())?;
    Ok(match row {Some((revision,data))=>Snapshot{revision,data:Some(data)},None=>Snapshot{revision:0,data:None}})
}
fn validate(data: &str) -> Result<(), String> {
    if data.len()>4_194_304 { return Err("Backup exceeds the 4 MiB limit.".into()); }
    let v:serde_json::Value=serde_json::from_str(data).map_err(|_|"Invalid JSON.")?;
    if v["schemaVersion"]!=1 || !v["settings"].is_object() || !v["reviews"].is_object() || !v["attempts"].is_array() || !v["sessions"].is_array() {
        return Err("Not a supported OSED Forge snapshot.".into());
    }
    Ok(())
}
fn save(conn:&mut Connection,data:&str,expected:i64)->Result<i64,String>{
    validate(data)?;
    let tx=conn.transaction().map_err(|e|e.to_string())?;
    let current=load(&tx)?;
    if current.revision!=expected {return Err("Progress changed in another window. Close the other instance and reload this app before continuing.".into());}
    let revision=current.revision.checked_add(1).ok_or("Revision overflow")?;
    if let Some(previous)=current.data {
        tx.execute("INSERT OR REPLACE INTO snapshots VALUES(2,?1,?2)",params![current.revision,previous]).map_err(|e|e.to_string())?;
    }
    tx.execute("INSERT OR REPLACE INTO snapshots VALUES(1,?1,?2)",params![revision,data]).map_err(|e|e.to_string())?;
    tx.commit().map_err(|e|e.to_string())?;
    Ok(revision)
}
#[tauri::command]
fn load_state(store:tauri::State<Store>)->Result<Snapshot,String>{let conn=store.conn.lock().map_err(|_|"Storage unavailable")?;load(&conn)}
#[tauri::command]
fn save_state(store:tauri::State<Store>,data:String,expected_revision:i64)->Result<i64,String>{
    let mut conn=store.conn.lock().map_err(|_|"Storage unavailable")?;save(&mut conn,&data,expected_revision)
}
#[tauri::command]
fn app_info(store:tauri::State<Store>)->Result<serde_json::Value,String>{
    let conn=store.conn.lock().map_err(|_|"Storage unavailable")?;
    let pdf:Option<String>=conn.query_row("SELECT value FROM metadata WHERE key='pdf'",[],|r|r.get(0)).optional().map_err(|e|e.to_string())?;
    Ok(serde_json::json!({"database":store.path.to_string_lossy(),"pdf":pdf.map(|p|PathBuf::from(p).file_name().unwrap_or_default().to_string_lossy().to_string()),"uiSmoke":std::env::args().any(|a|a=="--ui-smoke-test")}))
}
#[tauri::command]
async fn export_backup(data:String)->Result<Option<String>,String>{
    validate(&data)?;
    tauri::async_runtime::spawn_blocking(move || {
        let file=rfd::FileDialog::new().set_title("Export private study backup").add_filter("JSON backup",&["json"]).set_file_name("OSED-Forge.backup.json").save_file();
        if let Some(path)=file {
            if path.extension().and_then(|s|s.to_str())!=Some("json"){return Err("Choose a filename ending in .json.".into());}
            fs::write(&path,data).map_err(|e|e.to_string())?;
            Ok(Some(path.to_string_lossy().to_string()))
        } else {Ok(None)}
    }).await.map_err(|e|e.to_string())?
}
#[tauri::command]
async fn select_pdf(app:tauri::AppHandle)->Result<Option<String>,String>{
    tauri::async_runtime::spawn_blocking(move||{
        let chosen=rfd::FileDialog::new().set_title("Link your local course PDF (not uploaded)").add_filter("PDF",&["pdf"]).pick_file();
        if let Some(path)=chosen {
            if path.extension().and_then(|s|s.to_str()).map(|s|s.to_lowercase())!=Some("pdf".into()){return Err("Select a PDF file.".into());}
            let path=path.canonicalize().map_err(|e|e.to_string())?;
            let store=app.state::<Store>();
            store.conn.lock().map_err(|_|"Storage unavailable")?.execute("INSERT OR REPLACE INTO metadata VALUES('pdf',?1)",[path.to_string_lossy().as_ref()]).map_err(|e|e.to_string())?;
            Ok(Some(path.file_name().unwrap_or_default().to_string_lossy().to_string()))
        }else{Ok(None)}
    }).await.map_err(|e|e.to_string())?
}
#[tauri::command]
fn open_pdf(store:tauri::State<Store>)->Result<(),String>{
    let conn=store.conn.lock().map_err(|_|"Storage unavailable")?;
    let path:String=conn.query_row("SELECT value FROM metadata WHERE key='pdf'",[],|r|r.get(0)).map_err(|_|"Link your PDF in Settings first.")?;
    let path=PathBuf::from(path);
    if !path.is_file() || path.extension().and_then(|s|s.to_str()).map(|s|s.to_lowercase())!=Some("pdf".into()){return Err("The linked PDF has moved. Link it again in Settings.".into());}
    open::that(path).map_err(|e|e.to_string())
}
#[tauri::command]
fn smoke_report(app:tauri::AppHandle,ok:bool){
    if std::env::args().any(|a|a=="--ui-smoke-test"){app.exit(if ok {0}else{1});}
}
fn smoke()->Result<(),String>{
    let dir=std::env::temp_dir().join(format!("osed-forge-smoke-{}",std::process::id()));
    fs::create_dir_all(&dir).map_err(|e|e.to_string())?;
    let path=dir.join("test.db");
    let mut conn=Connection::open(&path).map_err(|e|e.to_string())?;init(&conn)?;
    let data=r#"{"schemaVersion":1,"settings":{},"reviews":{},"attempts":[],"sessions":[]}"#;
    let rev=load(&conn)?.revision;save(&mut conn,data,rev)?;
    if load(&conn)?.data.as_deref()!=Some(data){return Err("Persistence test failed".into());}
    drop(conn);fs::remove_dir_all(dir).map_err(|e|e.to_string())?;Ok(())
}
fn main(){
    if std::env::args().any(|a|a=="--smoke-test") { std::process::exit(if smoke().is_ok(){0}else{1}); }
    let result=tauri::Builder::default().setup(|app|{
        let dir=app.path().app_local_data_dir()?;fs::create_dir_all(&dir)?;
        let path=dir.join("progress.sqlite3");let conn=Connection::open(&path)?;
        init(&conn).map_err(std::io::Error::other)?;
        app.manage(Store{conn:Mutex::new(conn),path});Ok(())
    }).invoke_handler(tauri::generate_handler![load_state,save_state,app_info,export_backup,select_pdf,open_pdf,smoke_report]).run(tauri::generate_context!());
    if let Err(e)=result{rfd::MessageDialog::new().set_title("OSED Forge could not start").set_description(format!("{e}\nYour existing progress has not been reset.")).show();std::process::exit(1);}
}
#[cfg(test)]mod tests{
    use super::*;
    const DATA:&str=r#"{"schemaVersion":1,"settings":{},"reviews":{},"attempts":[],"sessions":[]}"#;
    #[test]fn empty(){let c=Connection::open_in_memory().unwrap();init(&c).unwrap();assert_eq!(load(&c).unwrap().revision,0);}
    #[test]fn roundtrip(){let mut c=Connection::open_in_memory().unwrap();init(&c).unwrap();assert_eq!(save(&mut c,DATA,0).unwrap(),1);assert_eq!(load(&c).unwrap().data.unwrap(),DATA);}
    #[test]fn conflict_preserves(){let mut c=Connection::open_in_memory().unwrap();init(&c).unwrap();save(&mut c,DATA,0).unwrap();assert!(save(&mut c,DATA,0).is_err());assert_eq!(load(&c).unwrap().revision,1);}
    #[test]fn keeps_previous(){let mut c=Connection::open_in_memory().unwrap();init(&c).unwrap();save(&mut c,DATA,0).unwrap();save(&mut c,DATA,1).unwrap();let rev:i64=c.query_row("SELECT revision FROM snapshots WHERE id=2",[],|r|r.get(0)).unwrap();assert_eq!(rev,1);}
    #[test]fn rejects_invalid(){assert!(validate("{}").is_err());assert!(validate("bad").is_err());assert!(validate(&"x".repeat(4_194_305)).is_err());}
}
