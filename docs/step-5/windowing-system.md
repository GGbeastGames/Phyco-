# Step 5 — OS Windowing System + Desktop Shell

## Implemented core

- Draggable window manager with pointer/touch drag handling.
- Focus stack (last interacted window is top/focused).
- Taskbar with open-window indicators and minimize restore.
- Window actions: minimize, maximize, close.
- Launcher grid for opening all Step 1-14 core apps.
- Reusable app window frame for plugging in feature internals in future steps.

## Hacker theme adaptation notes

Inspired by GitHub `pages-themes/hacker` visual language:

- Monospace-first typography.
- Neon green-on-dark terminal palette.
- Thin phosphor-like borders and glow accents.
- Minimalist command-console vibe while preserving mobile responsiveness.

## White-screen source cause + fix

Observed likely deployment mismatch:

- If GitHub Pages serves raw source branch files directly, `index.html` points at `/src/main.tsx`, which browsers cannot run in production as an unbuilt TypeScript app.
- This leads to a blank/white page despite `index.html` loading.

Fixes included:

1. Keep GitHub Actions deployment path publishing built `dist/` output.
2. Added `public/.nojekyll` to reduce Jekyll pipeline edge-cases.
3. Added `public/404.html` and `public/main.html` so fallback/launcher files are emitted into built output.

## Step 5 smoke checks

- `npm run check`
- `npm run test:rules`
- `npm run build`
- `npm run preview`
