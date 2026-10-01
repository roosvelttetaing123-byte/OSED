---
version: alpha
colors:
  primary: "#126d82"
  background: "#f2f6f8"
  surface: "#ffffff"
  ink: "#172e42"
  success: "#226e54"
  reward: "#965215"
typography:
  display:
    fontFamily: "Trebuchet MS, Segoe UI, sans-serif"
  body:
    fontFamily: "Segoe UI Variable Text, Segoe UI, sans-serif"
  code:
    fontFamily: "Cascadia Code, Consolas, monospace"
rounded:
  panel: "20px"
  control: "10px"
spacing:
  page: "32px"
  panel: "28px"
components:
  primary-button:
    height: "48px"
---

# OSED Forge — Mission desk

## Overview
An adult beginner learns Windows exploit development through small missions. Plain English reduces reading effort while typed technical checks retain their difficulty. The signature is a connected path of memory-cell-shaped lesson nodes. It shows the real learning sequence and actual completed lessons.

The first screen recommends one lesson. Learning screens hide the dashboard and keep the existing explanation, worked example, guided practice, independent practice, and recap sequence. Rewards appear at completion and on Today; never inside a question.

## Colors
Runtime tokens in `web/tutor/style.css` are canonical (Model B). `--accent` maps to primary, `--bg` to background, `--paper` to surface, `--ink` to ink, `--success` to success. `--reward` is practice reward color. Dark: background #101e30, surface #172a40, ink #edf5fc, accent #7cd4e4, success #82d9b2, reward #ffbd83. Preserve contrast and labels across both themes.

## Typography
Display uses Trebuchet MS for warm, slightly game-like headings; body uses Segoe UI. Code keeps Cascadia Code/Consolas. Main copy is at least 16px, regular UI labels 14px, secondary metadata 12px. Reading size remains independently adjustable to 17/19/21px. Technical terms keep their exact spelling and have simple definitions.

## Layout
Desktop has a narrow persistent navigation and a natural-height workspace. Today has one recommended mission, a compact route preview, and a small rewards panel. At 760px navigation becomes a wrapping row, and all panels become one column. A focused reader stays below 800px wide. Page scroll owns long content; tables and code can scroll horizontally.

## Elevation & Depth
Thin borders and subtle shadows separate panels. Teal is for actions, amber for rewards, and green for completed work. Do not add floating decoration or an unrelated mascot.

## Shapes
Panels use 20px corners, controls 10px. Mission nodes use rounded squares; their connected line carries sequence. Progress is based on actual completed lessons.

## Components
`btn`, `pageTitle`, `shell`, `helpDialog`, and `toast` in tutor/app.js own shared controls and feedback. Native buttons and dialogs keep keyboard support. Theme switching uses tutor/theme.js before paint. Styles use one global scrollbar baseline. Forms use inline validation, preserve inputs on failure, and disable native validation bubbles. Native selects/date fields intentionally use platform-owned popups.

## Do's and Don'ts
- Explain one idea, then ask the learner to apply it.
- Award XP once per completed concept and once per first review; repeated clicks cannot farm it.
- Keep concept progress, self-reported lab evidence, and exam rules distinct.
- Show useful next actions and unfinished advanced-lab coverage honestly.
- Never use points, reading completion, or a checklist to predict passing.
- Respect reduced motion. Do not use streak penalties, forced timers, or distracting celebrations.

## Reconcile drift
The previous `docs/STUDY_DESIGN.md` describes v0.3's quiet lavender desk. This user requested a playful redesign. This document supersedes its palette and home composition, while retaining its lesson sequence, storage, and grading contracts.
