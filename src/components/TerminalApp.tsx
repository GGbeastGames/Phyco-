import { useMemo, useState } from 'react';

type CommandDef = {
  id: string;
  reward: number;
  traceDelta: number;
  cooldownMs: number;
  description: string;
};

type PlayerState = {
  credits: number;
  trace: number;
  xp: number;
  level: number;
};

const COMMANDS: CommandDef[] = [
  { id: 'scan.node', reward: 18, traceDelta: 6, cooldownMs: 6000, description: 'Network surface scan for weak points.' },
  { id: 'inject.proxy', reward: 32, traceDelta: 10, cooldownMs: 9000, description: 'Proxy-chain injection against low-tier relays.' },
  { id: 'drain.wallet', reward: 54, traceDelta: 16, cooldownMs: 13000, description: 'Extract credits from compromised hot wallets.' },
  { id: 'scrub.trace', reward: 0, traceDelta: -20, cooldownMs: 12000, description: 'Reduce active trace pressure at no credit gain.' }
];

const HELP_LINES = [
  'help                -> list available commands',
  'status              -> show credits/xp/level/trace',
  'run <commandId>     -> execute command if off cooldown',
  'clear               -> clear terminal output'
];

export function TerminalApp() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>([
    'ROOTACCESS TERMINAL v0.6 // Step 6 command loop active.',
    'Type "help" to view available commands.'
  ]);
  const [player, setPlayer] = useState<PlayerState>({ credits: 120, trace: 4, xp: 0, level: 1 });
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const commandMap = useMemo(() => Object.fromEntries(COMMANDS.map((c) => [c.id, c])), []);

  function addLog(line: string) {
    setLogs((prev) => [...prev.slice(-120), line]);
  }

  function maybeLevelUp(nextXp: number, current: PlayerState) {
    const threshold = current.level * 100;
    if (nextXp < threshold) return { level: current.level, xp: nextXp, levelUp: false };
    return { level: current.level + 1, xp: nextXp - threshold, levelUp: true };
  }

  function runCommand(commandId: string) {
    const now = Date.now();
    const cmd = commandMap[commandId];
    if (!cmd) {
      addLog(`[ERR] unknown command: ${commandId}`);
      return;
    }

    const until = cooldowns[commandId] ?? 0;
    if (until > now) {
      addLog(`[CD] ${commandId} cooldown ${Math.ceil((until - now) / 1000)}s remaining.`);
      return;
    }

    setCooldowns((prev) => ({ ...prev, [commandId]: now + cmd.cooldownMs }));

    setPlayer((prev) => {
      const gainedXp = commandId === 'scrub.trace' ? 8 : 14;
      const leveled = maybeLevelUp(prev.xp + gainedXp, prev);
      const nextTrace = Math.max(0, Math.min(100, prev.trace + cmd.traceDelta));
      const next = {
        credits: prev.credits + cmd.reward,
        trace: nextTrace,
        xp: leveled.xp,
        level: leveled.level
      };

      addLog(`[OK] ${commandId} => credits +${cmd.reward}, trace ${cmd.traceDelta >= 0 ? '+' : ''}${cmd.traceDelta}, xp +${gainedXp}`);
      if (leveled.levelUp) addLog(`[LVL] Level up -> ${leveled.level}`);
      if (next.trace >= 80) addLog('[WARN] trace critical, run scrub.trace');
      return next;
    });
  }

  function execute(raw: string) {
    const line = raw.trim();
    if (!line) return;

    addLog(`> ${line}`);

    if (line === 'help') {
      HELP_LINES.forEach(addLog);
      COMMANDS.forEach((c) => addLog(`- ${c.id} (${c.cooldownMs / 1000}s) :: ${c.description}`));
      return;
    }

    if (line === 'status') {
      addLog(`[ST] credits=${player.credits} xp=${player.xp} level=${player.level} trace=${player.trace}`);
      return;
    }

    if (line === 'clear') {
      setLogs(['[SYS] terminal cleared.']);
      return;
    }

    if (line.startsWith('run ')) {
      runCommand(line.slice(4).trim());
      return;
    }

    addLog(`[ERR] unknown input. Try: help`);
  }

  return (
    <div className="ra-terminal">
      <div className="ra-terminal__hud">
        <span>¢ {player.credits}</span>
        <span>XP {player.xp}</span>
        <span>LVL {player.level}</span>
        <span className={player.trace >= 70 ? 'is-alert' : ''}>TRACE {player.trace}%</span>
      </div>

      <div className="ra-terminal__log" role="log" aria-live="polite">
        {logs.map((line, i) => (
          <div key={`${line}-${i}`}>{line}</div>
        ))}
      </div>

      <form
        className="ra-terminal__input"
        onSubmit={(e) => {
          e.preventDefault();
          execute(input);
          setInput('');
        }}
      >
        <label htmlFor="cmd">cmd&gt;</label>
        <input id="cmd" value={input} onChange={(e) => setInput(e.target.value)} placeholder="run scan.node" autoComplete="off" />
        <button type="submit">exec</button>
      </form>
    </div>
  );
}
