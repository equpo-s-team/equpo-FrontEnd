import { useMutation } from '@tanstack/react-query';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface DeleteMessageArgs {
  teamId: string;
  roomId: string;
  messageId: string;
}

/**
 * Deletes a message the current user owns.
 * Security rules verify senderUid == auth.uid before allowing the delete.
 */
export function useDeleteMessage() {
  return useMutation({
    mutationFn: async ({ teamId, roomId, messageId }: DeleteMessageArgs) => {
      const messageRef = doc(
        db,
        'teams',
        teamId,
        'chatRooms',
        roomId,
        'messages',
        messageId,
      );

      await deleteDoc(messageRef);
    },
  });
}
