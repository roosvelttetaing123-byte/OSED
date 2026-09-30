/* Pure learning/state functions: shared by desktop, browser and Node tests. */
export function day(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function validDay(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return !Number.isNaN(+d)&&day(d)===s;}
export function addDays(s,n){const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return day(d);}
export function dayDiff(a,b){return Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);}
export const stages=['not_started','reading','practising','independent'];
export const stageLabels=['Not started','Reading','Practising','Independent check'];
export function initialState(today=day()){return {schemaVersion:1,settings:{name:'RV',startDate:today,weeklyHours:12,labStart:'',labEnd:'',examExpiry:'',reminder:'19:00',reminders:false},chapters:{},planDone:[],reviews:{},daily:null,attempts:[],sessions:[],timer:{seconds:0,running:false,lastTick:0,topic:''},checks:[],xp:0,lastReminder:''};}
function boundedString(v,max=20000){return typeof v==='string'&&v.length<=max;}
function integer(n,min,max){return Number.isInteger(n)&&n>=min&&n<=max;}
export function validateState(s){
 const fail=()=>{throw new Error('This is not a valid OSED Forge v1 backup. Your existing progress has not been changed.');};
 if(!s||typeof s!=='object'||Array.isArray(s)||s.schemaVersion!==1)fail();
 const cfg=s.settings;if(!cfg||!boundedString(cfg.name,60)||!validDay(cfg.startDate)||!Number.isFinite(cfg.weeklyHours)||cfg.weeklyHours<1||cfg.weeklyHours>60||typeof cfg.reminders!=='boolean'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(cfg.reminder))fail();
 for(const key of ['labStart','labEnd','examExpiry'])if(cfg[key]!==''&&!validDay(cfg[key]))fail();
 if(cfg.labStart&&cfg.labEnd&&cfg.labEnd<cfg.labStart)fail();
 if(!s.chapters||Array.isArray(s.chapters)||typeof s.chapters!=='object'||!s.reviews||Array.isArray(s.reviews)||typeof s.reviews!=='object')fail();
 for(const [id,c] of Object.entries(s.chapters))if(!/^(?:[1-9]|1[0-3])$/.test(id)||!c||!stages.includes(c.stage)||!boundedString(c.note))fail();
 if(Object.keys(s.reviews).length>1000)fail();
 for(const [id,r] of Object.entries(s.reviews))if(!/^[A-Za-z0-9_-]{1,40}$/.test(id)||!r||!validDay(r.due)||!integer(r.interval,0,90)||!integer(r.total,0,1000000)||!integer(r.correct,0,r.total)||!integer(r.lapses,0,r.total)||!integer(r.streak,0,r.total)||(r.lastXP!==''&&!validDay(r.lastXP)))fail();
 for(const k of ['attempts','sessions','planDone','checks'])if(!Array.isArray(s[k])||s[k].length>4000)fail();
 if(s.planDone.some(n=>!integer(n,1,26))||s.checks.some(x=>!['foundation','stack','shellcode','mitigations','rebuild','mocks'].includes(x)))fail();
 for(const a of s.attempts)if(!a||!boundedString(a.id,80)||!boundedString(a.labId,30)||!validDay(a.date)||!['drill','assisted','independent','reproduced','blocked'].includes(a.status)||!boundedString(a.note)||!integer(a.minutes,0,1440)||!integer(a.hints,0,3)||typeof a.passed!=='boolean')fail();
 for(const a of s.sessions)if(!a||!boundedString(a.id,80)||!validDay(a.date)||!Number.isFinite(a.minutes)||a.minutes<0||a.minutes>1440||!boundedString(a.topic,200))fail();
 const t=s.timer;if(!t||!Number.isFinite(t.seconds)||t.seconds<0||t.seconds>86400||typeof t.running!=='boolean'||!Number.isFinite(t.lastTick)||!boundedString(t.topic,200))fail();
 if(s.daily!==null){const d=s.daily;if(!d||!validDay(d.date)||!Array.isArray(d.ids)||d.ids.length>10||new Set(d.ids).size!==d.ids.length||d.ids.some(id=>!boundedString(id,40))||!d.answers||typeof d.answers!=='object'||Array.isArray(d.answers))fail();for(const [id,a]of Object.entries(d.answers))if(!d.ids.includes(id)||!a||!integer(a.choice,0,8)||typeof a.correct!=='boolean')fail();}
 if(!integer(s.xp,0,10000000)||(s.lastReminder!==''&&!validDay(s.lastReminder)))fail();
 const base=initialState(cfg.startDate);for(const k of Object.keys(base))base[k]=structuredClone(s[k]);return base;
}
export function weekAt(start,today=day()){return Math.max(0,Math.min(27,Math.floor(dayDiff(today,start)/7)+1));}
export function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function shuffled(items,seed){return [...items].sort((a,b)=>hash(seed+':'+String(a))-hash(seed+':'+String(b)));}
export function eligibleSkills(state){
 const set=new Set(['c_memory','python_bytes','x86','reporting']);
 const m={2:['windbg'],3:['stack','constraints'],4:['seh'],5:['reversing'],6:['constraints'],7:['shellcode'],8:['reversing'],9:['rop'],10:['aslr'],11:['format_strings'],12:['format_strings']};
 for(const [n,c] of Object.entries(state.chapters))if(c.stage!=='not_started')for(const skill of m[n]||[])set.add(skill);
 return set;
}
export function dailyQuestions(state,questions,today=day()){
 if(state.daily?.date===today)return state.daily.ids.filter(id=>questions.some(q=>q.id===id));
 const available=questions.filter(q=>eligibleSkills(state).has(q.skill));
 const due=available.filter(q=>state.reviews[q.id]?.due<=today).sort((a,b)=>state.reviews[a.id].due.localeCompare(state.reviews[b.id].due)||hash(today+a.id)-hash(today+b.id));
 const fresh=available.filter(q=>!state.reviews[q.id]).sort((a,b)=>hash(today+a.id)-hash(today+b.id));
 return [...due,...fresh].slice(0,5).map(q=>q.id);
}
export function recordAnswer(state,q,choice,today=day()){
 if(!state.daily||state.daily.date!==today||!state.daily.ids.includes(q.id))throw new Error('Start today’s review first.');
 if(state.daily.answers[q.id])return false;
 if(!integer(choice,0,q.options.length-1))throw new Error('Choose one answer.');
 const ok=choice===q.correct_index;
 const old=state.reviews[q.id]||{interval:0,total:0,correct:0,lapses:0,streak:0,lastXP:''};
 const streak=ok?old.streak+1:0;
 const interval=ok?[1,3,7,14,30][Math.min(streak-1,4)]:1;
 state.reviews[q.id]={interval,total:old.total+1,correct:old.correct+Number(ok),lapses:old.lapses+Number(!ok),streak,due:addDays(today,interval),lastXP:today};
 state.daily.answers[q.id]={choice,correct:ok};
 if(old.lastXP!==today)state.xp+=ok?10:2;
 return ok;
}
export function timerTick(timer,now=Date.now()){
 if(!timer.running)return false;
 const delta=(now-timer.lastTick)/1000;timer.lastTick=now;
 if(delta>90||delta<0){timer.running=false;return true;}
 timer.seconds=Math.min(86400,timer.seconds+Math.max(0,delta));if(timer.seconds>=86400)timer.running=false;
 return false;
}
export function pauseOnLoad(timer){timer.running=false;timer.lastTick=0;return timer;}
export function accuracy(state,skill,questions){const ids=new Set(questions.filter(q=>!skill||q.skill===skill).map(q=>q.id));let total=0,correct=0;for(const[id,r]of Object.entries(state.reviews))if(ids.has(id)){total+=r.total;correct+=r.correct;}return {total,correct,percent:total?Math.round(correct/total*100):null};}
export function activeDays(state){const d=new Set([...state.attempts.map(a=>a.date),...state.sessions.map(a=>a.date),...Object.values(state.reviews).map(r=>r.lastXP)]);d.delete('');return d.size;}
export function drill(id,seed){
 const h=hash(seed),n=h%15+2,base=0x300000+(h%256)*256;
 const hex=n=>'0x'+(n>>>0).toString(16).toUpperCase();
 switch(id){
 case 'F01':{const value=(0x12345678+h)>>>0,answer=Array.from({length:4},(_,i)=>((value>>>(i*8))&255).toString(16).padStart(2,'0')).join(' ');return {prompt:`Encode ${hex(value)} as four little-endian bytes. Enter pairs separated by spaces.`,answer,mode:'bytes',explanation:'Place the least-significant byte first; keep exactly four bytes.',hint:'Work from the rightmost hexadecimal pair toward the left.'};}
 case 'F02':{const index=h%5;return{prompt:`An array of eight uint32_t elements starts at ${hex(base)}. uint32_t is four bytes. What is the address of element ${index}? Enter hexadecimal (0x...) or decimal.`,answer:base+index*4,mode:'number',explanation:`Address = base + index × element size = ${hex(base+index*4)}.`,hint:'This is pointer arithmetic, not byte indexing.'};}
 case 'F03':return{prompt:`32-bit operands and stack. ESP=${hex(base)}. Trace:\nPUSH EAX\nPUSH EBX\nPOP ECX\nSUB ESP, ${hex(n*4)}\n\nWhat is the final ESP?`,answer:base-4-n*4,mode:'number',explanation:`Each 32-bit PUSH subtracts 4; POP adds 4. Final ESP is ${hex(base-4-n*4)}.`,hint:'Calculate a separate delta for each instruction.'};
 case 'F04':return{prompt:`Fictional crash: EAX=${hex(base)}, ECX=${hex(n)}. The faulting instruction is MOV EDX, DWORD PTR [EAX+ECX*4+0x10]. What address is it trying to read?`,answer:base+n*4+16,mode:'number',explanation:`The operand reads ${hex(base+n*4+16)}. This observation alone does not prove EIP control.`,hint:'Compute base + scaled index + displacement.'};
 case 'F05':return{prompt:`Trace this original parser condition. Input length=${n}, byte at index 0=0x46.\nif (length >= ${n+1} && data[0] == 0x46) accept();\nelse reject();\n\nEnter accept or reject.`,answer:'reject',mode:'text',explanation:'The length condition fails. The first byte cannot rescue a failed AND condition.',hint:'Evaluate the first condition before the second.'};
 default:return{prompt:`A fictional symbol is loaded at ${hex(base+0x2460)}. Its RVA in the same image version is 0x2460. What is the runtime module base?`,answer:base,mode:'number',explanation:`Module base = symbol VA − its RVA = ${hex(base)}. This is a simulation, not a debugger observation.`,hint:'Virtual address and relative virtual address use different origins.'};
 }
}
export function checkDrill(d,value){
 if(typeof value!=='string'||value.length>128)return false;
 const v=value.trim().toLowerCase();
 if(d.mode==='number'){if(!/^(0x[0-9a-f]+|[0-9]+)$/.test(v))return false;return Number(v)===d.answer;}
 if(d.mode==='bytes')return v.replace(/\s+/g,' ')===d.answer.toLowerCase();
 return v===String(d.answer).toLowerCase();
}
