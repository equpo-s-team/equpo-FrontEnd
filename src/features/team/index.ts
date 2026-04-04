export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatarInitials: string;
  avatarGradient: string;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  score: number; // 0–100
  createdAt: string;
  color: TeamColor;
}

export type TeamColor = 'blue' | 'purple' | 'green' | 'red' | 'orange';

export interface CreateTeamPayload {
  name: string;
  description: string;
  memberEmails: string[];
}

export interface EditTeamPayload {
  name: string;
  description: string;
}

export type ModalMode = 'create' | 'edit' | 'profile' | null;

export interface ModalState {
  mode: ModalMode;
  teamId?: string;
}
