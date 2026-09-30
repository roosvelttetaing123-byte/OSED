# OSED Forge 0.3 — Study desk

## Brief
A working offensive-security practitioner is a beginner in exploit development. The app's single job is to make the next learning action obvious, without requiring the student to understand the app's implementation or the entire course syllabus.

## Design pass 1
Considered: a learning-dashboard grid, a long curriculum sidebar, and a quiet study desk. Rejected the dashboard (too many equally weighted actions) and the permanent lesson list (57 competing destinations). Chosen: a four-item home navigation, one next-lesson panel, and a distraction-free reader.

Palette: porcelain #F5F6FA, paper #FFFFFF, ink #252939, iris #6554C0, soft lilac #EDEAF8, sage #27795C. Dark counterparts: night #191C28, raised slate #222637, chalk #EBEDF7, lavender #B9AEFF, muted slate #34304E, mint #8DD3B4. Semantic tokens define all interface colors. No neon, gradients, remote font dependency, or decorative charts.

Type: Aptos Display / Trebuchet MS for restrained titles; Segoe UI Variable / Segoe UI for interface and reading; Cascadia Code / Consolas for registers and addresses. Reading has independently adjustable 17/19/21px sizes. Font files are not bundled.

Layout:
```
Study home                        Focused lesson
| Today      | Next lesson       | Back to study     Theme  Text size
| Course     | What you learn    | 1 Understand — 2 Example — 3 Practice — 4 Recap
| Review     | [Start lesson]    | Lesson title
| Notebook   |                   | One idea / short paragraphs
|            | Up next (2)      | Local example / supporting analogy
| Settings   |                   | [One primary next action]
```

Signature: a small memory-cell diagram that distinguishes a cell's address label from the value inside it. It teaches the domain's core distinction instead of decorating an empty hero. Later lessons use their own actual worked model, not unrelated memory art.

## Critique before building
Removed a proposed hero slogan and XP ring: neither tells RV what to do. Replaced six equally prominent stage tabs with four named learning steps. Windows practice is optional after concept completion and never leads to a dead-end 'not authored' screen. Moved the coverage inventory behind Course > Source map. Removed the generic right-hand advice panel. Kept scope warnings close to the relevant lab/source rather than repeating them across the reader.

## Interaction contract
- Home opens with one recommended lesson. New learners begin with bytes, not a quiz about how to use the interface.
- Already-started work resumes at its saved step. Completed lessons do not become incomplete when revisited.
- Explain -> worked example -> supported question -> independent question -> recap.
- Future sections are named but are not distracting navigation choices. Backward navigation remains available.
- Incorrect answers explain the reasoning and offer a new case. They never remove existing progress.
- A concept pass still needs the existing independent check. Native notes are not auto-graded.
- Theme selection is System / Light / Dark with one-click toggle always available. Selection persists before first paint and follows live system changes in System mode. Preferences are device-local; course progress still uses SQLite/IndexedDB.
- Acceptance checks include keyboard focus, reduced motion and responsive reflow. Complete manual accessibility certification is not claimed.
- All 57 authored lessons, 375 source headings and existing native guides remain accessible. This is a UI release, not a claim of newly completed advanced native labs.

## Acceptance
A fresh user sees Start lesson; opens a readable idea without setting dates/linking PDFs; reaches an example; completes supported and independent questions; saves a recap; sees the next lesson. Dark/light/system preferences and reading size survive reload. Existing v0.2 journal content is preserved.
