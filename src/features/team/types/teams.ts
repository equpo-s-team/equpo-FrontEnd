export interface CreateTeamPayload {
  name: string;
  virtualCurrency: number;
  description?: string | null;
}

export interface UpdateTeamPayload {
  name?: string;
  virtualCurrency?: number;
  description?: string | null;
}

export interface AddTeamMemberPayload {
  userUid: string;
  role?: 'collaborator' | 'spectator' | 'member';
}

export interface UpdateTeamMemberRolePayload {
  role: 'collaborator' | 'spectator' | 'member';
}

export interface CreateTeamRewardPayload {
  rewardId: string;
  dateObtained?: string;
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

export interface TeamMember {
  uid: string;
  displayName: string | null;
  role: string;
}

export interface TeamGroup {
  id: string;
  groupName: string;
}
