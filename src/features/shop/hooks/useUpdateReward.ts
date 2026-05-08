import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shopApi } from '@/features/shop/api/shopApi.ts';
import type { UpdateRewardPayload } from '@/features/shop/types/rewardTypes.ts';

export function useUpdateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      rewardId,
      payload,
    }: {
      teamId: string;
      rewardId: string;
      payload: UpdateRewardPayload;
    }) => shopApi.updateReward(teamId, rewardId, payload),
    onSuccess: (_data, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['team', teamId, 'rewards'] });
    },
  });
}
