# OSED Forge â€” Study desk 0.3

A Windows desktop study companion that teaches one idea at a time.

**Today -> Start lesson -> Understand -> Example -> Practice -> Recap**

Download `OSED-Forge-Setup.exe` from Releases. Export a backup and close the previous app before upgrading. The app retains the same SQLite location; existing progress is preserved. The installer is unsigned. Keep security protections enabled and verify SHA256SUMS. WebView2 may need internet during setup; lessons then work offline.

## A focused mission path

The mission desk adds a visible path through each unit, 40 XP for a completed lesson, and 10 XP for its first review. Repeats do not create extra XP. The Word guide explains 20 technical terms. All 57 concept lessons use shorter, clearer explanations.

Exam prep keeps practical evidence and self-checks separate from rewards. Lab notes are self-reported; no score predicts a pass. Form drafts survive navigation and reload.

`python scripts/portable.py` creates `release/OSED-Forge-Study.html`, a self-contained browser edition with real IndexedDB storage and no server dependency. Keep the file in one location and use the same browser; export backups before moving it. Browser progress and the Windows SQLite database are separate; use the existing backup export/import to move progress.

## Study flow

Today has one recommended next lesson. New students begin with bytes and addresses, without a PDF assignment or a VM setup requirement. Opening a lesson hides the workspace navigation. Four simple stages guide you through an explanation, a stepwise example, supported and independent questions, and a short recap.

Dark mode and light mode have the same readable layout. A visible toggle switches them instantly. Settings also offers System, which follows your OS preference. Theme and lesson text size are saved locally before the next render; they do not require an account.

Course groups lessons into small units. Review only brings back completed concepts. Notebook stores your recaps and Windows observations. The detailed source map remains available behind Course instead of dominating the study interface.

## Content and limitations

57 original authored concept lessons remain available: 56 on the main study path and the orientation guide through source references. The source map inventories 375 headings in the supplied EXP-301 v1.0 edition, including 144 exercise/extra-mile groups. Mapping a heading does not mean its native exercise is implemented.

Five WinDbg walkthroughs connect foundations to the original `lesson_lab.exe` observation program. Its memory, call, copy, branch and handled-exception modes are in the separate foundation lab pack, along with the previous five programs. The v0.2 lab pack is compatible with this UI update. Use a disposable Windows study VM.

Advanced native exploit targets and case-by-case conversion of every course exercise remain unfinished. Simplified model checks are not an exploit certification. Free-text notes are not AI-graded. No live AI service, phone sync or background reminder service is included. No course PDF, proprietary targets, vendor solutions or credentials are bundled.

## Data

The application identifier and `progress.sqlite3` location are unchanged. The v1 journal envelope retains the teaching field from v0.2. Old notes, attempts and sessions remain in the journal and full backup. Import validates and replaces; it does not merge. Avoid reopening older versions against the upgraded journal. Appearance preferences are device-local and separate from journal backups.

## Development

```sh
npm test
python -m http.server 8080 --directory web
```

Windows, with the Tauri prerequisites installed:

```sh
npm install --ignore-scripts
python scripts/icon.py
cargo test --release --manifest-path src-tauri/Cargo.toml
npm run desktop:build
```

Build x86 observation programs using `labs/build.cmd` in a Visual Studio x86 developer command prompt. GitHub Actions compiles them, builds and installs the desktop app, checks real SQLite persistence and checks WebView startup plus theme switching.

`tests/ui/check_student_flow.py` provides offline Chromium UI QA with a mocked native bridge. Install Python Playwright and its Chromium browser, or set `CHROMIUM_PATH`. Output goes to `qa-output/` (override using `OSED_QA_OUT`). It is not a substitute for complete manual Windows/iPhone QA. See `docs/STUDY_DESIGN.md` for design decisions and `docs/UI_QA.json` for the recorded local checks.
