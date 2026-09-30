# OSED Forge 0.2.0 — Guided Learning

This changes the app from a PDF tracker into a teaching-first experience.

Download **OSED-Forge-Setup.exe**. Upgrade after exporting your existing backup. The application keeps the same local database location; the new validated teaching state preserves the previous journal. Do not run the old v0.1 executable against the upgraded journal.

## Included

57 original short concept lessons; simpler explanations; stepwise worked examples; visual pointer/stack states; typed model practice with explanations; different guided/solo cases; assistance-aware concept checks; reflection notes; reviews of already-taught concepts; full 375-heading source inventory; five step-by-step WinDbg walkthroughs and a new original x86 observation executable with five modes. The separate lab pack retains the earlier five programs.

## What is not claimed

The 144 source exercise/extra-mile groups and every case-study step are NOT all converted into native labs. Advanced concepts have bounded model exercises, not completed native exploitation challenges. Coverage states remain visible. No proprietary PDF, vendor solutions or targets are included.

Local Node tests cover lesson content, model arithmetic, migration, saved progress and review constraints. Windows CI additionally runs Rust storage tests, builds/installs the EXE and checks actual WebView startup. Interactive UI testing used an offline Chromium DOM with a mocked native storage bridge; this is not full manual Windows or iPhone validation.

This is an unsigned prerelease. Verify SHA256SUMS; do not disable security software. Missing WebView2 can require internet during setup. No live phone sync, AI service, background push or automated exploit grading is included.
