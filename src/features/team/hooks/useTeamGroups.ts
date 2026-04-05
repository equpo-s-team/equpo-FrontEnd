import { useQuery } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';

export function useTeamGroups(teamId: string) {
  return useQuery({
    queryKey: ['team', teamId, 'groups'],
    queryFn: async () => {
      const res = await teamsApi.listGroups(teamId);
      return res.groups;
    },
    enabled: !!teamId,
  });
}
