# RootAccess — Ready-to-Code Decisions and Checks

This file records the initial engineering decisions and environment checks completed from `read.md` so implementation can start immediately.

## Decisions made from `read.md`

1. **Routing strategy:** Use **React Router HashRouter** (`#/...`) to avoid direct-refresh 404 issues on GitHub Pages.
2. **Hosting/deploy target:** Build as a **static Vite app** with output in `dist/` and include `404.html` fallback behavior.
3. **Security baseline:** Keep Firestore in **deny-by-default** mode and use per-user write scopes (`users/{uid}`), with admin operations auditable via `adminLogs/{logId}`.
4. **Authority model:** Economy/PvP/admin rights remain server-authoritative; client submits intents only.
5. **Immediate implementation sequence:** Start with Step 4/5 prep (repo topology + shell scaffolding) while preserving Step 3 rule guarantees already present.

## Checks run

- Verified local runtime tooling: Node and npm are available.
- Verified Firebase CLI availability: not installed in current environment.
- Validated key rule anchors in `firestore.rules` exist:
  - `rules_version = '2'`
  - `match /users/{uid}`
  - `match /adminLogs/{logId}`
  - terminal wildcard deny rule: `match /{document=**}` + `allow read, write: if false`

## Server bootstrapped

- Started local static server for immediate iteration:
  - Command: `python3 -m http.server 4173 --bind 0.0.0.0`
  - Validation: `curl -I http://127.0.0.1:4173/read.md` returned `HTTP/1.0 200 OK`
  - PID stored in `/tmp/rootaccess-server.pid`
  - Logs stored in `/tmp/rootaccess-server.log`

## Next coding-ready actions

- Scaffold app shell (`src/`, `index.html`, `404.html`, Vite config) aligned with HashRouter.
- Add lint/type/test/build scripts to satisfy one-command readiness goal.
- Add Firestore rules emulator tests once Firebase CLI is available.
