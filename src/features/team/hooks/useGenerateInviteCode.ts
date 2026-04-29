import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection } from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { useAuth } from '@/context/AuthContext';
import { useTeams } from '@/features/team/hooks/useTeams';
import { db } from '@/firebase';
import type { CreateInvitationCodePayload, InvitationCode } from '../types/teamSchemas';

export const useGenerateInviteCode = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: teams = [] } = useTeams();

  return useMutation({
    mutationFn: async (payload: CreateInvitationCodePayload): Promise<InvitationCode> => {
      if (!user?.uid) throw new Error('User not authenticated');

      const team = teams.find(t => t.id === payload.teamId);
      if (!team) throw new Error('Equipo no encontrado');

      const isLeader = team.leaderUid === user.uid;
      const isCollaborator = team.members.some(m => m.userUid === user.uid && m.role === 'collaborator');
      if (!isLeader && !isCollaborator) throw new Error('No tienes permisos para generar códigos de invitación');

      const code = nanoid(8).toUpperCase(); // 8-char uppercase code, e.g., ABC123XY
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (payload.expiresInHours || 24) * 60 * 60 * 1000);

      const inviteData: Omit<InvitationCode, 'code'> = {
        teamId: payload.teamId,
        createdBy: user.uid,
        createdAt: now,
        expiresAt,
        maxUses: payload.maxUses || 10,
        currentUses: 0,
        role: payload.role || 'member',
      };

      await addDoc(collection(db, 'teams', payload.teamId, 'invitationCodes'), { ...inviteData, code });

      return { ...inviteData, code };
    },
    onSuccess: () => {
      // Invalidate queries if needed, e.g., list of codes
      queryClient.invalidateQueries({ queryKey: ['invitationCodes'] });
    },
  });
};
