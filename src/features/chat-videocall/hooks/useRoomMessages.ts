import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import { db } from '@/firebase';

import type { ChatMessage } from '../types/chat';

const PAGE_SIZE = 50;

type FirestoreTimestampLike = {
  toDate: () => Date;
};

function isFirestoreTimestampLike(value: unknown): value is FirestoreTimestampLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  );
}

function toDateOrNow(value: unknown): Date {
  return isFirestoreTimestampLike(value) ? value.toDate() : new Date();
}

function toDateOrUndefined(value: unknown): Date | undefined {
  return isFirestoreTimestampLike(value) ? value.toDate() : undefined;
}

/**
 * Real-time Firestore subscription for messages in a chat room.
 * Messages are ordered by createdAt DESC and limited to the last PAGE_SIZE.
 */
export function useRoomMessages(teamId: string, roomId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ['messages', teamId, roomId, 'realtime'];
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!teamId || !roomId) return;

    // Clean up previous listener
    unsubRef.current?.();

    const messagesRef = collection(db, 'teams', teamId, 'chatRooms', roomId, 'messages');

    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));

    unsubRef.current = onSnapshot(
      q,
      (snapshot) => {
        const messages: ChatMessage[] = snapshot.docs
          .map((doc) => {
            const rawData = doc.data() as unknown;
            const data =
              typeof rawData === 'object' && rawData !== null
                ? (rawData as Record<string, unknown>)
                : {};

            return {
              id: doc.id,
              senderUid: typeof data.senderUid === 'string' ? data.senderUid : '',
              senderName: typeof data.senderName === 'string' ? data.senderName : '',
              text: typeof data.text === 'string' ? data.text : '',
              createdAt: toDateOrNow(data.createdAt),
              type: (['system', 'image', 'file'].includes(data.type as string)
                ? data.type
                : 'text') as 'text' | 'system' | 'image' | 'file',
              deleted: Boolean(data.deleted),
              editedAt: toDateOrUndefined(data.editedAt),
              replyTo: data.replyTo as ChatMessage['replyTo'],
              readBy: Array.isArray(data.readBy) ? data.readBy : [],
              fileUrl: typeof data.fileUrl === 'string' ? data.fileUrl : undefined,
              fileName: typeof data.fileName === 'string' ? data.fileName : undefined,
            };
          })
          .reverse(); // Oldest first for display

        queryClient.setQueryData(queryKey, messages);
      },
      (error) => {
        console.error('[useRoomMessages] snapshot error:', error);
      },
    );

    return () => {
      unsubRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, roomId]);

  return useQuery<ChatMessage[]>({
    queryKey,
    queryFn: () => queryClient.getQueryData(queryKey) ?? [],
    enabled: !!teamId && !!roomId,
    staleTime: Infinity,
  });
}
