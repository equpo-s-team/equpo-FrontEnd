import { useQuery } from '@tanstack/react-query';

import { teamsApi } from '../api/teamsApi';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsApi.getMyTeams();
      return response.teams;
    },
  });
}
