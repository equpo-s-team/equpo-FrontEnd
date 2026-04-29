import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionGroup, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import type { RedeemInvitationCodePayload } from '../types/teamSchemas';

export const useRedeemInviteCode = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: RedeemInvitationCodePayload) => {
      console.log('Redeeming code:', payload.code);
      if (!user?.uid) {
        console.log('User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('Querying for code...');
      // Query across all subcollections 'invitationCodes' for the code
      const q = query(collectionGroup(db, 'invitationCodes'), where('code', '==', payload.code));
      const querySnapshot = await getDocs(q);

      console.log('Query result:', querySnapshot.size, 'docs found');
      if (querySnapshot.empty) {
        console.log('No code found');
        throw new Error('Código de invitación inválido');
      }

      const codeDoc = querySnapshot.docs[0]; // Assume unique codes
      const codeData = codeDoc.data();
      console.log('Code data:', codeData);
      const now = new Date();

      if (codeData.expiresAt.toDate() < now) {
        console.log('Code expired');
        throw new Error('Código de invitación expirado');
      }

      if (codeData.currentUses >= codeData.maxUses) {
        console.log('Code exhausted');
        throw new Error('Código de invitación agotado');
      }

      console.log('Incrementing uses...');
      // Increment uses
      await updateDoc(codeDoc.ref, {
        currentUses: codeData.currentUses + 1,
      });
      console.log('Uses incremented');

      return {
        teamId: codeData.teamId,
        role: codeData.role,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};
