# Mission desk verification — 1 October 2026

## Automated checks

- `node --test tests/*.test.js`: 131 passed, 0 failed.
- `node --check web/tutor/app.js`: passed.
- `python scripts/portable.py`: generated a self-contained browser edition from production modules, without mock storage or test progress.
- `designmd lint DESIGN.md`: 0 errors. The documented runtime token ownership is Model B.
- `audit_project.py . --mode strict`: 10 actionless-button findings remain in its raw report. Manual review confirms these are a detector limitation: the checker recognizes inline click attributes, while this app uses a central document click listener and data attributes. No dummy handlers were added to suppress findings. The current sourceRoots exclude the unused legacy web/app.js. The audit is not reported as a clean pass.

## Live browser verification

Tested the actual app served locally, using real browser IndexedDB. Test progress was isolated from the user's Windows SQLite journal.

- First launch recommends Bytes & addresses and one main Start lesson action.
- Dark theme switches immediately and survives reload.
- Lesson mode removes workspace navigation and keeps four named stages.
- Word guide opens in a modal; closing restores focus and retains the lesson.
- Worked example advances through all three steps into guided practice.
- An empty answer shows an inline error; an incorrect answer explains the mistake.
- Correcting guided practice allows a fresh independent question.
- A clean independent answer plus recap completes the lesson and earns 40 XP.
- Reload preserves the completed lesson, recap, next recommendation and XP.
- Exam prep displays official rules and labels its checklist as self-reported.
- Empty lab evidence is rejected; a draft survives navigation away and back.
- A result labelled independent is rejected when hints were used; switching to guided saves the note.
- Search shows an empty result state and Clear search restores the course.
- Windows walkthroughs remain accessible from the lab library.
- Home and reader checked at 390px width, with no page horizontal overflow. Home also checked at 320px after adjusting the header and lesson-stage labels; the page and labels fit without horizontal overflow.
- A handled validation error is logged by the app during the deliberate invalid-evidence check; it is not an uncaught startup failure.

## Limits

The existing Python Playwright harness has updated selectors, but was not run in this session; live interaction checks used the available browser tool. No claim of complete screen-reader, iPhone-device, or manual WinDbg/exploit-lab testing is made. Local file:// navigation is blocked by the browser tool, so direct launch of the standalone HTML file was not browser-verified. Its production module version was tested over HTTP.

Windows compilation, installer, native persistence and WebView smoke checks run in the PR's Windows application job. Check the exact commit's result before calling its installer verified. PR builds upload artifacts and do not publish a release.

Advanced native exploit targets are still incomplete. XP, model exercises and self-reported checks cannot establish an exam pass prediction.

## Source grounding

- Shared product conversation: https://chatgpt.com/share/6abdfdb3-b204-83ec-bba5-158e7e111651
- Official OSED exam guide, checked 1 October 2026: https://help.offsec.com/hc/en-us/articles/360052977212-EXP-301-Windows-User-Mode-Exploit-Development-OSED-Exam-Guide
- Official EXP-301 course overview: https://www.offsec.com/courses/exp-301/
- SEC760 scope and prerequisites: https://www.sans.org/cyber-security-courses/advanced-exploit-development-penetration-testers
