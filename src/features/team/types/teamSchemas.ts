export interface CreateTeamPayload {
  name: string;
  description?: string | null;
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string | null;
  photoUrl?: string | null;
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
  photoUrl?: string | null;
  role: string;
}

export interface TeamGroupMember {
  uid: string;
  displayName: string | null;
  photoUrl?: string | null;
}

export interface TeamGroup {
  id: string;
  groupName: string;
  photoUrl?: string | null;
  memberCount?: number;
  members?: TeamGroupMember[];
}

export interface CreateGroupPayload {
  name: string;
  memberUids?: string[];
  photoUrl?: string;
}

export interface UpdateGroupPayload {
  name?: string;
  memberUids?: string[];
  photoUrl?: string | null;
}

export interface InvitationCode {
  code: string;
  teamId: string;
  teamName?: string;
  teamPhotoUrl?: string | null;
  teamDescription?: string | null;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  maxUses: number;
  currentUses: number;
  role: 'collaborator' | 'spectator' | 'member';
}

export interface CreateInvitationCodePayload {
  teamId: string;
  role?: 'collaborator' | 'spectator' | 'member';
  expiresInHours?: number; // e.g., 24 for 1 day
  maxUses?: number;
}

export interface RedeemInvitationCodePayload {
  code: string;
}

export interface RedeemInvitationCodeResponse {
  membership: {
    userUid: string;
    role: string;
    joinedAt: string;
  };
  team: {
    id: string;
    name: string;
  };
}
