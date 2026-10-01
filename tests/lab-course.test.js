import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {labCourse} from '../web/tutor/lab-course.js';
import {lessonById} from '../web/tutor/catalog.js';
import {sourceIndex} from '../web/tutor/coverage.js';
import {freshState,normalize} from '../web/tutor/state.js';
import {displayTitle} from '../web/tutor/study.js';
import {readiness} from '../web/tutor/journey.js';

const app=fs.readFileSync(new URL('../web/tutor/app.js',import.meta.url),'utf8').replace(/^import .*;\r?$/gm,'').split('(async()=>{try{S=await load();')[0];
function harness({save=async()=>{},values={}}={}){
  const forms={},writes=[],events={};
  const context=vm.createContext({labCourse,lessonById,sourceIndex,displayTitle,normalize,FormData,console,
    crypto:{randomUUID:()=> 'test-attempt'},day:()=> '2026-10-01',clearTimeout(){},setTimeout(){},
    persist:async candidate=>{writes.push(candidate);await save(candidate);},
    localStorage:{getItem:key=>values[key]||null,setItem:(key,value)=>values[key]=value},
    document:{querySelector:q=>q==='#lab-evidence-form'?forms['lab-evidence-form']:null,querySelectorAll:()=>[],getElementById:id=>forms[id],addEventListener:(name,fn)=>events[name]=fn},
    window:{addEventListener(){}}
  });
  vm.runInContext(app,context);context.initial=freshState('2026-10-01');vm.runInContext('S=initial;',context);
  return {context,forms,values,writes,events,getState:()=>vm.runInContext('S',context)};
}
function data(extra={}){const d=new FormData();for(const [key,value] of Object.entries({'field-target':'lesson_lab x86, copy mode','field-observation':'The second count was 9 and the return value was 0.',status:'assisted',hints:'0',minutes:'',...extra}))d.set(key,value);return d;}

test('native route: prerequisites, source sections and command symbols exist',()=>{
  for(const id of labCourse.prerequisites)assert.ok(lessonById(id),id);
  for(const section of labCourse.sections)assert.ok(sourceIndex.some(s=>s.section===section),section);
  assert.equal(new Set(labCourse.stages.map(s=>s.id)).size,labCourse.stages.length);
  assert.equal(new Set(labCourse.evidenceFields.map(f=>f.id)).size,5);
  const nativeSource=fs.readFileSync(new URL('../labs/lesson_lab.c',import.meta.url),'utf8');
  for(const step of labCourse.stages.flatMap(s=>s.steps))for(const match of (step.command||'').matchAll(/lesson_lab!([a-z_]+)/g))assert.ok(nativeSource.includes(match[1]),match[1]);
});
test('native evidence: commit waits for persistence and adds no XP or checklist credit',async()=>{
  let finish;const h=harness({save:()=>new Promise(resolve=>finish=resolve)}),before=JSON.stringify(h.getState());
  const saving=h.context.commitLabEvidence(data({passed:'on'}));
  assert.equal(JSON.stringify(h.getState()),before);assert.equal(h.writes.length,1);
  finish();await saving;const state=h.getState();
  assert.equal(state.attempts.length,1);assert.equal(state.attempts[0].labId,'copy-observation');assert.equal(state.attempts[0].passed,true);
  assert.equal(state.xp,0);assert.equal(state.checks.length,0);assert.equal(readiness(state).gates.find(g=>g.id==='foundation').attempts,1);
  assert.equal(readiness(state).gates.find(g=>g.id==='foundation').checked,false);
  assert.deepEqual(normalize(state),state);
});
test('native evidence: persistence failure keeps state and draft unchanged',async()=>{
  const values={'osed-forge-form-drafts':JSON.stringify({'lab-evidence-form':{'field-target':'Unsaved target',stage:'2'}})};
  const h=harness({values,save:async()=>{throw Error('Storage is full');}}),before=JSON.stringify(h.getState()),draft=values['osed-forge-form-drafts'];
  await assert.rejects(h.context.commitLabEvidence(data()),/Storage is full/);
  assert.equal(JSON.stringify(h.getState()),before);assert.equal(values['osed-forge-form-drafts'],draft);assert.equal(vm.runInContext('saveFailed',h.context),true);
});
test('native evidence: journal capacity rejects before any mutation or persistence',async()=>{
  const h=harness();h.getState().attempts=Array.from({length:4000},()=>({id:'retained'}));const before=JSON.stringify(h.getState());
  await assert.rejects(h.context.commitLabEvidence(data()),/4,000/);assert.equal(h.writes.length,0);assert.equal(JSON.stringify(h.getState()),before);
});
test('native evidence: hints cannot be submitted as independent work',async()=>{
  const h=harness();await assert.rejects(h.context.commitLabEvidence(data({status:'independent',hints:'1'})),/With guidance/);
  assert.equal(h.writes.length,0);assert.equal(h.getState().attempts.length,0);
});
test('native evidence: aggregate limit includes field headings and accepts exactly 10000',()=>{
  const h=harness(),d=data();const remaining=10000-h.context.labEvidenceNote(d).length;
  d.set('field-observation',d.get('field-observation')+'x'.repeat(remaining));
  assert.equal(h.context.createLabAttempt(d,'id','2026-10-01').note.length,10000);
  d.set('field-fresh','x');assert.throws(()=>h.context.createLabAttempt(d,'id','2026-10-01'),/10,000/);
});
test('native evidence: malformed metadata and missing observations reject',()=>{
  const h=harness();for(const changed of [{status:'drill'},{minutes:'-1'},{minutes:'1.5'},{hints:'4'},{'field-observation':'  '}])assert.throws(()=>h.context.createLabAttempt(data(changed),'id','2026-10-01'));
});
test('native route: stage navigation and reload restore every draft value',()=>{
  const values={},h=harness({values});
  const elements=[{name:'field-target',value:'My target'},{name:'field-observation',value:'My exact result'},{name:'status',value:'blocked'},{name:'minutes',value:'25'},{name:'hints',value:'2'},{name:'passed',type:'checkbox',checked:true},{name:'stage',value:'0'}];
  h.forms['lab-evidence-form']={id:'lab-evidence-form',elements};
  const before=JSON.stringify(h.getState());vm.runInContext('render=()=>{};',h.context);h.context.moveLabStage(2);
  assert.equal(JSON.stringify(h.getState()),before);
  const restored=harness({values});restored.forms['lab-evidence-form']={elements:elements.map(el=>({...el,value:'',checked:false}))};
  restored.context.restoreDrafts();assert.equal(vm.runInContext('labStage',restored.context),2);
  assert.equal(restored.forms['lab-evidence-form'].elements[0].value,'My target');assert.equal(restored.forms['lab-evidence-form'].elements[1].value,'My exact result');assert.equal(restored.forms['lab-evidence-form'].elements[5].checked,true);
});
test('native route: corrupt saved stage clamps safely and only one stage is rendered',()=>{
  const h=harness({values:{'osed-forge-form-drafts':JSON.stringify({'lab-evidence-form':{stage:'99999'}})}});
  assert.equal(vm.runInContext('labStage',h.context),3);assert.equal(h.context.clampLabStage('NaN'),0);
  const html=h.context.lab();assert.ok(html.includes(labCourse.stages[3].intro));assert.ok(!html.includes(labCourse.stages[0].intro));
  vm.runInContext('labStage=1;',h.context);const observed=h.context.lab();assert.equal((observed.match(/class="practical-expect"/g)||[]).length,4);assert.ok(!/class="practical-expect"[^>]*open/.test(observed));
});
test('native route: the offline cache includes the module and every listed file exists',()=>{
  const sw=fs.readFileSync(new URL('../web/sw.js',import.meta.url),'utf8');assert.ok(sw.includes('./tutor/lab-course.js'));
  const files=JSON.parse(sw.match(/const FILES=(\[[^;]+\]);/)[1]);for(const file of files)assert.ok(fs.existsSync(new URL('../web/'+file,import.meta.url)),file);
});
