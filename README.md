# OSED Forge — Windows foundation edition
A local-first Windows study companion with a 26-week planning envelope, 13 chapter/page references, 56 original quiz questions, six generated reasoning drills, study timer and private evidence journal.

## Download
Open this repository's **Releases** page and download **OSED-Forge-Setup.exe** from a successful Windows build. Source pushes are not proof that an executable was built: the Windows workflow must pass first.
The setup installs per-user. It may need internet to obtain Microsoft's WebView2 runtime when that runtime is missing. This is an unsigned personal prerelease; inspect its source, build logs and SHA256SUMS. Do not disable antivirus or organisational protections to run it.

## Start
Open OSED Forge, visit Settings, enter your study start and realistic weekly hours, and enter the actual lab/exam dates from your account. Those fields start blank; the app never grants or extends provider access. Link your local course PDF, which remains outside this repository and is not uploaded. Begin Byte foundry in Practice bench, and open Daily review for due/unseen questions.

## What works
- Native Tauri Windows executable, SQLite snapshot storage with optimistic revision checking and previous-state retention.
- Course metadata, private chapter notes/stages and adjustable 26-week calendar.
- Original quizzes with explanations and simple 1/3/7/14/30-day review scheduling, not FSRS.
- Six generated reasoning simulations with checked mathematical answers and hints.
- Focus timer, manual session logging, practice XP, skill recall observations and self-reported readiness checks.
- Plain JSON backup export/import with validation and explicit replacement confirmation.
- Optional in-app reminder while open. No startup registration or background scheduled task.
- Separate five-program x86 foundation pack with original C source, debug symbols and instructions.

## Deliberate limits
This is the **foundation edition**, not a completed six-month exploit lab fleet. Ten advanced practice entries are briefs without target binaries or automated graders. The tracker does not execute arbitrary binaries, orchestrate VMs or verify real exploit results. VM observations/checklists are self-reported and never equated with simulator results. XP is not an exam-readiness probability.

The responsive browser companion uses IndexedDB and an offline service worker when served from a suitable origin. **Phone/desktop transfer is manual JSON export/import; no live sync, cloud backend, native iOS package or push notifications are deployed.** Import replaces rather than merges journals. No AI service is bundled. The 56-question seed bank will repeat; it is not six months of unique questions.

## Data and security
Native progress is saved in the platform's local application-data directory for `com.osedforge.desktop` as `progress.sqlite3`; Settings displays the actual path. SQLite has current/previous snapshots and transactional writes. A second app instance cannot silently overwrite a newer revision. Export backups regularly. JSON exports contain private notes and are not encrypted; do not commit them. Close the app before making file-level DB backups, preserving WAL/SHM files when present.
The app is not a sandbox for hostile files. Local PDF selection invokes your installed PDF viewer. No telemetry or remote account is used. Vulnerable exercises belong in disposable VMs without useful credentials; the host tracker stays separate.

## Build
Install Node 22, Rust stable, Visual Studio C++ build tools and the Tauri Windows prerequisites. From the repository root:
```
python scripts/icon.py
npm install --ignore-scripts
npm test
cargo test --release --manifest-path src-tauri/Cargo.toml
npm run desktop:build
```
NSIS output is under `src-tauri/target/release/bundle/nsis/`. The application itself is `src-tauri/target/release/osed-forge.exe`. Run `labs/build.cmd` in an x86 Native Tools prompt for the separate practice programs.
This implementation keeps Tauri and SQLite from the blueprint but uses dependency-free modular JavaScript/CSS rather than the initially proposed React/TypeScript frontend. All runtime UI content is bundled; no remote font/CDN required.

## Validation
`npm test` runs 27 learning-engine/schema/timer/content tests. Rust includes five transactional-storage tests. Windows CI compiles the x64 app and x86 foundation programs, performs safe lab self-tests, installs the package, checks persistence and exercises real WebView startup/IPC before publishing. CI log outcomes are authoritative; workflow presence alone is not a passing test.
Linux Chromium UI interaction checks used directly injected local source with a mocked native bridge: they are not a substitute for Windows runtime testing. Manual human Windows/iPhone visual QA remains necessary.

## Course mapping and references
Metadata references the user's 604-page EXP-301 v1.0 edition (copyright2021). Chapter titles here are coaching labels. No PDF, supplied targets, course text, proprietary solutions or exam content is redistributed. Current administrative rules must be checked on OffSec's site; the app is not approved exam software and not affiliated with OffSec.
- https://v2.tauri.app/distribute/windows-installer/
- https://help.offsec.com/hc/en-us/articles/360052977212-OSED-Exam-Guide
- https://docs.python.org/3/library/struct.html
- https://learn.microsoft.com/en-us/windows-hardware/drivers/debuggercmds/debugger-commands
