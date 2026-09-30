# OSED Forge — Guided Learning 0.2

A Windows desktop teaching companion, not a PDF-reading checklist.

**Learn → Watch → Guided → Solo → Remember → Windows practice**

57 original short lessons explain core concepts from the uploaded EXP-301 v1.0 syllabus. Each lesson includes an explanation, simpler analogy, worked example, checked model practice, changed solo case and a reflection. Source references are optional and scoped to the current concept. No course PDF, vendor payload or proprietary target is distributed.

## Install

Download `OSED-Forge-Setup.exe` from Releases. The installer is unsigned; keep your security tools enabled and verify SHA256SUMS. WebView2 may require internet during first installation. The authored lessons work offline afterward. `OSED-Forge.exe` is the standalone application when WebView2 is already available.

The application is Windows x64; the practice programs are Windows x86. Extract the separate `OSED-Forge-Foundation-Labs.zip` in a disposable study VM. The new `lesson_lab.exe` has memory, call, copy, branch and handled-exception modes. The app teaches its steps and expected observations one action at a time.

## What this actually teaches

- Addresses, values, bytes, register views, pointers, stack movement and function returns.
- WinDbg memory displays, symbols, structures, edits, searches, breakpoints, stepping and calculations.
- Stack corruption reasoning, offsets, input constraints, decoder workspace and SEH distinctions.
- Static/dynamic analysis, staged buffers, page probes and portability assumptions.
- Calling conventions, loader pointer chains, export-array lookup, rotations, byte constraints and runtime anchors.
- Input-path analysis, DEP permissions, ROP stack accounting, call-frame layout, ASLR leaks and decoder ordering.
- Format-string roles, observable reads, count writes, multi-byte timing and stack pivots.

These are **concept lessons and deliberately simplified models**, not 57 complete native exploit labs. Five original WinDbg walkthroughs connect foundations to a real observation executable. The older five foundation programs are retained.

## Honest source coverage

The coverage view inventories all 375 headings in the supplied edition's table of contents, including 144 exercise/extra-mile groups. It distinguishes a related concept lesson from detailed teaching still pending and a native exercise not converted. A heading in the inventory does not mean its whole subsection has been taught, implemented or verified. Complete case-by-case conversion of the 604-page course and the advanced exploit targets remains unfinished.

Original explanations preserve course terminology. Original numerical examples, models and Windows-program instructions are labelled separately. Source ambiguities (such as the string-capacity boundary or jump-offset wording) are not silently presented as authoritative corrections. Current provider access/exam policies are not inferred from the old coursebook.

## Your existing progress

The application identifier and `progress.sqlite3` location are unchanged. The v1 journal envelope is retained with an additional validated `teaching` field. Previous chapter notes, sessions, attempts and quizzes survive migration; they do not automatically become new lesson passes. Export a full backup before upgrading. Do not reopen the older v0.1 executable against your upgraded journal. JSON import replaces rather than merges data and requires confirmation.

Learning assistance is explicit. Worked solutions, hints and repeated tries cannot be counted as a fresh first-try solo check. Free-text reflections and Windows notes are self-reported, not automatically graded. Reviews draw only from concept lessons already completed.

## Develop and test

```sh
npm test
python -m http.server 8080 --directory web
```

On Windows with the Tauri prerequisites installed:

```sh
npm install --ignore-scripts
python scripts/icon.py
cargo test --release --manifest-path src-tauri/Cargo.toml
npm run desktop:build
```

Build x86 observation programs by running `labs/build.cmd` from a Visual Studio x86 developer command prompt. The automated Windows workflow compiles them, runs normal-output checks, builds/installs the desktop app, checks SQLite persistence and checks actual WebView startup. No claim of complete manual Windows or iPhone QA is made.

## Boundaries

No live AI tutor, API key, account, phone sync, background reminder service or automated exploit grader is included. The responsive UI can be previewed on mobile, but that does not synchronize your Windows database. Educational model checks are not exam-pass predictions.
