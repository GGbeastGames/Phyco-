# Step 4 — Repo Structure + GitHub Pages Build Topology

This step finalizes repository/deploy topology for reliable static hosting on GitHub Pages.

## 1) Runtime topology

- Static entrypoints:
  - `index.html` (primary app shell boot)
  - `404.html` (hash redirect safety)
  - `main.html` (optional launcher)
- SPA routing uses hash URLs for refresh-safe navigation.
- Production bundles are emitted to `dist/` via Vite.

## 2) Repo structure (current)

- `src/`:
  - `components/` UI surfaces
  - `contracts/` typed domain contracts
  - `data/` shared constants/paths
  - `styles/` styling
- `docs/step-*`:
  - implementation runbooks per phase
- Root infra:
  - `firestore.rules`, `firestore.indexes.json`, `firebase.json`
  - TypeScript + ESLint + Vite config files

## 3) CI pipeline

GitHub Actions workflows provide automated quality gates:

- **CI (`.github/workflows/ci.yml`)**
  - Trigger: push + pull request
  - Jobs:
    1. `npm ci`
    2. `npm run check`
    3. `npm run test:rules`
    4. `npm run build`
  - Artifact: uploads `dist/` for inspection.

- **Pages Deploy (`.github/workflows/deploy-pages.yml`)**
  - Trigger: push to `main` and manual dispatch.
  - Rebuilds app and publishes `dist/` via official Pages actions.

## 4) Environment + secret handling strategy

- Public client config is sourced from Vite variables (`VITE_*`) using `.env` files.
- Do not commit private credentials; only commit `.env.example` template.
- Secrets used by CI/deploy are stored in GitHub Actions secrets (never in source).
- Firebase admin credentials are not used in browser runtime and should stay server-side only.

## 5) Step 4 smoke checks

- Fresh clone install: `npm ci`
- Static quality checks: `npm run check`
- Rules exploit matrix: `npm run test:rules`
- Production build: `npm run build`
- Preview parity check: `npm run preview`

## 6) Exit criteria status

- [x] Fresh clone builds with standard install + build commands.
- [x] CI pipeline codified for lint/type/test/build.
- [x] Pages deploy flow codified for static publish.
- [x] Env/secret handling strategy documented.
- [x] Route fallback strategy (`404.html`) retained for Pages safety.
