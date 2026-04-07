import { useMutation } from '@tanstack/react-query';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { auth,db } from '@/firebase';

interface SendMessageArgs {
  teamId: string;
  roomId: string;
  text: string;
}

/**
 * Writes a message directly to Firestore.
 * Security rules validate senderUid == auth.uid and enforce text constraints.
 */
export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ teamId, roomId, text }: SendMessageArgs) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const messagesRef = collection(
        db,
        'teams',
        teamId,
        'chatRooms',
        roomId,
        'messages',
      );

      await addDoc(messagesRef, {
        senderUid: user.uid,
        senderName: user.displayName || user.email?.split('@')[0] || 'Usuario',
        text,
        createdAt: serverTimestamp(),
        type: 'text',
        deleted: false,
      });
    },
  });
}
