# Step 6 — Terminal Gameplay Loop v1

## Delivered in this step

- Terminal app embedded inside the reusable window container.
- Command-driven loop with:
  - `run <commandId>` execution,
  - per-command cooldown enforcement,
  - credits gain,
  - trace gain/reduction,
  - XP gain and level-up threshold handling.
- HUD for credits/xp/level/trace.
- Command UX helpers:
  - `help`
  - `status`
  - `clear`

## Command set (v1)

- `scan.node` — low reward/low risk scan.
- `inject.proxy` — medium reward/risk operation.
- `drain.wallet` — high reward/high trace pressure.
- `scrub.trace` — defensive command reducing trace.

## White-screen remediation notes

Likely white-screen cause seen on Pages: source branch serving `index.html` directly causes the browser to request `/src/main.tsx`, which is not a production browser bundle.

Mitigations added:

1. Boot warning fallback in root `index.html` when app fails to mount.
2. Existing Pages workflow that publishes built `dist/` artifact should be used as the source of truth.
3. `public/main.html` launcher remains available as alternate entry.

## Next step

Step 7: Black Market gameplay loop in its own window using shared currency/cooldown state contracts.
