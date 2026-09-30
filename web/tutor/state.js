import {initialState,validateState,day,addDays,validDay} from '../engine.js';
import {lessons,lessonById} from './catalog.js';
import {exercise,check} from './models.js';
const freshTrial=seed=>({seed,answer:'',correct:false,revealed:false,hints:0,tries:0});
export const initialTeaching=()=>({version:1,selected:'welcome',records:{},review:null});
const signature=x=>x.prompt+JSON.stringify(x.display);
function differentSeed(kind,seed,avoid){let candidate=seed;for(let i=0;i<80&&signature(exercise(kind,candidate))===signature(exercise(kind,avoid));i++)candidate=seed+':'+i;return candidate;}
export function newRecord(id,seed){const kind=lessonById(id).kind,guided=seed+':guided',solo=differentSeed(kind,seed+':solo',guided);return {step:0,watch:0,guided:freshTrial(guided),solo:freshTrial(solo),reflection:'',nativeNote:'',completed:false,completedOn:'',due:'',reviewCount:0};}
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const str=(x,max)=>typeof x==='string'&&x.length<=max;
const int=(x,max)=>Number.isInteger(x)&&x>=0&&x<=max;
function trialOK(t){return object(t)&&str(t.seed,120)&&t.seed.length>0&&str(t.answer,160)&&typeof t.correct==='boolean'&&typeof t.revealed==='boolean'&&int(t.hints,3)&&int(t.tries,10000);}
export function validateTeaching(t){
 if(t===undefined)return initialTeaching();
 const fail=()=>{throw new Error('Invalid lesson progress in backup. Existing data has not been replaced.');};
 if(!object(t)||t.version!==1||!lessonById(t.selected)||!object(t.records)||Object.keys(t.records).length>200)fail();
 for(const[id,r]of Object.entries(t.records)){
  if(!lessonById(id)||!object(r)||!int(r.step,5)||!int(r.watch,20)||!trialOK(r.guided)||!trialOK(r.solo)||!str(r.reflection,5000)||!str(r.nativeNote,10000)||typeof r.completed!=='boolean'||!int(r.reviewCount,10000))fail();
  for(const key of ['completedOn','due'])if(r[key]!==''&&!validDay(r[key]))fail();
  if(r.completed&&(!r.guided.correct||!r.solo.correct||r.solo.revealed||r.solo.hints>0||r.solo.tries!==1||r.reflection.trim().length<12||!r.completedOn||!r.due))fail();
  for(const trial of [r.guided,r.solo])if(trial.correct&&!check(exercise(lessonById(id).kind,trial.seed),trial.answer))fail();
 }
 if(t.review!==null&&(!object(t.review)||!lessonById(t.review.id)||!validDay(t.review.date)||!trialOK(t.review.trial)||typeof t.review.recorded!=='boolean'))fail();
 return structuredClone(t);
}
export function normalize(s){const legacy=validateState(s),teaching=validateTeaching(s.teaching);return {...legacy,teaching};}
export function freshState(today=day()){return {...initialState(today),teaching:initialTeaching()};}
export function ensureRecord(s,id,seed){if(!lessonById(id))throw new Error('Unknown lesson');return s.teaching.records[id]??=(newRecord(id,seed));}
export function submit(r,part,kind,answer){
 if(!['guided','solo'].includes(part))throw new Error('Invalid practice stage');
 const t=r[part];if(t.correct||t.revealed)return t.correct;
 t.answer=String(answer).slice(0,160);t.tries++;t.correct=check(exercise(kind,t.seed),t.answer);return t.correct;
}
export function canComplete(r){return !!r&&r.guided.correct&&r.solo.correct&&!r.solo.revealed&&r.solo.hints===0&&r.solo.tries===1&&r.reflection.trim().length>=12;}
export function complete(r,today=day()){if(!canComplete(r))throw new Error('Pass guided practice and a fresh first-try solo check, then write your own explanation.');if(r.completed)return false;r.completed=true;r.completedOn=today;r.due=addDays(today,1);return true;}
export function retry(r,part,seed,kind=null){if(!['guided','solo'].includes(part)||r.completed)throw new Error('Use Review for completed lessons.');if(seed===r[part].seed)throw new Error('A retry needs a new seed');r[part]=freshTrial(kind?differentSeed(kind,seed,r[part].seed):seed);}
export function dueLessons(s,today=day()){return lessons.filter(l=>s.teaching.records[l.id]?.completed&&s.teaching.records[l.id].due<=today).sort((a,b)=>s.teaching.records[a.id].due.localeCompare(s.teaching.records[b.id].due));}
export function startReview(s,id,seed,today=day()){if(!s.teaching.records[id]?.completed)throw new Error('Learn this topic before reviewing it.');s.teaching.review={id,date:today,trial:freshTrial(seed),recorded:false};}
export function answerReview(s,answer,today=day()){
 const q=s.teaching.review;if(!q||q.recorded)throw new Error('Start a fresh review.');
 q.trial.answer=String(answer).slice(0,160);q.trial.tries++;q.trial.correct=check(exercise(lessonById(q.id).kind,q.trial.seed),q.trial.answer);q.recorded=true;
 const r=s.teaching.records[q.id];r.reviewCount++;r.due=addDays(today,q.trial.correct?[3,7,14,30][Math.min(r.reviewCount-1,3)]:1);return q.trial.correct;
}
