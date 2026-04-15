export interface TeamMember {
  userUid: string;
  role: 'leader' | 'collaborator' | 'spectator' | 'member';
  joinedAt: string;
  displayName?: string | null;
}

export interface Team {
  id: string;
  name: string;
  leaderUid: string;
  virtualCurrency: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
}

export type ModalMode = 'create' | 'edit' | 'profile' | null;

export interface ModalState {
  mode: ModalMode;
  teamId?: string;
}
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

export interface TeamGroup {
  id: string;
  groupName: string;
}



