export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  iconUrl?: string | null;
  unlockedAt?: string | null;
}

export interface CreateAchievementPayload {
  name: string;
  description?: string | null;
  iconURL?: string | null;
}

export interface UnlockAchievementPayload {
  userUid: string;
  achievementId: string;
  unlockedAt?: string;
}

export interface XpRewardData {
  xpGained: number;
  coinsGained: number;
  userCoinsGained?: number;
  newXp: number;
  newLevel: number;
  newUserVirtualCurrency?: number;
  leveledUp: boolean;
}

export const ACHIEVEMENT_ICON_MAP: Record<string, string> = {
  'primer-paso': 'footprints',
  'nueva-alianza': 'users-round',
  'vida-nueva': 'heart-pulse',
  'la-voz-de-todos': 'mic',
  sinergia: 'handshake',
  'subida-de-nivel': 'trending-up',
  'tiempo-de-resurgir': 'skull',
  'red-de-trabajo': 'network',
  'mentor-virtual': 'eye',
  'velocidad-luz': 'zap',
};
