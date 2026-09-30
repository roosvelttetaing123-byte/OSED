# OSED Forge 0.3 — Study desk

A student-first redesign with **Dark / Light / System** appearance and adjustable lesson text.

**Download OSED-Forge-Setup.exe.** Export a backup, close the old app, and install this version. Your journal uses the same application identifier and SQLite location. Existing lessons, notes and attempts are preserved.

## What changed

- Today shows one obvious Start lesson or Continue lesson button.
- New learners start with Bytes & addresses, not a PDF assignment or an interface quiz.
- Focused reader removes the dashboard and follows Understand -> Example -> Practice -> Recap.
- Dark/light toggle stays visible. System mode follows OS changes; explicit choices and reading size persist on this device.
- Course is grouped into small units. Source coverage is a secondary reference, not the main study screen.
- Notebook gathers your recaps and observations. Windows walkthroughs remain optional, separate from in-app concept practice.
- Clear next steps after wrong answers, fresh questions, completion and empty reviews.

## Validation and scope

119 Node tests cover existing learning logic, migration, route helpers and appearance. Local Chromium interaction QA covers the complete lesson flow, wrong-answer recovery, notes/export, restart/resume, themes, text size, dialogs and responsive widths (320–1440 px). That local browser QA uses a mocked native storage bridge; Windows CI separately checks real storage, installation, WebView startup and theme switching.

This is a UI/UX release. The same 57 authored lessons remain (56 on the study path plus orientation) and the same five Windows observation walkthroughs. Advanced native exploit challenges are still unfinished. The v0.2 foundation lab pack is compatible. No new AI service, phone synchronization or background notifications are claimed.

Unsigned prerelease. Verify SHA256SUMS; do not disable security software. WebView2 may require internet during first installation. Course material, private notes and credentials are not distributed. Appearance preferences stay device-local and are not part of the journal backup.
