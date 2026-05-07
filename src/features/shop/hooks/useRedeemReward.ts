import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shopApi } from '@/features/shop/api/shopApi.ts';
import type { Reward } from '@/features/shop/types/rewardTypes.ts';

export function useRedeemReward() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { teamId: string; reward: Reward; userUid?: string }>({
    mutationFn: ({ teamId, reward, userUid }) => {
      if (reward.type === 'team') {
        return shopApi.redeemTeamReward(teamId, reward.id);
      }
      if (!userUid) throw new Error('userUid required for member reward redemption');
      return shopApi.redeemMemberReward(teamId, userUid, reward.id);
    },
    onSuccess: (_data, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['team', teamId, 'rewards'] });
    },
  });
}
