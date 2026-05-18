import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shopApi } from '@/features/shop/api/shopApi.ts';
import type { CreateRewardPayload } from '@/features/shop/types/rewardTypes.ts';

export function useCreateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: CreateRewardPayload }) =>
      shopApi.createReward(teamId, payload),
    onSuccess: (_data, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['team', teamId, 'rewards'] });
    },
  });
}
