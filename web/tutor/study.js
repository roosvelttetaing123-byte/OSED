/* Presentation helpers: a study route, not a new progress/grading system. */
import {lessons, lessonById} from './catalog.js';
export const studyPath = lessons.filter(l => l.id !== 'welcome');
const initialIds = ['bytes','registers','endian','pointers','stack','returns','frames'];
export const units = [
  {id:'memory', title:'Memory, without the mystery', description:'Bytes, registers, pointers and the stack. Start here; no tools needed.', ids:initialIds},
  {id:'debugging', title:'Get comfortable in WinDbg', description:'Pause a program, inspect its memory and follow what changes.', ids:studyPath.filter(l=>l.chapter===2&&!initialIds.includes(l.id)).map(l=>l.id)},
  {id:'overflow', title:'Understand stack corruption', description:'Follow input, find boundaries and explain a crash.', ids:studyPath.filter(l=>l.chapter===3&&!initialIds.includes(l.id)).map(l=>l.id)},
  {id:'exceptions', title:'Follow exception handling', description:'Learn what changes when Windows handles an exception.', ids:studyPath.filter(l=>l.chapter===4).map(l=>l.id)},
  {id:'reversing', title:'Read a program’s logic', description:'Connect static analysis with what happens at runtime.', ids:studyPath.filter(l=>l.chapter===5).map(l=>l.id)},
  {id:'space', title:'Work with limited space', description:'Understand secondary buffers, page checks and portability.', ids:studyPath.filter(l=>l.chapter===6).map(l=>l.id)},
  {id:'shellcode', title:'Build shellcode knowledge', description:'Calling conventions, exports and position-independent code.', ids:studyPath.filter(l=>l.chapter===7).map(l=>l.id)},
  {id:'bugs', title:'Find bugs through reversing', description:'Trace how input becomes data used by the program.', ids:studyPath.filter(l=>l.chapter===8).map(l=>l.id)},
  {id:'dep', title:'Understand DEP and ROP', description:'Permissions, gadget side effects and stack accounting.', ids:studyPath.filter(l=>l.chapter===9).map(l=>l.id)},
  {id:'aslr', title:'Reason about changing addresses', description:'Leaks, relative offsets and constrained decoding.', ids:studyPath.filter(l=>l.chapter===10).map(l=>l.id)},
  {id:'formats', title:'Read, write and pivot', description:'Format-string primitives and the assumptions that connect them.', ids:studyPath.filter(l=>l.chapter>=11).map(l=>l.id)}
].filter(u=>u.ids.length);
export const unitFor = id => units.find(u=>u.ids.includes(id));
export function recommended(s) {
  const selected = lessonById(s.teaching.selected);
  if (selected && selected.id !== 'welcome' && s.teaching.records[selected.id] && !s.teaching.records[selected.id].completed) return selected;
  return studyPath.find(l=>!s.teaching.records[l.id]?.completed) || null;
}
export function nextLesson(id) { const i=studyPath.findIndex(l=>l.id===id); return i<0?studyPath[0]:studyPath[i+1]||null; }
export const phaseFor = step => step<2?step:step<4?2:3;
export const phaseNames = ['Understand','See an example','Practise','Recap'];
export function phaseAllowed(r, phase) {
  if (phase<2) return true;
  if (phase===2) return r.step>=2||r.guided.tries>0||r.completed;
  return r.solo.correct&&!r.solo.revealed&&!r.solo.hints&&r.solo.tries===1;
}
export const shortTitles = {bytes:'Bytes & addresses',registers:'Meet the CPU registers',endian:'Little-endian storage',pointers:'Follow a pointer',stack:'PUSH, POP & the stack',returns:'Where functions return',frames:'Find your way around a stack frame'};
export const displayTitle = l => shortTitles[l.id]||l.title;
export const shortGoals = {
  bytes:'Tell the difference between where a byte lives and the value it holds.',
  registers:'Read the different-sized views of one CPU register.',
  endian:'Put a four-byte value into memory in the right order.',
  pointers:'Explain why EAX and [EAX] can give you different values.',
  stack:'Predict how PUSH and POP change ESP and the top of the stack.',
  returns:'Track the saved return address from CALL to RET.',
  frames:'Use a stated stack-frame layout to locate an argument.'
};
export const goalFor = l => shortGoals[l.id]||l.explain.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||l.title;
export function progress(s) {return {done:studyPath.filter(l=>s.teaching.records[l.id]?.completed).length,total:studyPath.length};}
export const phasesToSteps=[0,1,2,4];
