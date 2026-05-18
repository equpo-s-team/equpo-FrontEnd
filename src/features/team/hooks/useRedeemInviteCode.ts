import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { request } from '@/lib/api/core';

import type {
  RedeemInvitationCodePayload,
  RedeemInvitationCodeResponse,
} from '../types/teamSchemas';

export function useRedeemInviteCode() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutationFn = async (
    payload: RedeemInvitationCodePayload,
  ): Promise<RedeemInvitationCodeResponse> => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    return request<RedeemInvitationCodeResponse>('/teams/join', 'POST', { code: payload.code });
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
      void queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
}
