import { useQuery } from '@tanstack/react-query';

import { shopApi } from '@/features/shop/api/shopApi.ts';

export function useRewards(teamId: string) {
  return useQuery({
    queryKey: ['team', teamId, 'rewards'],
    queryFn: () => shopApi.listRewards(teamId),
    enabled: !!teamId,
  });
}
