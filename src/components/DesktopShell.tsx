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

const stepFourDeliverables = [
  'Production-ready repo topology documented',
  'CI pipeline for install/check/rules-test/build',
  'GitHub Pages deployment workflow for static dist publish',
  'Environment + secret handling strategy documented',
  'Route fallback and hash-navigation safety retained'
];

export function DesktopShell() {
  return (
    <main className="shell">
      <header className="shell__header">
        <h1>ROOTACCESS // CHAPTER 1</h1>
        <p>Step 4 repo/deploy topology is now initiated with CI + Pages deployment hardening.</p>
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
        <h2>Step 4 Deliverables Locked</h2>
        <ul>
          {stepFourDeliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="panel__hint">See docs/step-4/repo-topology-and-ci.md for exploit tests and runbook.</p>
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
