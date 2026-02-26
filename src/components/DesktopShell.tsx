const coreApps = [
  'Terminal',
  'Black Market',
  'Index',
  'Profile',
  'PvP Arena v1',
  'Blockchain v1',
  'Signal Network',
  'Quest Menu',
  'Daemon Lab',
  'Archive',
  'Operator Console'
];

const stepTwoDeliverables = [
  'Canonical Firestore collection tree + field ownership',
  'Index spec for leaderboard, PvP queue, market, quests, events, admin logs',
  'Data lifecycle + archival rules for logs/events/matches/snapshots',
  'Projection strategy for low-cost profile reads (userPublic)',
  'Subcollection strategy for command intents, cooldowns, and quest claims'
];

export function DesktopShell() {
  return (
    <main className="shell">
      <header className="shell__header">
        <h1>ROOTACCESS // CHAPTER 1</h1>
        <p>Step 2 Firebase architecture blueprint is now initiated and implementation-ready.</p>
      </header>

      <section className="panel">
        <h2>Core Apps to Ship (Steps 1-14)</h2>
        <ul>
          {coreApps.map((app) => (
            <li key={app}>{app}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Step 2 Deliverables Locked</h2>
        <ul>
          {stepTwoDeliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="panel__hint">See docs/step-2/firebase-architecture-blueprint.md for canonical schema + index guidance.</p>
      </section>

      <section className="panel panel--note">
        <h2>GitHub Pages Runtime Note</h2>
        <p>
          Practical click-navigation is HTML-first (<code>index.html</code> + <code>404.html</code> hash handoff). React/TypeScript/CSS are support
          layers that render windows, interactions, and data flows on top of that static entry.
        </p>
      </section>
    </main>
  );
}
