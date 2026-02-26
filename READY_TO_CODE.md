# RootAccess — Step 2 Status

Step 2 Firebase architecture blueprint is now in place.

## What is now completed

- Canonical Firestore schema documented with required fields and write authority by collection.
- Query-heavy UI paths mapped to explicit index requirements in `firestore.indexes.json`.
- Cost controls documented: projection documents + listener scoping.
- Data lifecycle and rollback strategy documented for logs, events, matches, and snapshots.
- Typed Firestore contracts and path constants added under `src/` for implementation safety.
- GitHub Pages runtime note made explicit: HTML entry files (`index.html` + `404.html`) are the practical click-path backbone; TS/React/CSS support behavior/rendering.

## Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Checks: `npm run check`

## Immediate next coding target

Step 3: finalize and validate `firestore.rules` against a rules test matrix (cross-user writes, admin gating, reward/cooldown tamper attempts).
