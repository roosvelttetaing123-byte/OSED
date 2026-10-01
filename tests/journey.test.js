import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,ensureRecord,submit,complete,startReview,answerReview,normalize} from '../web/tutor/state.js';
import {exercise} from '../web/tutor/models.js';
import {lessonById} from '../web/tutor/catalog.js';
import {studyPath,units} from '../web/tutor/study.js';
import {journey,unitProgress,readiness,readinessGates,glossary,rewards} from '../web/tutor/journey.js';

const today='2026-10-01';
function finish(s,id){
  const l=lessonById(id),r=ensureRecord(s,id,'journey-'+id);
  for(const part of ['guided','solo'])submit(r,part,l.kind,String(exercise(l.kind,r[part].seed).answer));
  r.reflection='I can explain this idea using the example.';
  complete(r,today);
  return r;
}
function review(s,id,correct=true,date='2026-10-02'){
  const seed='review-'+s.teaching.records[id].reviewCount;
  startReview(s,id,seed,date);
  answerReview(s,correct?String(exercise(lessonById(id).kind,seed).answer):'not-an-answer',date);
}

test('journey: a new learner starts with no invented rewards or evidence',()=>{
  const s=freshState(today),j=journey(s,today),r=readiness(s,today);
  assert.equal(j.xp,0);assert.equal(j.level,1);assert.equal(j.done,0);assert.equal(j.total,56);
  assert.equal(j.reviewAttempts,0);assert.equal(j.dueReviews,0);
  assert.ok(j.achievements.every(a=>!a.earned));
  assert.equal(r.checked,0);assert.equal(r.nextGate.id,'foundation');assert.equal(r.allReported,false);
  assert.ok(!('percent' in r));assert.ok(!('ready' in r));
});

test('journey: completion awards once and survives reload without mutating state',()=>{
  const s=freshState(today),r=finish(s,'bytes'),before=JSON.stringify(s);
  assert.equal(journey(s,today).xp,40);assert.equal(complete(r,today),false);
  assert.deepEqual(journey(normalize(JSON.parse(before)),today),journey(s,today));
  assert.equal(JSON.stringify(s),before);
  assert.equal(journey(s,today).achievements.find(a=>a.id==='first-lesson').earned,true);
});

test('journey: only a first review per distinct completed lesson earns review XP',()=>{
  const s=freshState(today);finish(s,'bytes');review(s,'bytes',false);
  const failed=journey(s,'2026-10-02');
  assert.equal(failed.reviewXP,10);assert.equal(failed.reviewedLessons,1);assert.equal(failed.reviewAttempts,1);
  for(let i=0;i<20;i++)review(s,'bytes');
  assert.equal(journey(s,today).xp,50);assert.equal(journey(s,today).reviewAttempts,21);
  finish(s,'registers');review(s,'registers');
  assert.equal(journey(s,today).xp,100);assert.equal(journey(s,today).reviewedLessons,2);
});

test('journey: views, partial answers, orientation and unrelated legacy XP add no rewards',()=>{
  const s=freshState(today);finish(s,'welcome');
  ensureRecord(s,'bytes','partial').guided.tries=9;
  s.xp=1000;s.reviews.Q001={total:80,correct:80};
  s.teaching.records.unknown={completed:true,reviewCount:100};
  assert.equal(journey(s,today).xp,0);assert.equal(journey(s,today).done,0);
});

test('journey: level boundaries follow the earned XP total',()=>{
  const s=freshState(today);
  for(const l of studyPath.slice(0,4))finish(s,l.id);
  assert.equal(journey(s,today).level,1);assert.equal(journey(s,today).xpToNextLevel,40);
  finish(s,studyPath[4].id);
  const j=journey(s,today);
  assert.equal(j.xp,rewards.levelSize);assert.equal(j.level,2);assert.equal(j.levelXP,0);assert.equal(j.xpToNextLevel,200);
});

test('journey: due reviews use real due dates and ignore unfinished lessons',()=>{
  const s=freshState(today);finish(s,'bytes');ensureRecord(s,'stack','partial').due=today;
  assert.equal(journey(s,today).dueReviews,0);assert.equal(journey(s,'2026-10-02').dueReviews,1);
  review(s,'bytes');assert.equal(journey(s,'2026-10-02').dueReviews,0);
});

test('journey: unit progress requires every real lesson and excludes orientation',()=>{
  const s=freshState(today);finish(s,'welcome');
  const first=units[0];ensureRecord(s,first.ids[0],'start');
  assert.equal(unitProgress(s)[0].started,true);assert.equal(unitProgress(s)[0].done,0);
  for(const id of first.ids.slice(0,-1))finish(s,id);
  assert.equal(unitProgress(s)[0].complete,false);
  finish(s,first.ids.at(-1));
  const p=unitProgress(s)[0];
  assert.equal(p.done,first.ids.length);assert.equal(p.total,first.ids.length);assert.equal(p.percent,100);assert.equal(p.complete,true);
  assert.equal(unitProgress(s).reduce((n,u)=>n+u.total,0),56);
  assert.equal(journey(s,today).achievements.find(a=>a.id==='first-unit').earned,true);
});

test('readiness: completing every concept and review never checks a practical gate',()=>{
  const s=freshState(today);
  for(const l of studyPath){finish(s,l.id);review(s,l.id);}
  const j=journey(s,today),r=readiness(s,today);
  assert.equal(j.xp,56*(rewards.lesson+rewards.firstReview));assert.ok(j.achievements.every(a=>a.earned));
  assert.equal(j.atMaxLevel,true);assert.equal(j.level,j.maxLevel);assert.equal(j.xpToNextLevel,0);assert.equal(j.levelXP,j.levelSize);
  assert.equal(r.concept.done,56);assert.equal(r.checked,0);assert.equal(r.evidence.reviewedLessons,56);
  assert.equal(r.allReported,false);
});

test('readiness: existing check IDs are deduplicated and remain explicitly self-reported',()=>{
  const s=freshState(today);s.checks=['foundation','foundation','unknown'];
  const r=readiness(s,today);
  assert.equal(r.checked,1);assert.equal(r.nextGate.id,'stack');assert.ok(r.gates.every(g=>g.selfReported));
  s.checks=readinessGates.map(g=>g.id);
  const all=readiness(s,today);
  assert.equal(all.allReported,true);assert.equal(all.nextGate,null);assert.equal(all.total,6);
  assert.match(all.message,/cannot verify an exam pass/);
});

test('readiness: drill passes and ungraded notes cannot become practical pass evidence',()=>{
  const s=freshState(today);s.attempts=[
    {id:'drill',labId:'F02',status:'drill',passed:true,note:'correct'},
    {id:'one',labId:'F02',status:'independent',passed:false,note:'Observed the value in WinDbg.'},
    {id:'two',labId:'B01',status:'reproduced',passed:false,note:''},
    {id:'three',labId:'B02',status:'blocked',passed:false,note:'Need more practice.'}
  ];
  ensureRecord(s,'bytes','notes').nativeNote='I observed one changed byte.';
  const before=JSON.stringify(s),r=readiness(s,today);
  assert.deepEqual(r.evidence,{practicalAttempts:3,independentAttempts:1,reproducedAttempts:1,nativeNotes:1,reviewedLessons:0});
  assert.equal(r.gates[0].attempts,1);assert.equal(r.gates[0].notedAttempts,1);
  assert.equal(r.gates.find(g=>g.id==='rebuild').notedAttempts,0);
  assert.equal(r.checked,0);assert.equal(JSON.stringify(s),before);
});

test('glossary: twenty unique terms link to actual study lessons',()=>{
  assert.equal(glossary.length,20);assert.equal(new Set(glossary.map(t=>t.id)).size,20);
  for(const entry of glossary){
    assert.ok(lessonById(entry.lessonId),entry.term);
    assert.ok(entry.definition.length>20);assert.ok(entry.example.length>20);
  }
});

test('readiness: new gate journal IDs link observations without auto-checking a gate',()=>{
  const s=freshState(today);s.attempts=[
    {id:'new-gate',labId:'gate-shellcode',status:'independent',passed:true,note:'Own lab and observed result'},
    {id:'new-drill',labId:'gate-shellcode',status:'drill',passed:true,note:'Simulator answer'}
  ];
  const r=readiness(s,today),gate=r.gates.find(g=>g.id==='shellcode');
  assert.equal(gate.attempts,1);assert.equal(gate.notedAttempts,1);assert.equal(gate.checked,false);
  assert.equal(r.evidence.practicalAttempts,1);
});
