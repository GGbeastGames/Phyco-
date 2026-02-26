export type TimestampIso = string;

export type QuestProgressEnvelope = {
  questId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  updatedAt: TimestampIso;
};

export type PlayerBlockAsset = {
  blockId: string;
  tier: number;
  passiveIncomePerHour: number;
  vulnerableUntil: TimestampIso | null;
};

export type PlayerPvpRecord = {
  wins: number;
  losses: number;
  currentStreak: number;
  highestStreak: number;
  rating: number;
};

export type UserPrivateDoc = {
  uid: string;
  displayName: string;
  photoURL: string | null;
  balance: number;
  trace: number;
  xp: number;
  level: number;
  rankScore: number;
  ownedCommands: string[];
  installedModules: string[];
  traits: string[];
  cooldowns: Record<string, TimestampIso>;
  questProgress: Record<string, QuestProgressEnvelope>;
  blockchainAssets: Record<string, PlayerBlockAsset>;
  pvp: PlayerPvpRecord;
  isAdmin: boolean;
  createdAt: TimestampIso;
  updatedAt: TimestampIso;
  lastSeenAt: TimestampIso;
};

export type UserPublicProjectionDoc = {
  uid: string;
  displayName: string;
  avatarFrame: string;
  level: number;
  rankScore: number;
  factionTag: string;
  badgeHighlights: string[];
  updatedAt: TimestampIso;
};

export type CommandDoc = {
  commandId: string;
  name: string;
  tier: 'early' | 'mid' | 'late';
  cooldownMs: number;
  baseReward: number;
  traceImpact: number;
  requiredLevel: number;
  requiredTraits: string[];
  isActive: boolean;
};

export type QuestDoc = {
  questId: string;
  type: 'daily' | 'weekly' | 'seasonal';
  objectiveKey: string;
  target: number;
  rewardCredits: number;
  rewardXp: number;
  expiresAt: TimestampIso;
  isActive: boolean;
};

export type PvpMatchDoc = {
  matchId: string;
  playerAUid: string;
  playerBUid: string;
  status: 'queued' | 'active' | 'completed' | 'aborted';
  winnerUid: string | null;
  startedAt: TimestampIso | null;
  endedAt: TimestampIso | null;
  resolutionHash: string | null;
  updatedAt: TimestampIso;
};

export type AdminLogDoc = {
  logId: string;
  actorUid: string;
  action: string;
  targetPath: string;
  payloadHash: string;
  createdAt: TimestampIso;
};
