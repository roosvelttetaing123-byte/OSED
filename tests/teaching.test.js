import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,lessonById} from '../web/tutor/catalog.js';
import {sourceIndex} from '../web/tutor/coverage.js';
import {exercise,check,hex} from '../web/tutor/models.js';
import {freshState,normalize,ensureRecord,submit,complete,retry,canComplete,dueLessons,startReview,answerReview} from '../web/tutor/state.js';
import {initialState} from '../web/engine.js';
import {nativeGuides} from '../web/tutor/windows.js';
const correct=x=>String(x.answer);
function prepared(id='bytes') {const s=freshState('2026-10-01'),r=ensureRecord(s,id,'seed');return {s,r,l:lessonById(id)};}
function pass(r,l){for(const p of ['guided','solo'])submit(r,p,l.kind,correct(exercise(l.kind,r[p].seed)));r.reflection='The address names a place; the stored value is separate.';}
test('teaching: all 57 lessons have explanations, worked models and real source IDs',()=>{
 assert.equal(lessons.length,57);assert.equal(new Set(lessons.map(l=>l.id)).size,57);
 for(const l of lessons){assert.ok(l.explain.length>100);assert.ok(l.simple.length>50);assert.ok(l.practice.length>80);assert.ok(l.pages[0]>=1&&l.pages[1]<=604);for(const s of l.sections)assert.ok(sourceIndex.some(x=>x.section===s),`${l.id} => ${s}`);assert.ok(exercise(l.kind,l.id).steps.length>=3);}
});
test('teaching: source inventory does not label exercise groups completed',()=>{assert.equal(sourceIndex.length,375);assert.equal(sourceIndex.filter(s=>s.type==='exercise').length,144);assert.equal(new Set(sourceIndex.map(s=>s.section)).size,375);});
for(const kind of new Set(lessons.map(l=>l.kind)))test(`model ${kind}: deterministic, typed answers checked across 40 seeds`,()=>{
 for(let n=0;n<40;n++){const x=exercise(kind,'case'+n);assert.deepEqual(x,exercise(kind,'case'+n));assert.ok(check(x,correct(x)));assert.equal(check(x,'not an answer'),false);assert.ok(x.steps.every(s=>typeof s==='string'&&s.length>5));if(x.answerType==='choice')assert.ok(x.answer>=0&&x.answer<x.options.length);}
});
test('models: stack, return, frame, count and jump answers checked independently',()=>{
 for(let n=0;n<100;n++){const s=exercise('stack','ind'+n),b=Number(s.display.rows[0][1]);assert.equal(s.answer,b-4);
 const r=exercise('return','ind'+n);assert.equal(r.answer,Number(r.display.rows[1][1]));
 const d=exercise('dump','ind'+n);const count=Number(d.display.rows[1][0].slice(3));assert.equal(d.answer,4*count);
 const j=exercise('jump','ind'+n);const row=j.display.rows[0];assert.equal(j.answer,Number(row[0])+Number(row[1])+Number(row[2]));}
});
test('models: byte representations exactly match DataView little endian',()=>{for(let n=0;n<100;n++){const x=exercise('endian','byte'+n),v=Number(x.display.rows[0][0]);const buf=new ArrayBuffer(4);new DataView(buf).setUint32(0,v,true);assert.equal(x.answer,[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join(' '));}});
test('models: rotations, negation and decoder adjustments are bounded',()=>{for(let n=0;n<100;n++){const r=exercise('rotate','n'+n),v=BigInt(r.display.rows[0][0]);assert.equal(BigInt(r.answer),(v/2n)|((v%2n)<<31n));const d=exercise('decode','n'+n);assert.equal((Number(d.display.rows[0][0])+d.answer)%256,Number(d.display.rows[0][1]));assert.ok(r.answer>=0&&r.answer<=0xffffffff);}});
test('models: unknown model rejects rather than silently returning another task',()=>assert.throws(()=>exercise('missing','seed')));
test('models: malformed numeric input cannot evaluate code',()=>{const x=exercise('stack','x');assert.equal(check(x,'1+1'),false);assert.equal(check(x,'NaN'),false);assert.equal(check(x,'Infinity'),false);assert.equal(check(x,' 0x '+x.answer),false);assert.equal(check(x,hex(x.answer)),true);});
test('migration: original notes, attempts and quiz history survive',()=>{const old=initialState('2026-10-01');old.chapters['2']={stage:'practising',note:'My original notes'};old.sessions.push({id:'a',date:'2026-10-01',minutes:20,topic:'Old session'});old.xp=30;const snapshot=JSON.stringify(old);const next=normalize(old);assert.deepEqual(next.chapters,old.chapters);assert.deepEqual(next.sessions,old.sessions);assert.equal(next.xp,30);assert.equal(next.teaching.version,1);assert.equal(next.teaching.selected,'welcome');assert.equal(JSON.stringify(old),snapshot);});
test('progress: partial lesson and its seed resume after serialization',()=>{const {s,r}=prepared();r.step=2;r.guided.hints=1;r.reflection='a partial note';assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);});
test('progress: completion requires first-try solo, guided success and a reflection',()=>{const {r,l}=prepared();assert.throws(()=>complete(r));pass(r,l);assert.equal(canComplete(r),true);assert.equal(complete(r,'2026-10-01'),true);assert.equal(complete(r,'2026-10-01'),false);assert.equal(r.due,'2026-10-02');});
test('progress: no independent credit after reveal, hint or a failed solo try',()=>{for(const what of ['revealed','hints','tries']){const {r,l}=prepared();pass(r,l);r.solo[what]=what==='revealed'?true:what==='hints'?1:2;assert.equal(canComplete(r),false);assert.throws(()=>complete(r));}});
test('progress: fresh case resets assistance but not reflection or legacy data',()=>{const {s,r,l}=prepared();r.solo.revealed=true;r.reflection='my note';retry(r,'solo','newseed');assert.equal(r.solo.revealed,false);assert.equal(r.reflection,'my note');assert.equal(s.sessions.length,0);assert.throws(()=>retry(r,'solo','newseed'));});
test('progress: a forged correct flag cannot survive validation',()=>{const {s,r}=prepared();r.solo.correct=true;r.solo.answer='999999999';assert.throws(()=>normalize(s));});
test('progress: malformed teaching backup and unknown IDs reject',()=>{const {s}=prepared();s.teaching.records.fake={};assert.throws(()=>normalize(s));assert.throws(()=>normalize({...freshState(),teaching:null}));});
test('review: only taught topics become due',()=>{const {s,r,l}=prepared();assert.equal(dueLessons(s,'2026-10-02').length,0);assert.throws(()=>startReview(s,'pivot','x'));pass(r,l);complete(r,'2026-10-01');assert.deepEqual(dueLessons(s,'2026-10-02').map(l=>l.id),['bytes']);});
test('review: an answer is recorded once and next due date survives reload',()=>{const {s,r,l}=prepared();pass(r,l);complete(r,'2026-10-01');startReview(s,'bytes','review1','2026-10-02');answerReview(s,correct(exercise(l.kind,'review1')),'2026-10-02');assert.equal(r.due,'2026-10-05');assert.throws(()=>answerReview(s,'1'));assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);});
test('native guides: commands and expectations exist for all five observation modes',()=>{assert.equal(Object.keys(nativeGuides).length,5);for(const g of Object.values(nativeGuides)){assert.ok(g.steps.length>=5);assert.ok(g.steps.every(s=>s.length===3&&s[0].length>5&&s[1].length>0&&s[2].length>20));}});

test('transfer: guided and solo scenarios differ for every lesson',()=>{for(const l of lessons){const s=freshState(),r=ensureRecord(s,l.id,'test');const a=exercise(l.kind,r.guided.seed),b=exercise(l.kind,r.solo.seed);assert.notEqual(a.prompt+JSON.stringify(a.display),b.prompt+JSON.stringify(b.display),l.id);}});
