import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { request } from '@/lib/api/core';
import type { CreateInvitationCodePayload, InvitationCode } from '../types/teamSchemas';

export const useGenerateInviteCode = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: CreateInvitationCodePayload): Promise<InvitationCode> => {
      if (!user?.uid) throw new Error('User not authenticated');

      return request<InvitationCode>(`/teams/${payload.teamId}/invitation-codes`, 'POST', {
        role: payload.role,
        expiresInHours: payload.expiresInHours,
        maxUses: payload.maxUses,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitationCodes'] });
    },
  });
};
