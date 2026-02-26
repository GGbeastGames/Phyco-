import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

const projectId = 'rootaccess-step3-rules';
const rules = readFileSync('firestore.rules', 'utf8');

const baseUserDoc = {
  uid: 'alice',
  balance: 0,
  trace: 0,
  xp: 0,
  level: 1,
  rankScore: 0,
  ownedCommands: [],
  installedModules: [],
  traits: [],
  cooldowns: {},
  questProgress: {},
  blockchainAssets: {},
  pvp: { wins: 0, losses: 0, currentStreak: 0, highestStreak: 0, rating: 1000 },
  updatedAt: new Date(),
  displayName: 'alice',
  photoURL: null,
  lastSeenAt: new Date(),
  isAdmin: false,
  createdAt: new Date()
};

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('firestore.rules step 3 exploit matrix', () => {
  it('allows owner create and blocks cross-user write', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const bobDb = testEnv.authenticatedContext('bob').firestore();

    await assertSucceeds(setDoc(doc(aliceDb, 'users/alice'), baseUserDoc));
    await assertFails(updateDoc(doc(bobDb, 'users/alice'), { displayName: 'hacked' }));
  });

  it('denies owner economy tampering (balance/xp)', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();

    await assertFails(updateDoc(doc(aliceDb, 'users/alice'), { balance: 999999 }));
    await assertFails(updateDoc(doc(aliceDb, 'users/alice'), { xp: 999999 }));
  });

  it('denies owner cooldown tampering, allows admin cooldown writes', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const adminDb = testEnv.authenticatedContext('root', { isAdmin: true }).firestore();

    await assertFails(setDoc(doc(aliceDb, 'users/alice/cooldowns/probe'), { until: new Date() }));
    await assertSucceeds(setDoc(doc(adminDb, 'users/alice/cooldowns/probe'), { until: new Date() }));
  });

  it('blocks non-admin adminLogs writes and enforces append-only behavior', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const adminDb = testEnv.authenticatedContext('root', { isAdmin: true }).firestore();

    await assertFails(
      setDoc(doc(aliceDb, 'adminLogs/log-1'), {
        actorUid: 'alice',
        action: 'fake',
        createdAt: new Date()
      })
    );

    const adminLogRef = doc(adminDb, 'adminLogs/log-1');
    await assertSucceeds(
      setDoc(adminLogRef, {
        actorUid: 'root',
        action: 'economy.adjust',
        targetPath: 'users/alice',
        payloadHash: 'abc123',
        createdAt: new Date()
      })
    );

    await assertFails(updateDoc(adminLogRef, { action: 'mutated' }));
  });

  it('blocks non-admin command mutations', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const adminDb = testEnv.authenticatedContext('root', { isAdmin: true }).firestore();

    await assertFails(
      setDoc(doc(aliceDb, 'commands/ping'), {
        commandId: 'ping',
        name: 'Ping'
      })
    );

    await assertSucceeds(
      setDoc(doc(adminDb, 'commands/ping'), {
        commandId: 'ping',
        name: 'Ping'
      })
    );
  });
});
