import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, collectionGroup, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import type { RedeemInvitationCodePayload } from '../types/teamSchemas';

export function useRedeemInviteCode() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutationFn = async (payload: RedeemInvitationCodePayload) => {
    console.log('Redeeming code:', payload.code);
    if (!user?.uid) {
      console.log('User not authenticated');
      throw new Error('User not authenticated');
    }

    console.log('Querying for code...');
    const q = query(collectionGroup(db, 'invitationCodes'), where('code', '==', payload.code));
    const querySnapshot = await getDocs(q);

    console.log('Query result:', querySnapshot.size, 'docs found');
    if (querySnapshot.empty) {
      console.log('No code found');
      throw new Error('Código de invitación inválido');
    }

    const codeDoc = querySnapshot.docs[0];
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
    await updateDoc(codeDoc.ref, {
      currentUses: codeData.currentUses + 1,
    });
    console.log('Uses incremented');

    // Add user as team member directly in Firestore
    console.log('Adding user as team member...');
    const memberRef = doc(collection(db, `teams/${codeData.teamId}/members`), user.uid);
    await setDoc(memberRef, {
      userUid: user.uid,
      role: codeData.role,
      joinedAt: new Date(),
    });
    console.log('User added as team member');

    return {
      teamId: codeData.teamId,
      role: codeData.role,
    };
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};
