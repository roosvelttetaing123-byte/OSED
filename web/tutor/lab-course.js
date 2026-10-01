/* Original route for existing foundation programs only. This module describes
   observations to collect; it neither runs a target nor verifies saved notes. */
export const labCourse = {
  id: 'copy-observation',
  title: 'Trace a bounded copy',
  goal: 'Use WinDbg to explain why one copy runs, why another is rejected, and which bytes reach the destination.',
  prerequisites: ['pointers', 'debugger', 'symbols', 'dump', 'breakpoints', 'bounds', 'static-dynamic'],
  sections: ['2.3.2', '2.4.1', '3.1', '5.1.2', '5.1.3'],
  setup: [
    'Use the existing foundation lab pack in your Windows VM. This route uses lesson_lab.exe with the argument copy, followed by branch-hunter.exe for a separate practice task.',
    'Open the x86 target with WinDbg. Keep each matching PDB beside its executable. A PDB lets the debugger show function and variable names.',
    'The copy mode contains two fixed calls: seven bytes, then nine bytes. Its destination holds eight bytes. There is no command-line option to change these counts.',
    'Keep the exact executable, input and debugger output for each attempt. The pack’s self-tests check program behavior; they do not check your debugger work or explanation.'
  ],
  stages: [
    {
      id: 'predict',
      title: '1. Make a prediction',
      intro: 'Write your prediction before opening the expected observations. Count bytes and keep addresses separate from values.',
      steps: [
        {
          title: 'Name the values',
          instruction: 'Draw three labelled boxes: source address, destination address and byte count. The destination capacity is eight bytes. For the first call the count is seven; for the second it is nine.',
          question: 'Which call should fit, and which should be rejected? Explain the comparison using the numbers.'
        },
        {
          title: 'Predict the final destination',
          instruction: 'The destination starts with eight zero bytes. The first source begins with ABCDEFG. The second begins with ABCDEFGHI. The copy uses an explicit count, so include only the requested bytes.',
          question: 'What eight bytes do you expect after both calls? What observation would show that the second call did not copy its data?'
        }
      ]
    },
    {
      id: 'observe',
      title: '2. Observe four checkpoints',
      intro: 'These are guided observations in a real process. A correct answer in the app is a separate kind of evidence.',
      steps: [
        {
          title: 'Stop at the first copy call',
          instruction: 'In WinDbg, open bin\\lesson_lab.exe with Arguments set to copy. At the initial pause, replace the whole C:\\YOUR_LAB_FOLDER\\bin path below with your actual bin folder path. Load the matching symbols, break at tutor_copy, and continue to its entry. Read the stack before stepping through the prologue.',
          command: '.sympath+ C:\\YOUR_LAB_FOLDER\\bin\n.reload /f\nbu lesson_lab!tutor_copy\ng\ndd @esp L0n3\ndb poi(@esp+4) L0n7\ndb lesson_lab!tutor_destination L0n8',
          expect: 'At this x86 function entry, [ESP] holds the return address, [ESP+4] holds the source pointer, and [ESP+8] holds count 7. The source bytes are 41 42 43 44 45 46 47. The destination is still eight zero bytes.',
          question: 'Which number is the source address, and which command reads the bytes at that address?'
        },
        {
          title: 'Follow the accepted path',
          instruction: 'Read tutor_copy’s disassembly. Find the capacity comparison and predict the branch. Use t to follow that decision, then p to step over any called helper. Stay inside tutor_copy and use pt to reach its return instruction. Read EAX and the destination before returning to the caller.',
          command: 'uf lesson_lab!tutor_copy\nt',
          expect: 'The seven-byte request reaches the copy. At the function return, EAX is 1. The destination holds 41 42 43 44 45 46 47 00. Use r @eax and db lesson_lab!tutor_destination L0n8 to record those values.',
          question: 'What comparison and branch show why the copy was allowed? Which destination bytes confirm that it ran?'
        },
        {
          title: 'Follow the rejected path',
          instruction: 'Continue from the first return. The existing breakpoint stops at the second call. Inspect its arguments at entry, then step through the size check. Stop at the return and read EAX. Compare the destination with its state after the first call.',
          command: 'g\ndd @esp L0n3',
          expect: 'The second count is 9. It exceeds the eight-byte capacity. This call returns 0 before reaching memcpy. The destination keeps the bytes from the first call. Record the actual branch and memory; the return value alone does not explain the path.',
          question: 'Which instruction comparison rejected this call? What evidence shows that the destination was not overwritten?'
        },
        {
          title: 'Check the shared result',
          instruction: 'While stopped before the second call returns, set the checkpoint breakpoint and continue. Inspect the destination there. Then continue again to see the program’s console result.',
          command: 'bu lesson_lab!checkpoint\ng\ndb lesson_lab!tutor_destination L0n8\ng',
          expect: 'The final bytes are 41 42 43 44 45 46 47 00. The console reports small=1 oversized_accepted=0 result=1. These fixed calls check one accepted case and one rejected case.',
          question: 'How do the branch observations, final memory and console result support the same explanation?'
        }
      ]
    },
    {
      id: 'fresh',
      title: '3. Try a fresh branch task',
      intro: 'Use the existing branch-hunter program to test whether you can investigate a decision yourself. This task uses a command-line record, not a file parser or memory-corruption target.',
      steps: [
        {
          title: 'Predict an unfamiliar input',
          instruction: 'Start from the lab folder. Before running the command below, inspect the target’s checks in WinDbg or your disassembler and predict the result for ABCDEF. Record your prediction first. Run the program and save the exact console result.',
          command: 'bin\\branch-hunter.exe ABCDEF',
          question: 'What did you predict, what parser-result value did you observe, and which check explains it?'
        },
        {
          title: 'Choose one changed record',
          instruction: 'Choose a different record with six ASCII characters based on the rules you found. Each ASCII character uses one byte here. Write the exact record and your expected result. Run it as the argument to branch-hunter.exe. In the debugger, identify the first failing check, or show that every check passes. Record the operands and branches.',
          question: 'Which change in your input caused a different decision? If the result stayed the same, which earlier check explains that?'
        },
        {
          title: 'Record how you worked',
          instruction: 'Save your inputs, commands and explanation. Record any hints, source listing, worked answer or AI help used to solve the task. A guided attempt is useful practice. Label it accurately before trying a fresh case on your own.',
          expect: 'The route does not automatically grade the native task. Your recorded result and explanation need to be checked against the actual run.'
        }
      ]
    },
    {
      id: 'repeat',
      title: '4. Report and repeat',
      intro: 'A useful report lets you reproduce the observations after closing the target and debugger.',
      steps: [
        {
          title: 'Write a short explanation',
          instruction: 'Name the executable and its build, the mode or input, and the commands you used. For the copy lab, include both counts, the capacity, the deciding branches and the final eight bytes. For the branch task, include the exact records and observed results.',
          question: 'Could another learner reproduce your observations without guessing which input or build you used?'
        },
        {
          title: 'Restart and use your report',
          instruction: 'Close the target and debugger. Start a fresh process and repeat the observations using only your report. Find runtime addresses from symbols or the new run. Record any missing step and correct your notes.',
          expect: 'The fixed copy cases should reach the same decisions and leave the same bytes. Absolute addresses may differ. The route has not tested an exact eight-byte request, input transformations or other targets.'
        },
        {
          title: 'State what remains to learn',
          instruction: 'Separate your simulated answers, guided debugger observations, independent work and clean-start repeat. Mark any missing evidence clearly. This foundation exercise does not demonstrate stack corruption, EIP control or a protection bypass.',
          question: 'What did you observe directly, what did you infer, and what remains untested?'
        }
      ]
    }
  ],
  evidenceFields: [
    {id: 'target', label: 'Target and run', prompt: 'Executable and build: … Mode or exact input: … Target architecture: … Debugger version: …'},
    {id: 'prediction', label: 'Your prediction', prompt: 'For count 7: … For count 9: … Expected final eight bytes: … Why: …'},
    {id: 'observation', label: 'What WinDbg showed', prompt: 'Source pointer: … Destination: … Comparison and branch for each call: … Return values: … Final bytes: … Debugger output or screenshot file: …'},
    {id: 'fresh', label: 'Fresh branch task', prompt: 'Exact record: … My prediction: … Observed parser-result: … First failing check, or evidence that all checks passed: … Help used: …'},
    {id: 'repeat', label: 'Clean-start repeat', prompt: 'Reproduction steps: … Result after restarting: … Missing or corrected steps: … What remains untested: …'}
  ],
  scope: 'This route uses existing foundation programs: lesson_lab copy mode and branch-hunter. It provides guided observation of one seven-byte copy and one rejected nine-byte copy, followed by a separate branch task. It supplies no new parser target or advanced L01 challenge. Native notes are self-reported unless the actual run is separately inspected. Program self-tests and simulated answers do not verify the learner’s debugger work, complete official course exercises or predict an exam pass.'
};
