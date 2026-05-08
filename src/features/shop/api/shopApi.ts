import type {
  CreateRewardPayload,
  ListRewardsResponse,
  Reward,
  UpdateRewardPayload,
} from '@/features/shop/types/rewardTypes.ts';
import { request } from '@/lib/api/core.ts';

export const shopApi = {
  listRewards: (teamId: string) => request<ListRewardsResponse>(`/teams/${teamId}/rewards`, 'GET'),

  createReward: (teamId: string, payload: CreateRewardPayload) =>
    request<{ reward: Reward }>(`/teams/${teamId}/rewards`, 'POST', payload),

  updateReward: (teamId: string, rewardId: string, payload: UpdateRewardPayload) =>
    request<{ reward: Reward }>(`/teams/${teamId}/rewards/${rewardId}`, 'PATCH', payload),

  deleteReward: (teamId: string, rewardId: string) =>
    request<void>(`/teams/${teamId}/rewards/${rewardId}`, 'DELETE'),

  purchaseTeamReward: (teamId: string, rewardId: string) =>
    request<{ teamReward: object; newTeamVirtualCurrency: number }>(
      `/teams/${teamId}/rewards/${rewardId}/purchase-team`,
      'POST',
    ),

  purchaseMemberReward: (teamId: string, rewardId: string) =>
    request<{ userReward: object; newMembershipCurrency: number }>(
      `/teams/${teamId}/rewards/${rewardId}/purchase-member`,
      'POST',
    ),

  redeemTeamReward: (teamId: string, rewardId: string) =>
    request<{ teamReward: object }>(`/teams/${teamId}/rewards/${rewardId}/redeem-team`, 'POST'),

  redeemMemberReward: (teamId: string, userUid: string, rewardId: string) =>
    request<{ userReward: object }>(
      `/teams/${teamId}/users/${userUid}/rewards/${rewardId}/redeem`,
      'POST',
    ),
};
