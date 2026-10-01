# Study workflow contract

Sources: `docs/TEACHING_CONTRACT.md`, tutor/state.js, engine.js, and the user's October 2026 redesign brief. Visual intent lives in DESIGN.md.

## Canonical UI Map
| Capability | Canonical owner | Source of truth | Variants | Verification |
| --- | --- | --- | --- | --- |
| Select/Listbox | native select | app.js | OS-owned popup | browser keyboard |
| Date | native date input | app.js settings | OS-owned popup | browser settings |
| Form | validateForm / submit listener | app.js | answer, settings, evidence, session | invalid/success paths |
| Scrollbar | global CSS tokens | style.css | table overflow | narrow viewport |
| Toast | toast / #toast | app.js | polite status | save feedback |
| CRUD | persist/load | storage.js | progress, notes, evidence, import | state and browser tests |

## Flow ledger
- Today opens the recommended incomplete lesson; a saved lesson resumes. Course exposes all existing lessons and five native walkthroughs.
- Lesson completion still requires the existing independent check and recap. Hints or revealed answers never become clean first-attempt passes.
- Review only uses completed concepts. Wrong answers explain the error and schedule another review.
- New rewards derive from saved progress, without adding or changing journal fields.
- Exam prep checks and lab notes are explicitly self-reported. They never become verified exam readiness.
- Glossary opens in the shared modal; closing restores focus and preserves the lesson.
- Notes autosave. Failed saves stay visibly marked and offer export; stale storage revisions never overwrite another window.
- Backup import uses an app dialog with Cancel focused first. Validation occurs before replacement. Import replaces rather than merges.
- Search is local and transient, has an explicit clear button, and does not create browser-history entries.
- All view changes set document title and move focus to the main heading. Modal dialogs use native focus isolation and Escape behavior.
- Language is plain English, with exact technical terms explained. Dates use device-local study days as established by engine.js. No phone sync is claimed.

## Data lifecycle
SQLite/native and IndexedDB/browser retain the v1 journal contract. Appearance stays local. Existing evidence and sessions are preserved. No account, remote data sharing, payment, or hard-delete workflow is introduced.
