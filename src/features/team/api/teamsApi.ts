import type {
  AddTeamMemberPayload,
  CreateAchievementPayload,
  CreateTeamPayload,
  CreateTeamRewardPayload,
  TeamGroup,
  TeamMember,
  UnlockAchievementPayload,
  UpdateTeamMemberRolePayload,
  UpdateTeamPayload,
} from '@/features/team/types/teamSchemas.ts';
import type { Team } from '@/features/team/types/teamsTypes.ts';
import { request } from '@/lib/api/core.ts';

export const teamsApi = {
  getUser: (userUid: string) =>
    request<{ user: { uid: string; displayName?: string; photoURL?: string } }>(
      `/users/${userUid}`,
      'GET',
    ),
  getMyTeams: () => request<{ teams: Team[] }>('/teams/me', 'GET'),
  create: (payload: CreateTeamPayload) =>
    request<{ team: { id: string } }>('/teams', 'POST', payload),
  update: (teamId: string, payload: UpdateTeamPayload) =>
    request(`/teams/${teamId}`, 'PATCH', payload),
  addMember: (teamId: string, payload: AddTeamMemberPayload) =>
    request(`/teams/${teamId}/members`, 'POST', payload),
  updateMemberRole: (teamId: string, userUid: string, payload: UpdateTeamMemberRolePayload) =>
    request(`/teams/${teamId}/members/${userUid}/role`, 'PATCH', payload),
  createReward: (teamId: string, payload: CreateTeamRewardPayload) =>
    request(`/teams/${teamId}/rewards`, 'POST', payload),
  createAchievement: (teamId: string, payload: CreateAchievementPayload) =>
    request(`/teams/${teamId}/achievements`, 'POST', payload),
  unlockAchievement: (teamId: string, payload: UnlockAchievementPayload) =>
    request(`/teams/${teamId}/achievements/unlocks`, 'POST', payload),
  listMembers: (teamId: string) =>
    request<{ members: TeamMember[] }>(`/teams/${teamId}/members`, 'GET'),
  listGroups: (teamId: string) =>
    request<{ groups: TeamGroup[] }>(`/teams/${teamId}/groups`, 'GET'),
};
