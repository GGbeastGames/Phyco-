# RootAccess — Step 4 Status

Step 4 repo/deploy topology hardening is now in place.

## What is now completed

- Added GitHub Actions CI pipeline for install, check, rules matrix test, and production build.
- Added GitHub Pages deployment workflow for static `dist/` publishing.
- Added Step 4 topology/runbook documentation with structure, CI flow, and environment strategy.
- Added `.env.example` template to standardize `VITE_*` runtime configuration without committing secrets.
- Preserved GitHub Pages-safe HTML-first entry model and route fallback strategy.

## Commands

- Install deps: `npm ci`
- Rule exploit tests: `npm run test:rules`
- Checks: `npm run check`
- Build: `npm run build`
- Preview: `npm run preview`

## Immediate next coding target

Step 5: implement OS windowing system core (focus stack, launcher/taskbar, minimize/maximize/snap, reusable app window container).
