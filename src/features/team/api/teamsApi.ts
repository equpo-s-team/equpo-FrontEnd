import {
  type AddTeamMemberPayload,
  type CreateAchievementPayload,
  type CreateTeamPayload,
  type CreateTeamRewardPayload,
  type UnlockAchievementPayload,
  type UpdateTeamMemberRolePayload,
  type UpdateTeamPayload,
} from '@/features/team/types/teams.ts';

import { request } from '../../../lib/api/core.ts';

export const teamsApi = {
    getMyTeams: () =>
        request<{ teams: Team[] }>('/teams/me', 'GET'),
    create: (payload: CreateTeamPayload) =>
        request('/teams', 'POST', payload),
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
};
