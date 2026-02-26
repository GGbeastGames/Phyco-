# RootAccess — Step 6 Status

Step 6 Terminal gameplay loop and white-screen guardrails are now in place.

## What is now completed

- Implemented Terminal app inside the window manager as a real gameplay surface.
- Added command execution loop with cooldowns, rewards, trace pressure, and leveling progression.
- Added terminal HUD/log/input UX with helper commands (`help`, `status`, `clear`).
- Added Step 6 implementation notes in `docs/step-6/terminal-game-loop.md`.
- Added root `index.html` bootstrap warning fallback to make source-vs-build deployment failures visible instead of an all-white page.

## Commands

- Install deps: `npm ci`
- Checks: `npm run check`
- Rule exploit tests: `npm run test:rules`
- Build: `npm run build`
- Preview: `npm run preview`

## Immediate next coding target

Step 7: implement Black Market gameplay loop and integrate shared progression economy state.
