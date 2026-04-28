import { useQuery } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';

export function useTeamGroups(teamId: string | undefined) {
  return useQuery({
    queryKey: ['team', teamId, 'groups'],
    queryFn: async () => {
      if (!teamId) {
        throw new Error('teamId is required to fetch team groups');
      }
      const res = await teamsApi.listGroups(teamId);
      return res.groups;
    },
    enabled: !!teamId,
  });
}
