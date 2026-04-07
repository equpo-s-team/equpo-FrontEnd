import { useEffect, useRef } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  type Unsubscribe,
} from 'firebase/firestore';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import type { ChatMessage } from '../types/chat';

const PAGE_SIZE = 50;

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

    const messagesRef = collection(
      db,
      'teams',
      teamId,
      'chatRooms',
      roomId,
      'messages',
    );

    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));

    unsubRef.current = onSnapshot(
      q,
      (snapshot) => {
        const messages: ChatMessage[] = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              senderUid: (data.senderUid as string) ?? '',
              senderName: (data.senderName as string) ?? '',
              text: (data.text as string) ?? '',
              createdAt: data.createdAt?.toDate?.() ?? new Date(),
              type: (data.type as 'text' | 'system') ?? 'text',
              deleted: Boolean(data.deleted),
              editedAt: data.editedAt?.toDate?.() ?? undefined,
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
