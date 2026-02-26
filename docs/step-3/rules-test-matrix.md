# Step 3 — Firestore Rules Validation Matrix

Step 3 objective: ship deny-by-default production rules and validate exploit resistance with emulator tests.

## Scope

- Root user isolation rules
- Admin-only mutation gates
- Economy/cooldown tamper resistance
- Append-only audit logging behavior

## Automated matrix (`tests/firestore.rules.spec.ts`)

1. **Cross-user write exploit**
   - Owner can create `users/{uid}`.
   - Another user cannot update that document.
2. **Economy tamper exploit**
   - Owner cannot mutate `balance` or `xp` directly.
3. **Cooldown tamper exploit**
   - Owner cannot write cooldown docs.
   - Admin can write cooldown docs.
4. **Admin log abuse exploit**
   - Non-admin cannot create admin logs.
   - Admin can create logs but cannot update after creation.
5. **Shared config mutation exploit**
   - Non-admin cannot mutate `commands/{commandId}`.
   - Admin mutation succeeds.

## Rule posture decisions

- User-owned writable surface is intentionally narrow (`displayName`, `photoURL`, `lastSeenAt`, `updatedAt`).
- Economy progression and cooldown documents are server/admin authoritative.
- All unmatched paths remain denied by default.

## Runbook

- Install dependencies: `npm install`
- Execute rule tests against emulator: `npm run test:rules`
- Quality gate: no merge when any exploit case unexpectedly succeeds.
