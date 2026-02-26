# RootAccess — Step 3 Status

Step 3 Firestore security hardening and exploit validation is now in place.

## What is now completed

- Hardened `firestore.rules` with tighter owner/admin authority boundaries.
- Enforced server-authoritative economy and cooldown posture.
- Added user subcollection protections for command intents, cooldown docs, and quest claims.
- Added emulator-backed rules test suite for cross-user, admin-gating, tamper, and append-only log exploits.
- Added Step 3 test matrix runbook documentation in `docs/step-3/rules-test-matrix.md`.

## Commands

- Install deps: `npm install`
- Rule exploit tests: `npm run test:rules`
- Checks: `npm run check`
- Build: `npm run build`

## Immediate next coding target

Step 4: repo/deploy topology hardening and CI automation (lint/type/test/build/deploy pipeline).
