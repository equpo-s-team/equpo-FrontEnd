import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { request } from '@/lib/api/core';
import type { RedeemInvitationCodePayload, RedeemInvitationCodeResponse } from '../types/teamSchemas';

export function useRedeemInviteCode() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutationFn = async (payload: RedeemInvitationCodePayload): Promise<RedeemInvitationCodeResponse> => {
    console.log('Redeeming code:', payload.code);
    if (!user?.uid) {
      console.log('User not authenticated');
      throw new Error('User not authenticated');
    }

    console.log('Calling backend endpoint...');
    const data = await request<RedeemInvitationCodeResponse>('/teams/join', 'POST', { code: payload.code });
    console.log('Backend response:', data);
    return data;
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};
