import {foundationRows} from './lessons.js';
import {advancedRows} from './advanced.js';
const ordered=[...foundationRows,...advancedRows];
const reg=ordered.splice(ordered.findIndex(r=>r[0]==='registers'),1)[0];ordered.splice(2,0,reg);
export const lessons=ordered.map((r,i)=>({id:r[0],chapter:r[1],title:r[2],sections:r[3].split(' '),pages:r[4],kind:r[5],explain:r[6],simple:r[7],practice:r[8],scope:r[9],order:i,minutes:i<27?'10–20':'15–30',previous:i?(ordered[i-1][0]):null}));
export const lessonById=id=>lessons.find(l=>l.id===id);
export const chapters=['','Orientation','WinDbg & x86','Stack overflows','SEH','IDA & static analysis','Space restrictions & egghunters','Custom shellcode','Reverse engineering for bugs','DEP & ROP','ASLR & constrained chains','Format-string reads','Format-string writes & pivots','Integrated challenges'];
export const modes=['Learn','Watch','Guided','Solo','Remember','Windows practice'];
