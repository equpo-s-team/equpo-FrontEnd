import { request } from '@/lib/api/core.ts';

import type { Achievement } from '../types/achievementTypes.ts';

export const achievementsApi = {
  list: (teamId: string) =>
    request<{ achievements: Achievement[] }>(`/teams/${teamId}/achievements`, 'GET'),
};
