export const collectionPaths = {
  users: 'users',
  userPublic: 'userPublic',
  commands: 'commands',
  quests: 'quests',
  marketRotations: 'marketRotations',
  seasonConfigs: 'seasonConfigs',
  globalState: 'globalState',
  pvpMatches: 'pvpMatches',
  adminLogs: 'adminLogs',
  economySnapshots: 'economySnapshots'
} as const;

export const userSubcollectionPaths = {
  commandIntents: 'commandIntents',
  cooldowns: 'cooldowns',
  questClaims: 'questClaims'
} as const;

export const queryBudgets = {
  leaderboardTop: 100,
  pvpQueueWindow: 50,
  globalEventsWindow: 30
} as const;

export const githubPagesRuntimeNote =
  'GitHub Pages runtime is HTML-first: index.html + 404.html preserve click-paths while TS/React provides app behavior.';
