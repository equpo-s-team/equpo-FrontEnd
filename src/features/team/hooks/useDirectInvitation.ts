import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { request } from '@/lib/api/core';

export interface DirectInvitationPayload {
  teamId: string;
  userUid?: string;
  email?: string;
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

      if (!payload.userUid && !payload.email) {
        throw new Error('userUid or email is required');
      }

      const body: Record<string, string> = { role: payload.role || 'member' };
      if (payload.userUid) body.userUid = payload.userUid;
      else if (payload.email) body.email = payload.email;

      return request<DirectInvitationResponse>(
        `/teams/${payload.teamId}/members`,
        'POST',
        body,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
