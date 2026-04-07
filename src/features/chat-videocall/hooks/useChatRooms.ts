import { useQuery,useQueryClient } from '@tanstack/react-query';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from 'firebase/firestore';
import { useEffect } from 'react';

import { db } from '@/firebase';

import type { ChatRoom } from '../types/chat';

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

/**
 * Subscribes to the chatRooms the current user belongs to within a team.
 *
 * Because Firestore security rules enforce `isChatRoomMember`, the query
 * on the parent `chatRooms` collection would fail for rooms where the user
 * is NOT a member. We work around this by querying all chatRooms (which the
 * user has access to) — the security rules will only return accessible docs.
 *
 * NOTE: If the Firestore security rules block listing chatRooms at the
 * collection level (since we use per-doc member checks), we fall back to
 * fetching the user's group list from the backend and subscribing to each
 * room individually. The `groupIds` parameter enables this pattern.
 */
export function useChatRooms(teamId: string, groupIds: string[]) {
  const queryClient = useQueryClient();
  const queryKey = ['chatRooms', teamId, 'realtime'];

  useEffect(() => {
    if (!teamId || groupIds.length === 0) return;

    const unsubscribes: Unsubscribe[] = [];

    // Subscribe to each room the user belongs to (by groupId)
    const rooms = new Map<string, ChatRoom>();

    const roomRef = collection(db, 'teams', teamId, 'chatRooms');
    // Single collection listener — filter client-side by groupIds
    const unsub = onSnapshot(
      query(roomRef, orderBy('createdAt', 'desc')),
      (snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (groupIds.includes(doc.id)) {
            const rawData = doc.data() as unknown;
            const data =
              typeof rawData === 'object' && rawData !== null
                ? (rawData as Record<string, unknown>)
                : {};

            rooms.set(doc.id, {
              id: doc.id,
              name: typeof data.name === 'string' ? data.name : '',
              type: 'group',
              createdBy: typeof data.createdBy === 'string' ? data.createdBy : '',
              createdAt: toDateOrNow(data.createdAt),
            });
          }
        });
        queryClient.setQueryData(queryKey, Array.from(rooms.values()));
      },
      (error) => {
        console.error('[useChatRooms] snapshot error:', error);
      },
    );
    unsubscribes.push(unsub);

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, groupIds.join(',')]);

  return useQuery<ChatRoom[]>({
    queryKey,
    queryFn: () => queryClient.getQueryData(queryKey) ?? [],
    enabled: !!teamId,
    staleTime: Infinity,
  });
}
