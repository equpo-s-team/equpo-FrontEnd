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
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
}

export type ModalMode = 'create' | 'edit' | 'profile' | null;

export interface ModalState {
  mode: ModalMode;
  teamId?: string;
}
