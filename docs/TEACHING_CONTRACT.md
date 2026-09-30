# Teaching contract

The unit of work is a concept, not a chapter-reading checkbox. A lesson must supply the explanation needed to answer its question before asking it. Everyday analogies must map back to the actual register, memory, argument or mitigation distinction.

Each authored lesson has a source chapter, exact subsection IDs, focal page references, an original explanation, a simpler explanation, attention guidance and an explicit scope note. Worked examples show intermediate reasoning. Guided and solo cases use different presented scenarios; solutions/hints/retries are distinguished from a first-try check. Reflections are not automatically graded.

The source is EXP-301 v1.0, copyright 2021, uploaded under a 2023 filename. The source inventory comes from all TOC pages 3–13. Readiness is not inferred from percentages of this inventory. A matched heading is not proof that its complete original narrative, exercises and extra miles have been converted.

Models are not a full CPU emulator or an exploit grader. Their assumptions are explicit (x86 operand width, plain RET, synthetic memory, fixed model ABI). The actual Windows walkthroughs use only the project's observation programs and retain mitigations. New native instruction guidance is separately labelled; the handled-exception exercise's gn behavior follows Microsoft Learn: https://learn.microsoft.com/en-us/windows-hardware/drivers/debuggercmds/gn--gn--go-with-exception-not-handled-

Remaining work is not silently marked complete: full protocol/case-study reconstruction tasks, full native shellcode exercises, native constrained egghunters/ROP/ASLR/format-write integration, independent challenge packs, and verified reporting rubrics.

## Checks before release

- Source IDs exist in the inventory; each model exists and accepts correct typed answers.
- Wrong answers, hints and revealed solutions cannot be turned into first-try passes.
- Existing v1 journal fields remain byte-for-byte equivalent after normalization, except intentional pause-on-start for an active timer.
- Partial lesson state and review due dates survive serialization.
- Invalid imports and stale storage revisions fail without replacing saved progress.
- Browser UI testing distinguishes a mock native bridge from actual native persistence.
- Windows CI tests real compilation, installation, persistence and WebView startup before a release is called built.
