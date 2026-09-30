// Commands target only the separately supplied original observation executable.
export const nativeGuides={
 memory:{title:'See addresses, bytes and pointers in WinDbg',mode:'memory',goal:'Distinguish a register, a memory address and the value stored there.',steps:[
 ['Open the program','In your disposable Windows VM, extract the new lab pack. Open its bin/lesson_lab.exe using WinDbg (x86): File → Open Executable. Put memory in Arguments. Keep lesson_lab.pdb beside the EXE.','The program pauses at an initial debugger break. This is not the lesson checkpoint yet.'],
 ['Load your lab symbols','.sympath+ C:\\YOUR_LAB_FOLDER\\bin\n.reload /f\nx lesson_lab!tutor*','Replace YOUR_LAB_FOLDER with your actual folder. The x command should list tutor variables/functions. Missing names mean symbol loading needs attention; do not guess addresses.'],
 ['Stop at our checkpoint','bu lesson_lab!checkpoint\ng','The debugger should stop inside checkpoint. This function gives you a stable point to inspect the original lab data.'],
 ['Read eight bytes','db lesson_lab!tutor_bytes L0n8','Expect 12 34 56 78 00 41 42 43. The address on the left varies; these initialized contents do not.'],
 ['Regroup the same first four bytes','dd lesson_lab!tutor_bytes L0n1','Expect 78563412. Explain why this is the same first four bytes, not a changed value in memory.'],
 ['Read a pointer field','dt lesson_lab!TUTOR_RECORD lesson_lab!tutor_record\ndd poi(lesson_lab!tutor_record+8) L0n4','In this lab’s x86 record, pointer is at offset 8. The pointed-to DWORDs are 7, 0x13, 0x1F, 0x2B (decimal 7,19,31,43). Explain the field address, the pointer value, and the first pointed-to number separately.'],
 ['Locate a pattern in this lab buffer','s -b lesson_lab!tutor_bytes L0n8 41 42 43','The match should start at tutor_bytes+5. This is a bounded eight-byte range; inspect the returned address with db.'],
 ['Watch the checkpoint write','ba w 4 lesson_lab!tutor_phase\ng','If still stopped at the checkpoint entry, continuing should break after it increments tutor_phase. Inspect r, uf lesson_lab!checkpoint and dd lesson_lab!tutor_phase L0n1. Record the actual writer rather than assuming EIP points at it.'],
 ['Change only the lab’s first array value','ed lesson_lab!tutor_words 0n11\ndd lesson_lab!tutor_words L0n4','The first value becomes 0x0B, the others stay unchanged. This edits memory in this disposable lab process, not your app’s saved study journal. Restarting the target restores initial values.']
 ],question:'Why did db show 12 34 56 78 while dd showed 78563412? Which command dereferenced a pointer rather than merely displaying its field address?'},
 call:{title:'Observe a call and a real stack frame',mode:'call',goal:'Find arguments and follow a return using the actual generated instructions.',steps:[
 ['Open the call variant','Open bin/lesson_lab.exe in WinDbg with Arguments: call. Load its matching symbols.','Stop at initial break before the program runs through the helper.'],
 ['Break at the helper entry','bu lesson_lab!tutor_add\ng\nr\ndd @esp L0n3','At the function entry, the stack should contain a return address followed by 3 and 9. These argument positions are for this lab’s x86 build.'],
 ['Read the generated function','uf lesson_lab!tutor_add','Locate its prologue, the addition and epilogue. Do not assume a particular number of instructions.'],
 ['Observe rather than memorise','t\nr @esp\nr @ebp','Repeat a step at a time while watching the actual prologue. After MOV EBP,ESP, inspect dd @ebp L0n4 and identify saved EBP, return address, 3 and 9.'],
 ['Stop just before returning','pt\nr @eax\ndd @esp L0n1','At the return, EAX should contain 12 (hex 0x0C). Predict the next EIP from the restored stack.'],
 ['Check the prediction','t\nr @eip\nr @esp','Compare the new EIP with the saved return value and account for the stack change.']
 ],question:'What was the saved return value just before RET, and what was EIP immediately afterward? Why are the location and contents of the return slot different numbers?'},
 copy:{title:'Test a copy boundary without corrupting your process',mode:'copy',goal:'Identify source, destination, requested count and the check that rejects an oversized copy.',steps:[
 ['Open the variant','Open bin/lesson_lab.exe with Arguments: copy. Load the matching PDB.','This original program intentionally checks bounds; it is not an exploit target.'],
 ['Break before copying','bu lesson_lab!tutor_copy\ng\ndd @esp L0n3\nuf lesson_lab!tutor_copy','At entry identify return address, source pointer and count. The first call requests seven bytes into an eight-byte destination.'],
 ['Inspect the source','db poi(@esp+4) L0n7','Expect the source bytes for ABCDEFG in the first call. Explain why poi is required.'],
 ['Trace the check','t','Follow the comparison and branch in the actual disassembly. Note which path reaches memcpy.'],
 ['Observe the second call','g','The second breakpoint hit requests nine bytes. Follow its failed capacity check. It should return 0 without doing the oversized copy.'],
 ['Inspect the destination','bu lesson_lab!checkpoint\ng\ndb lesson_lab!tutor_destination L0n8','Expect ABCDEFG followed by the initial zero byte. The refused second copy does not overwrite it.']
 ],question:'Which check prevented the second copy, and what additional evidence would you need before claiming an unchecked copy is reachable in another binary?'},
 branch:{title:'Connect static branches to two real inputs',mode:'branch',goal:'Use two calls to distinguish a possible path from a path actually taken.',steps:[
 ['Open the variant','Open bin/lesson_lab.exe with Arguments: branch. Load its PDB.','The program calls the same helper with length 3, then length 4.'],
 ['Inspect the static function','uf lesson_lab!tutor_dispatch\nbu lesson_lab!tutor_dispatch\ng','Identify comparisons for length and tag.'],
 ['Observe the first input','dd @esp L0n3','Arguments at entry should be length 3 and tag 0x46. Predict rejection before stepping.'],
 ['Inspect the result','pt\nr @eax','The first return value should be 0. A correct tag does not rescue insufficient length.'],
 ['Observe the changed case','g\ndd @esp L0n3\npt\nr @eax','The next helper call uses length 4 and should return 1. Explain the changed edge in the control-flow graph.']
 ],question:'What single changed input made the accepted path reachable, and where did the disassembly show that condition?'},
 seh:{title:'Observe an exception that is handled',mode:'seh',goal:'Separate an exception notification, the handler and a later normal return.',steps:[
 ['Open the variant','Open bin/lesson_lab.exe with Arguments: seh. Load the matching PDB.','This raises and handles a deliberate application exception; it contains no SEH overwrite.'],
 ['Choose the relevant stop','bu lesson_lab!tutor_exception\nsxe 0xe0424242\ng','Stop at the helper before the deliberate RaiseException call.'],
 ['Observe the exception','g','The configured exception event should pause the debugger. This alone does not establish an unhandled crash.'],
 ['Inspect the x86 chain','!exchain\nk','Record the handler-chain and call-stack observations. The exact compiler/runtime entries may differ; do not expect hard-coded addresses.'],
 ['Pass the exception to the application','gn','gn resumes with this exception marked not handled by the debugger, allowing the application handler to handle it. The console should report exception_handled=1 and the target should exit normally.']
 ],question:'Which evidence established that the application handled the event? Why would reporting only “an exception occurred” be an incomplete crash diagnosis?'}
};
export function guideFor(l){
 if(['welcome','bytes','endian','pointers','registers','symbols','dump','dereference','structures','edit','search','debugger','modules','calculator','loader-list','watchpoint'].includes(l.id))return nativeGuides.memory;
 if(['stack','returns','frames','stepping','calling','call-frame','pic'].includes(l.id))return nativeGuides.call;
 if(['bounds','input-path','badbytes','protocol'].includes(l.id))return nativeGuides.copy;
 if(['static-dynamic','breakpoints','deferred','conditional','ida-addresses'].includes(l.id))return nativeGuides.branch;
 if(['seh','seh-checks'].includes(l.id))return nativeGuides.seh;
 return null;
}
