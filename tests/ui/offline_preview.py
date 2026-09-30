"""Render the actual UI offline; native persistence is a mocked bridge.
No production code is fetched or rewritten on the network. Test-module wrappers
only replace static named imports/exports because this sandbox blocks navigation.
Windows CI separately tests real SQLite and WebView startup.
"""
from pathlib import Path
import os, shutil
import re, json
ROOT=Path(__file__).resolve().parents[2]/'web'

def bundle():
    done=set(); chunks=['window.__testModules={};']
    def module(path):
        path=path.resolve(); key=path.relative_to(ROOT).as_posix()
        if key in done:return
        code=path.read_text(encoding='utf-8')
        pattern=r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"];?"
        def replace(m):
            dep=(path.parent/m[2]).resolve();module(dep)
            names=re.sub(r'\s+as\s+',':',m[1])
            return f'const {{{names}}}=window.__testModules[{json.dumps(dep.relative_to(ROOT).as_posix())}];'
        code=re.sub(pattern,replace,code)
        exports=re.findall(r'export\s+(?:async\s+)?(?:function|const|let)\s+(\w+)',code)
        code=re.sub(r'\bexport\s+','',code)
        chunks.append(f'window.__testModules[{json.dumps(key)}]=(()=>{{\n{code}\nreturn {{{",".join(exports)}}};\n}})();')
        done.add(key)
    module(ROOT/'tutor/app.js')
    return '\n'.join(chunks)

MOCK=r'''
window.__store = {revision:0,data:null}; window.__prefs = {}; window.__session = {};
for (const [name, data] of [['localStorage', '__prefs'], ['sessionStorage', '__session']]) {
 Object.defineProperty(window,name,{configurable:true,value:{
 getItem:key=>window[data][key]??null,setItem:(key,val)=>window[data][key]=String(val),removeItem:key=>delete window[data][key]
 }});
}
if(!crypto.randomUUID)crypto.randomUUID=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
window.__TAURI__={core:{invoke:async (cmd,args)=>{
 if(cmd==='load_state') return {...window.__store};
 if(cmd==='save_state'){if(args.expectedRevision!==window.__store.revision)throw Error('Conflict'); window.__store={revision:window.__store.revision+1,data:args.data};return window.__store.revision;}
 if(cmd==='app_info')return {database:'TEST mocked native store',pdf:null,uiSmoke:false};
 if(cmd==='export_backup'){window.__exported=args.data;return 'test-backup.json';}
 if(cmd==='select_pdf')return 'personal-course.pdf';
 if(cmd==='open_pdf'){window.__openedPDF=true;return true;}
 throw Error('Unknown mock command: '+cmd);
}}};
'''

def boot(page,state=None,prefs=None,session=None):
    page.set_content('<!doctype html><html><head><meta name="theme-color" content="#191c28"></head><body><div id="app"></div><div id="toast" role="status" aria-live="polite"></div><dialog id="modal"></dialog></body></html>')
    page.add_script_tag(content=MOCK)
    if state:page.evaluate('(s)=>window.__store=s',state)
    if prefs:page.evaluate('(s)=>window.__prefs=s',prefs)
    if session:page.evaluate('(s)=>window.__session=s',session)
    page.add_script_tag(content=(ROOT/'tutor/theme.js').read_text(encoding='utf-8'))
    page.add_style_tag(content=(ROOT/'tutor/style.css').read_text(encoding='utf-8'))
    page.add_script_tag(content=bundle())
    page.locator('#main').wait_for()

if __name__=='__main__':
 from playwright.sync_api import sync_playwright
 output=Path(os.environ.get('OSED_QA_OUT',str(ROOT.parent/'qa-output')))
 output.mkdir(parents=True,exist_ok=True)
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1,color_scheme='light');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)));boot(page)
  page.screenshot(path=str(output/'OSED-Study-Home-Light.png'),full_page=True)
  page.get_by_role('button',name='Switch to dark mode').click()
  page.screenshot(path=str(output/'OSED-Study-Home-Dark.png'),full_page=True)
  page.get_by_role('button',name='Start lesson',exact=False).click()
  page.screenshot(path=str(output/'OSED-Study-Lesson-Dark.png'),full_page=True)
  print('Errors:',errors); print(page.locator('body').inner_text()[:600]);b.close()
