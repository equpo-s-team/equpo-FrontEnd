import { useMutation } from '@tanstack/react-query';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '@/firebase';

import type { ReplyToPayload } from '../types/chat';

interface SendMessageArgs {
  teamId: string;
  roomId: string;
  text: string;
  type?: 'text' | 'system' | 'image' | 'file';
  replyTo?: ReplyToPayload;
  fileUrl?: string;
  fileName?: string;
}

/**
 * Writes a message directly to Firestore.
 * Security rules validate senderUid == auth.uid and enforce text constraints.
 */
export function useSendMessage() {
  return useMutation({
    mutationFn: async ({
      teamId,
      roomId,
      text,
      type = 'text',
      replyTo,
      fileUrl,
      fileName,
    }: SendMessageArgs) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const messagesRef = collection(db, 'teams', teamId, 'chatRooms', roomId, 'messages');

      const payload: Record<string, unknown> = {
        senderUid: user.uid,
        senderName: user.displayName || user.email?.split('@')[0] || 'Usuario',
        text,
        createdAt: serverTimestamp(),
        type,
        deleted: false,
        readBy: [user.uid], // The sender automatically has read it
      };

      if (replyTo) payload.replyTo = replyTo;
      if (fileUrl) payload.fileUrl = fileUrl;
      if (fileName) payload.fileName = fileName;

      await addDoc(messagesRef, payload);
    },
  });
}
