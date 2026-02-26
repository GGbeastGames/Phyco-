import { useMemo, useRef, useState } from 'react';

type AppKey =
  | 'terminal'
  | 'market'
  | 'index'
  | 'profile'
  | 'pvp'
  | 'blockchain'
  | 'signal'
  | 'quest'
  | 'daemon'
  | 'archive'
  | 'operator';

type DesktopApp = {
  key: AppKey;
  title: string;
  icon: string;
  summary: string;
};

type WindowState = {
  appKey: AppKey;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
};

const APPS: DesktopApp[] = [
  { key: 'terminal', title: 'Terminal', icon: '>_', summary: 'Command parser, cooldowns, rewards, and trace pressure.' },
  { key: 'market', title: 'Black Market', icon: '$', summary: 'Rotating inventory, modules, and event items.' },
  { key: 'index', title: 'Index', icon: '[]', summary: 'Inventory, unlock progress, and command collection.' },
  { key: 'profile', title: 'Profile', icon: '@', summary: 'Rank, wealth graph, badges, and progression stats.' },
  { key: 'pvp', title: 'PvP Arena', icon: '⚔', summary: 'Realtime duel queue and secure settlement envelope.' },
  { key: 'blockchain', title: 'Blockchain', icon: '⛓', summary: 'Block ownership, upgrades, and attack windows.' },
  { key: 'signal', title: 'Signal Network', icon: '◉', summary: 'Node graph missions and admin live operations.' },
  { key: 'quest', title: 'Quest Menu', icon: '✓', summary: 'Daily/weekly objectives and claim handling.' },
  { key: 'daemon', title: 'Daemon Lab', icon: '∆', summary: 'Passive automation modules and modifiers.' },
  { key: 'archive', title: 'Archive', icon: '⎘', summary: 'Global event timeline and chapter recaps.' },
  { key: 'operator', title: 'Operator Console', icon: '#', summary: 'Admin controls, moderation, and audit logs.' }
];

function nextWindowLayout(index: number) {
  const step = 28;
  return {
    x: 48 + (index % 6) * step,
    y: 92 + (index % 5) * step,
    width: 420,
    height: 300
  };
}

export function DesktopShell() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusOrder, setFocusOrder] = useState<AppKey[]>([]);
  const dragRef = useRef<{ appKey: AppKey; dx: number; dy: number } | null>(null);

  const orderedWindows = useMemo(() => {
    return [...windows].sort((a, b) => focusOrder.indexOf(a.appKey) - focusOrder.indexOf(b.appKey));
  }, [windows, focusOrder]);

  function focusWindow(appKey: AppKey) {
    setFocusOrder((prev) => [...prev.filter((k) => k !== appKey), appKey]);
  }

  function openWindow(appKey: AppKey) {
    const existing = windows.find((w) => w.appKey === appKey);
    if (existing) {
      setWindows((prev) => prev.map((w) => (w.appKey === appKey ? { ...w, minimized: false } : w)));
      focusWindow(appKey);
      return;
    }

    const layout = nextWindowLayout(windows.length);
    setWindows((prev) => [...prev, { appKey, ...layout, minimized: false }]);
    focusWindow(appKey);
  }

  function closeWindow(appKey: AppKey) {
    setWindows((prev) => prev.filter((w) => w.appKey !== appKey));
    setFocusOrder((prev) => prev.filter((k) => k !== appKey));
  }

  function minimizeWindow(appKey: AppKey) {
    setWindows((prev) => prev.map((w) => (w.appKey === appKey ? { ...w, minimized: true } : w)));
  }

  function maximizeWindow(appKey: AppKey) {
    setWindows((prev) =>
      prev.map((w) =>
        w.appKey === appKey
          ? { ...w, x: 20, y: 70, width: Math.max(window.innerWidth - 40, 360), height: Math.max(window.innerHeight - 130, 240), minimized: false }
          : w
      )
    );
    focusWindow(appKey);
  }

  function onDragStart(appKey: AppKey, clientX: number, clientY: number, x: number, y: number) {
    dragRef.current = { appKey, dx: clientX - x, dy: clientY - y };
    focusWindow(appKey);
  }

  function onDragMove(clientX: number, clientY: number) {
    if (!dragRef.current) return;
    const { appKey, dx, dy } = dragRef.current;
    setWindows((prev) =>
      prev.map((w) =>
        w.appKey === appKey
          ? {
              ...w,
              x: Math.max(8, clientX - dx),
              y: Math.max(56, clientY - dy)
            }
          : w
      )
    );
  }

  function stopDrag() {
    dragRef.current = null;
  }

  return (
    <main
      className="ra-desktop"
      onMouseMove={(e) => onDragMove(e.clientX, e.clientY)}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={stopDrag}
    >
      <header className="ra-topbar">
        <h1>ROOTACCESS // CHAPTER 1 // STEP 5 WINDOWING CORE</h1>
        <span>Theme: Hacker-inspired neon console UI</span>
      </header>

      <aside className="ra-launcher">
        {APPS.map((app) => (
          <button key={app.key} className="ra-app-icon" onClick={() => openWindow(app.key)} type="button">
            <strong>{app.icon}</strong>
            <span>{app.title}</span>
          </button>
        ))}
      </aside>

      <section className="ra-windows">
        {orderedWindows
          .filter((w) => !w.minimized)
          .map((w) => {
            const app = APPS.find((a) => a.key === w.appKey)!;
            const focused = focusOrder[focusOrder.length - 1] === w.appKey;

            return (
              <article
                key={w.appKey}
                className={`ra-window ${focused ? 'is-focused' : ''}`}
                style={{ left: w.x, top: w.y, width: w.width, height: w.height }}
                onMouseDown={() => focusWindow(w.appKey)}
              >
                <div
                  className="ra-window__titlebar"
                  onMouseDown={(e) => onDragStart(w.appKey, e.clientX, e.clientY, w.x, w.y)}
                  onTouchStart={(e) => onDragStart(w.appKey, e.touches[0].clientX, e.touches[0].clientY, w.x, w.y)}
                >
                  <span>{app.icon} {app.title}</span>
                  <div className="ra-window__actions">
                    <button onClick={() => minimizeWindow(w.appKey)} type="button">_</button>
                    <button onClick={() => maximizeWindow(w.appKey)} type="button">▢</button>
                    <button onClick={() => closeWindow(w.appKey)} type="button">×</button>
                  </div>
                </div>
                <div className="ra-window__body">
                  <p>{app.summary}</p>
                  <ul>
                    <li>Window manager active: drag, focus stack, minimize, maximize, close.</li>
                    <li>Reusable app frame established for Step 6+ feature internals.</li>
                    <li>GitHub Pages remains HTML-first (`index.html` + `404.html`) with hash routing.</li>
                  </ul>
                </div>
              </article>
            );
          })}
      </section>

      <footer className="ra-taskbar">
        <button className="ra-start" type="button">ROOT</button>
        <div className="ra-taskbar__apps">
          {windows.map((w) => {
            const app = APPS.find((a) => a.key === w.appKey)!;
            return (
              <button
                key={w.appKey}
                className={`ra-task ${w.minimized ? 'is-min' : ''}`}
                onClick={() => openWindow(w.appKey)}
                type="button"
              >
                {app.title}
              </button>
            );
          })}
        </div>
      </footer>
    </main>
  );
}
