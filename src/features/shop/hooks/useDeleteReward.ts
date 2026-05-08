import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shopApi } from '@/features/shop/api/shopApi.ts';

export function useDeleteReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, rewardId }: { teamId: string; rewardId: string }) =>
      shopApi.deleteReward(teamId, rewardId),
    onSuccess: (_data, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['team', teamId, 'rewards'] });
    },
  });
}
