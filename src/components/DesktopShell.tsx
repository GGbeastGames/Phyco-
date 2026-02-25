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

const stepOneDeliverables = [
  'Game loop + progression pacing map',
  'Command taxonomy with unlock matrix',
  'Firebase free-tier read/write assumptions',
  'Threat model with anti-cheat mitigation catalog',
  'UX pillars + visual language board constraints'
];

export function DesktopShell() {
  return (
    <main className="shell">
      <header className="shell__header">
        <h1>ROOTACCESS // CHAPTER 1</h1>
        <p>Step 1 foundation is now scaffolded and ready for feature implementation.</p>
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
        <h2>Step 1 Deliverables Locked</h2>
        <ul>
          {stepOneDeliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="panel__hint">See docs/step-1/design-lock.md for implementation detail.</p>
      </section>
    </main>
  );
}
