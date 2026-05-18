import { request } from '@/lib/api/core';

export interface EnvironmentInteractResult {
  newCoinBalance: number;
  environmentHealth: number;
}

export const environmentApi = {
  interact(
    teamId: string,
    eventType: 'feed-ducks' | 'water-garden',
  ): Promise<EnvironmentInteractResult> {
    return request<EnvironmentInteractResult>(`/teams/${teamId}/environment/interact`, 'POST', {
      eventType,
    });
  },
};
