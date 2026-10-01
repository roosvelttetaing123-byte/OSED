/* Read-only presentation helpers. Pass the normalized state from state.js.
   Rewards describe study activity; they never certify practical exam skills. */
import {day} from '../engine.js';
import {studyPath,units} from './study.js';

export const rewards=Object.freeze({lesson:40,firstReview:10,levelSize:200});
const records=s=>s.teaching?.records||{};
const completed=s=>studyPath.filter(l=>records(s)[l.id]?.completed===true);

/** Count each lesson once in its real unit. Percent is lesson completion only. */
export function unitProgress(s){
  const saved=records(s);
  return units.map(u=>{
    const ids=[...new Set(u.ids)],done=ids.filter(id=>saved[id]?.completed===true).length;
    return {...u,ids,done,total:ids.length,percent:Math.round(done/ids.length*100),complete:done===ids.length,started:ids.some(id=>!!saved[id])};
  });
}

/** Derive XP from unique completed lessons and one review reward per lesson.
 * A review reward means the learner attempted a review; reviewCount does not
 * store correct-answer history. Repeats, hints, and old state.xp add no XP here.
 * Orientation, unknown lesson IDs, and incomplete lessons receive no points.
 * Calling this helper never writes state, so reloads cannot award points again.
 */
export function journey(s,today=day()){
  const saved=records(s),done=completed(s),reviewed=done.filter(l=>saved[l.id].reviewCount>0);
  const lessonXP=done.length*rewards.lesson,reviewXP=reviewed.length*rewards.firstReview;
  const xp=lessonXP+reviewXP,maxXP=studyPath.length*(rewards.lesson+rewards.firstReview),atMaxLevel=xp===maxXP;
  const levelXP=atMaxLevel?rewards.levelSize:xp%rewards.levelSize;
  const completeUnits=unitProgress(s).filter(u=>u.complete);
  const achievements=[
    {id:'first-lesson',title:'First spark',description:'Finish one lesson with a solo answer and your own recap.',earned:done.length>=1},
    {id:'first-review',title:'Back for another try',description:'Try a review for one completed lesson.',earned:reviewed.length>=1},
    {id:'first-unit',title:'One chapter in your journey',description:'Finish every lesson in one study unit.',earned:completeUnits.length>=1},
    {id:'ten-lessons',title:'Building momentum',description:'Finish ten different concept lessons.',earned:done.length>=10},
    {id:'five-reviews',title:'Keeping ideas fresh',description:'Try reviews for five different completed lessons.',earned:reviewed.length>=5},
    {id:'all-concepts',title:'The full concept path',description:'Finish all current concept lessons. Keep practising in your lab.',earned:done.length===studyPath.length}
  ];
  return {
    done:done.length,total:studyPath.length,xp,lessonXP,reviewXP,
    reviewedLessons:reviewed.length,
    reviewAttempts:reviewed.reduce((n,l)=>n+saved[l.id].reviewCount,0),
    dueReviews:done.filter(l=>saved[l.id].due&&saved[l.id].due<=today).length,
    level:Math.floor(xp/rewards.levelSize)+1,levelXP,levelSize:rewards.levelSize,
    maxXP,maxLevel:Math.floor(maxXP/rewards.levelSize)+1,atMaxLevel,
    xpToNextLevel:rewards.levelSize-levelXP,achievements
  };
}

/** Existing saved checklist IDs. These are study checkpoints, not exam rules.
 * relatedLabs links existing journal attempts for context, never automatic credit.
 */
export const readinessGates=Object.freeze([
  {id:'foundation',title:'Use the foundations',description:'Solve fresh byte, C memory and x86 tasks. Then show the same ideas in a real debugger.',relatedLabs:['F01','F02','F03','F04','F05','F06','copy-observation']},
  {id:'stack',title:'Explain stack and SEH changes',description:'Work on a changed practice target. Explain the result and repeat it from a clean start.',relatedLabs:['L01','L02']},
  {id:'shellcode',title:'Build and debug your own code',description:'Debug your assembly without a solution guide. Trace how input moves through a program.',relatedLabs:['L03','L04','L08']},
  {id:'mitigations',title:'Handle protections and limits',description:'Explain ROP, ASLR and read or write limits. Check each assumption in your practice target.',relatedLabs:['L05','L06','L07']},
  {id:'rebuild',title:'Repeat the result from your report',description:'Start from a clean lab state. Repeat an integrated task using only your own report.',relatedLabs:['B01']},
  {id:'mocks',title:'Complete independent rehearsals',description:'Complete two substantial solo assessments and your official challenge work. Keep reports for each.',relatedLabs:['B02']}
]);

/** Summarize saved evidence without inventing a readiness percentage or pass
 * prediction. Checklist checks, lab status, and observation notes are all
 * self-reported. Even a simulator's passed flag cannot complete a gate.
 */
export function readiness(s,today=day()){
  const progress=journey(s,today),checkedIds=new Set(s.checks||[]);
  const practical=(s.attempts||[]).filter(a=>['assisted','independent','reproduced','blocked'].includes(a.status));
  const gates=readinessGates.map(g=>{
    const attempts=practical.filter(a=>a.labId==='gate-'+g.id||g.relatedLabs.includes(a.labId));
    return {...g,relatedLabs:[...g.relatedLabs],checked:checkedIds.has(g.id),selfReported:true,attempts:attempts.length,notedAttempts:attempts.filter(a=>a.note?.trim()).length};
  });
  const checked=gates.filter(g=>g.checked).length;
  return {
    gates,checked,total:gates.length,nextGate:gates.find(g=>!g.checked)||null,allReported:checked===gates.length,
    concept:{done:progress.done,total:progress.total},
    evidence:{
      practicalAttempts:practical.length,
      independentAttempts:practical.filter(a=>a.status==='independent').length,
      reproducedAttempts:practical.filter(a=>a.status==='reproduced').length,
      nativeNotes:studyPath.filter(l=>records(s)[l.id]?.nativeNote?.trim()).length,
      reviewedLessons:progress.reviewedLessons
    },
    message:checked===gates.length
      ?'You have marked all six practice checks. Review your reports and fresh independent work before choosing an exam date. This app cannot verify an exam pass.'
      :'Build practical evidence as you study. These six checks record your own assessment of your lab work.'
  };
}

/** Short definitions for an in-app glossary; lessonId links to the relevant
 * authored lesson. Examples use the same explicit 32-bit x86 model as the course.
 */
export const glossary=Object.freeze([
  {id:'byte',term:'Byte',definition:'A group of eight bits. One byte can hold a value from 0 to 255.',example:'0x2A is one byte with the decimal value 42.',lessonId:'bytes'},
  {id:'address',term:'Address',definition:'A number that identifies a location in memory.',example:'Address 0x2000 may hold the value 7. The address and the value are different.',lessonId:'bytes'},
  {id:'hex',term:'Hexadecimal (hex)',definition:'A way to write numbers using sixteen digits: 0–9 and A–F. The 0x prefix marks a hex number.',example:'0x10 means 16 in decimal.',lessonId:'bytes'},
  {id:'register',term:'Register',definition:'A small storage location inside the CPU. Registers hold values while instructions run.',example:'EAX holds 32 bits. AL names the lowest eight bits of that same register.',lessonId:'registers'},
  {id:'pointer',term:'Pointer',definition:'A value used as a memory address.',example:'If EAX contains 0x2000, it can point to the memory at address 0x2000.',lessonId:'pointers'},
  {id:'dereference',term:'Dereference',definition:'Use a pointer to read or write the memory it points to.',example:'MOV ECX, [EAX] reads a value from memory at the address held in EAX.',lessonId:'dereference'},
  {id:'endian',term:'Little-endian',definition:'A byte order that stores the least-significant byte at the lowest memory address.',example:'0x12345678 is stored as 78 56 34 12, from lowest to highest address.',lessonId:'endian'},
  {id:'stack',term:'Stack',definition:'Memory used for function data and saved control information. The last value pushed is the first one popped.',example:'In this 32-bit model, PUSH EAX subtracts 4 from ESP and stores EAX there.',lessonId:'stack'},
  {id:'esp',term:'ESP (stack pointer)',definition:'The register that holds the address of the current stack top in this 32-bit model.',example:'ESP is an address. The value stored at that address is a separate thing.',lessonId:'stack'},
  {id:'eip',term:'EIP (instruction pointer)',definition:'The register that identifies the next instruction in this 32-bit model.',example:'A plain RET loads the saved return address into EIP.',lessonId:'returns'},
  {id:'return-address',term:'Return address',definition:'The address where execution should continue after a function returns.',example:'A near CALL saves the address of the instruction after the call.',lessonId:'returns'},
  {id:'offset',term:'Offset',definition:'A distance from a known starting point. Its unit must be stated.',example:'A field at byte offset 8 from 0x2000 starts at 0x2008.',lessonId:'structures'},
  {id:'breakpoint',term:'Breakpoint',definition:'A debugger stop set at a chosen location or condition so you can inspect the program.',example:'A breakpoint at a function entry pauses when execution reaches that location.',lessonId:'breakpoints'},
  {id:'buffer',term:'Buffer',definition:'A region of memory used to hold data. It has a limited capacity.',example:'A buffer with room for 16 bytes cannot safely hold a 20-byte copy.',lessonId:'bounds'},
  {id:'seh',term:'SEH (Structured Exception Handling)',definition:'A Windows mechanism that lets a program respond to exceptions, such as an invalid memory access.',example:'An exception can transfer control to a handler. The details depend on the target and its protections.',lessonId:'seh'},
  {id:'calling-convention',term:'Calling convention',definition:'Rules for passing arguments, returning a result and cleaning up after a function call.',example:'In classic x86 cdecl, the caller normally removes the stack arguments.',lessonId:'calling'},
  {id:'dep',term:'DEP (Data Execution Prevention)',definition:'A protection that prevents instruction execution from memory pages marked as non-executable.',example:'Being able to read bytes from a page does not mean the CPU can execute them.',lessonId:'dep'},
  {id:'aslr',term:'ASLR (Address Space Layout Randomization)',definition:'A protection that can change where program components are placed in memory.',example:'A module may load at a different base address in another run.',lessonId:'aslr'},
  {id:'rop',term:'ROP (Return-Oriented Programming)',definition:'A technique that connects short instruction sequences already in memory, often using return instructions.',example:'Each sequence can change registers and ESP. Track every change in the chain.',lessonId:'rop'},
  {id:'rva',term:'RVA (Relative Virtual Address)',definition:'An address measured from the start of a module image.',example:'If the module base is 0x400000 and the RVA is 0x1200, the runtime address is 0x401200.',lessonId:'modules'}
]);
