import { useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import type { ChatRoom } from '../types/chat';

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
            const data = doc.data();
            rooms.set(doc.id, {
              id: doc.id,
              name: (data.name as string) ?? '',
              type: 'group',
              createdBy: (data.createdBy as string) ?? '',
              createdAt: data.createdAt?.toDate?.() ?? new Date(),
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
