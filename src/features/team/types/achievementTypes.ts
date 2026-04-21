export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
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
