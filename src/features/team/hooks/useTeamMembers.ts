import { useQuery } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ['team', teamId, 'members'],
    queryFn: async () => {
      const res = await teamsApi.listMembers(teamId);
      return res.members;
    },
    enabled: !!teamId,
  });
}
