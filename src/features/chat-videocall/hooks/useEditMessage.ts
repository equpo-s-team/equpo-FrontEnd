import { useMutation } from '@tanstack/react-query';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

interface EditMessageArgs {
  teamId: string;
  roomId: string;
  messageId: string;
  newText: string;
}

/**
 * Updates the text of a message the current user owns.
 * Security rules verify senderUid == auth.uid and lock immutable fields.
 */
export function useEditMessage() {
  return useMutation({
    mutationFn: async ({ teamId, roomId, messageId, newText }: EditMessageArgs) => {
      const messageRef = doc(
        db,
        'teams',
        teamId,
        'chatRooms',
        roomId,
        'messages',
        messageId,
      );

      await updateDoc(messageRef, {
        text: newText,
        editedAt: serverTimestamp(),
      });
    },
  });
}
