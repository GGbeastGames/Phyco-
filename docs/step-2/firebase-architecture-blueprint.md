# Step 2 — Final Firebase Architecture Blueprint

This blueprint is the canonical data contract for RootAccess Chapter 1 and is optimized for GitHub Pages static hosting + Firebase free-tier constraints.

## 1) Platform note (GitHub Pages + HTML-first runtime)

GitHub Pages serves static HTML/CSS/JS only. In practical terms:

- `index.html` is the primary click-entry and runtime bootstrap point.
- `404.html` preserves click navigation during direct refreshes by routing back into hash-based URLs.
- TypeScript/React/CSS support the behavior and presentation layered on top of HTML entrypoints.

## 2) Collection tree + ownership model

### `/users/{uid}` (private player source of truth)

- **Authority:** owner (`uid`) can read/update constrained fields; admin can read.
- **Purpose:** canonical progression state and player-owned runtime values.
- **Required fields:**
  - `uid: string`
  - `displayName: string`
  - `photoURL: string | null`
  - `balance: number`
  - `trace: number`
  - `xp: number`
  - `level: number`
  - `rankScore: number`
  - `ownedCommands: string[]`
  - `installedModules: string[]`
  - `traits: string[]`
  - `cooldowns: Record<string, Timestamp>`
  - `questProgress: Record<string, QuestProgressEnvelope>`
  - `blockchainAssets: Record<string, PlayerBlockAsset>`
  - `pvp: PlayerPvpRecord`
  - `isAdmin: boolean` (server mirrored, immutable client-side)
  - `createdAt: Timestamp`
  - `updatedAt: Timestamp`
  - `lastSeenAt: Timestamp`
- **Write policy:** user writes only to owned mutable gameplay fields; protected fields immutable in rules.

### `/userPublic/{uid}` (read-optimized profile projection)

- **Authority:** world-readable; writeable only by owner/admin.
- **Purpose:** low-cost profile cards, leaderboards, duel previews.
- **Required fields:**
  - `uid: string`
  - `displayName: string`
  - `avatarFrame: string`
  - `level: number`
  - `rankScore: number`
  - `factionTag: string`
  - `badgeHighlights: string[]`
  - `updatedAt: Timestamp`
- **Write policy:** projection only; no economy fields.

### `/commands/{commandId}`

- **Authority:** admin write, signed-in read.
- **Purpose:** command metadata and unlock requirements.
- **Required fields:**
  - `commandId: string`
  - `name: string`
  - `tier: 'early' | 'mid' | 'late'`
  - `cooldownMs: number`
  - `baseReward: number`
  - `traceImpact: number`
  - `requiredLevel: number`
  - `requiredTraits: string[]`
  - `isActive: boolean`

### `/quests/{questId}`

- **Authority:** admin write, signed-in read.
- **Purpose:** daily/weekly quest definitions.
- **Required fields:**
  - `questId: string`
  - `type: 'daily' | 'weekly' | 'seasonal'`
  - `objectiveKey: string`
  - `target: number`
  - `rewardCredits: number`
  - `rewardXp: number`
  - `expiresAt: Timestamp`
  - `isActive: boolean`

### `/marketRotations/{rotationId}`

- **Authority:** admin write, signed-in read.
- **Purpose:** black market rotating inventory.
- **Required fields:**
  - `rotationId: string`
  - `startsAt: Timestamp`
  - `endsAt: Timestamp`
  - `items: MarketItem[]`
  - `isLocked: boolean`

### `/seasonConfigs/{seasonId}`

- **Authority:** admin write, signed-in read.
- **Purpose:** season-level multipliers and operational toggles.
- **Required fields:**
  - `seasonId: string`
  - `label: string`
  - `economyMultiplier: number`
  - `traceMultiplier: number`
  - `pvpEnabled: boolean`
  - `eventFlags: Record<string, boolean>`

### `/globalState/{docId}` + `/globalState/{docId}/events/{eventId}`

- **Authority:** admin write, signed-in read.
- **Purpose:** global narrative and event stream for in-world broadcasts.
- **Required fields (`globalState`):**
  - `docId: string`
  - `headline: string`
  - `seasonId: string`
  - `updatedAt: Timestamp`
- **Required fields (`events`):**
  - `eventId: string`
  - `type: string`
  - `payload: map`
  - `publishedAt: Timestamp`

### `/pvpMatches/{matchId}`

- **Authority:** participants + admin constrained writes.
- **Purpose:** duel queue lifecycle and result envelopes.
- **Required fields:**
  - `matchId: string`
  - `playerAUid: string`
  - `playerBUid: string`
  - `status: 'queued' | 'active' | 'completed' | 'aborted'`
  - `winnerUid: string | null`
  - `startedAt: Timestamp | null`
  - `endedAt: Timestamp | null`
  - `resolutionHash: string | null`
  - `updatedAt: Timestamp`

### `/adminLogs/{logId}` (append-only)

- **Authority:** admin create/read only; no updates/deletes.
- **Purpose:** immutable audit trail for high-impact actions.
- **Required fields:**
  - `logId: string`
  - `actorUid: string`
  - `action: string`
  - `targetPath: string`
  - `payloadHash: string`
  - `createdAt: Timestamp`

### `/economySnapshots/{snapshotId}`

- **Authority:** admin write/read.
- **Purpose:** periodic economy rollups and anomaly investigation.

## 3) Query map + index/cost notes

Canonical index definitions are in `firestore.indexes.json`.

1. **Public leaderboard**
   - Query: `userPublic orderBy rankScore desc, level desc limit 100`
   - Index: composite on `rankScore desc`, `level desc`
   - Cost note: projection docs avoid private user document fan-out.

2. **PvP matchmaking queue**
   - Query: `pvpMatches where status == 'queued' orderBy updatedAt asc limit 50`
   - Index: `status asc`, `updatedAt asc`
   - Cost note: small windowed listener only while PvP window visible.

3. **Active market rotation**
   - Query: `marketRotations where isLocked == false orderBy startsAt desc limit 1`
   - Index: `isLocked asc`, `startsAt desc`
   - Cost note: single-doc read on open + cached locally.

4. **Quest shelf by type**
   - Query: `quests where isActive == true where type == 'daily' orderBy expiresAt asc`
   - Index: `isActive asc`, `type asc`, `expiresAt asc`
   - Cost note: one-time fetch per session; refresh on claim.

5. **Global events feed**
   - Query: `globalState/{docId}/events orderBy publishedAt desc limit 30`
   - Index: `publishedAt desc`
   - Cost note: listener attached only when archive/signal windows are open.

6. **Admin log triage**
   - Query: `adminLogs where actorUid == $uid orderBy createdAt desc`
   - Index: `actorUid asc`, `createdAt desc`
   - Cost note: restricted to admin console; never mounted for normal users.

## 4) Lifecycle / archival policy

- `adminLogs`:
  - Hot path in main collection for 30 days.
  - Monthly move to `adminLogs_archive_{yyyy_mm}` export path.
- `globalState/*/events`:
  - Retain latest 90 days live.
  - Snapshot older events into seasonal archive docs in Storage exports.
- `pvpMatches`:
  - Keep active + last 30 days in primary collection.
  - Move old closed matches to seasonal archive collections.
- `economySnapshots`:
  - Daily snapshots kept 180 days, then compacted to monthly rollups.

## 5) App-specific subcollection strategy

To prevent large hot documents and reduce merge conflicts:

- `/users/{uid}/commandIntents/{intentId}`
  - signed command execution intents with nonce + client hash + createdAt.
- `/users/{uid}/cooldowns/{commandId}`
  - command-specific next available timestamp.
- `/users/{uid}/questClaims/{questId}`
  - claim metadata and anti-replay markers.

These are optional migration targets once write volume exceeds comfortable limits in root user docs.

## 6) Circular dependency guardrails

- `users` is canonical for private player state.
- `userPublic` is projection-only and must be derivable from `users` + badges.
- `pvpMatches` references user IDs only (never embeds mutable user state).
- `globalState` and config collections never depend on per-user docs.

## 7) Rollback / migration strategy

- Apply additive schema changes first (new optional fields).
- Backfill via batched admin script.
- Flip UI to consume new fields only after backfill completion.
- Keep old fields for one release cycle behind a feature flag.
- Remove deprecated fields after rule + UI convergence checks pass.

## 8) Step 2 exit checklist

- [x] Ownership and write authority documented per collection.
- [x] Query-heavy views mapped to explicit indexes.
- [x] Read-cost controls documented (projection docs + scoped listeners).
- [x] Archival lifecycle and rollback strategy documented.
- [x] No circular collection dependency in canonical flow.
