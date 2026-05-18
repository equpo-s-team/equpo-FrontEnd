import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shopApi } from '@/features/shop/api/shopApi.ts';
import type { Reward } from '@/features/shop/types/rewardTypes.ts';

export function usePurchaseReward() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { teamId: string; reward: Reward }>({
    mutationFn: ({ teamId, reward }) => {
      if (reward.type === 'team') {
        return shopApi.purchaseTeamReward(teamId, reward.id);
      }
      return shopApi.purchaseMemberReward(teamId, reward.id);
    },
    onSuccess: (_data, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['team', teamId, 'rewards'] });
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
