import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { request } from '@/lib/api/core';

export interface DirectInvitationPayload {
  teamId: string;
  userUid: string;
  role?: 'member' | 'collaborator' | 'spectator';
}

export interface DirectInvitationResponse {
  userUid: string;
  teamId: string;
  role: string;
}

export const useDirectInvitation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: DirectInvitationPayload): Promise<DirectInvitationResponse> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      return request<DirectInvitationResponse>(`/teams/${payload.teamId}/members`, 'POST', {
        userUid: payload.userUid,
        role: payload.role || 'member',
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
