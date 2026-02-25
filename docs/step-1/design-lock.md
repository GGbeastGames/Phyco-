# Step 1 — Master Design Lock + Product Constraints

This document implements Step 1 deliverables defined in `read.md` and serves as the development contract for all subsequent coding.

## 1) Finalized game loop + progression pacing

### Session loop (2-15 min)
1. Open Terminal and run commands (`scan`, `phish`, `spoof`, `breach`, `inject`) based on cooldown/risk profile.
2. Convert rewards into progression via command unlocks, module installs, and economy spend.
3. Manage trace pressure by running recovery paths and low-risk cycles.
4. Enter PvP/Blockchain/Quest systems when thresholds unlock.

### Progression phases
- **Early game (Levels 1-10):** teach command chaining, cooldown literacy, and trace management.
- **Mid game (Levels 11-35):** introduce PvP races, rotating market choices, specialization via modules/traits.
- **Late game (Levels 36+):** optimize build strategy, compete in high-stakes events, engage live-ops dynamics.

## 2) Command taxonomy + unlock matrix (draft)

| Command | Tier | Unlock | Primary effect | Risk profile |
|---|---:|---|---|---|
| `scan` | 1 | Level 1 | Recon + low XP/currency | Very low trace |
| `phish` | 1 | Level 2 | Currency burst, medium consistency | Low trace |
| `spoof` | 2 | Level 6 + Intro Module | Cooldown mitigation + combo setup | Medium trace |
| `breach` | 2 | Level 12 + tool prerequisite | High reward packet | Medium-high trace |
| `inject` | 3 | Level 20 + specialization | Event modifier + advanced chain finisher | High trace |

## 3) Firebase free-tier budget assumptions (initial envelope)

### Read/write approach
- Attach listeners only for active windows.
- Prefer one-shot reads for low-frequency views.
- Use projection documents (`userPublic/{uid}`) for profile/index surfaces.

### Daily budget targets (planning)
- **Auth MAU:** sized for soft launch cohort.
- **Firestore reads:** prioritize terminal/session docs and minimal global reads.
- **Firestore writes:** economy writes batched and transactional.
- **Storage usage:** only compressed UI assets and curated media.

> Note: exact budget caps remain adjustable during Step 2 schema/index planning, but all systems must keep listener count and write fan-out constrained.

## 4) Threat model + mitigations

### Priority abuse vectors
- Client-side economy tampering.
- Cooldown bypass/replay command intents.
- Unauthorized admin mutation attempts.
- PvP packet/result forgery.
- Cross-user document write attempts.

### Baseline mitigations
- Firestore deny-by-default with strict path ownership checks.
- Server-authoritative settlement for rewards and PvP outcomes.
- Idempotency keys + nonce patterns for command intents.
- Admin operations gated by custom claims and append-only `adminLogs` records.
- Anomaly telemetry for suspicious balance deltas and command frequency.

## 5) UX pillars + visual language constraints

### UX pillars
1. **Desktop-as-world:** the shell itself is the game map.
2. **Readable intensity:** high style, low confusion; state clarity beats decorative overload.
3. **Fast feedback:** every action must return visible, game-meaningful response.
4. **Mobile survivability:** all key loops remain usable at narrow widths.

### Visual language
- Cyberpunk HUD palette with layered glows and restrained motion budgets.
- Motion should indicate system state, never hide game-critical data.
- Fallback rendering required when WebGL is unavailable.

## 6) Step 1 exit criteria checklist

- [x] MVP scope and authority model documented.
- [x] No unresolved ambiguity in core system boundaries for implementation kickoff.
- [x] Initial anti-cheat and abuse controls documented for immediate Step 2/3 integration.
