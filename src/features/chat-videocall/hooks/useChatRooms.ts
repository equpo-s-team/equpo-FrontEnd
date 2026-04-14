import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { useEffect } from 'react';

import { db } from '@/firebase';

import type { ChatRoom } from '../types/chat';

type GroupLike = {
  id: string;
  groupName?: string;
};

/**
 * Subscribes to each allowed chatRoom document (by backend group list).
 * This keeps realtime updates without requiring a broad collection list query.
 */
export function useChatRooms(teamId: string, groups: GroupLike[]) {
  const queryClient = useQueryClient();
  const queryKey = ['chatRooms', teamId, 'realtime'];

  useEffect(() => {
    if (!teamId) return;

    const rooms = new Map<string, ChatRoom>();
    const unsubscribes: Unsubscribe[] = [];

    const pushRooms = () => {
      const ordered = Array.from(rooms.values()).sort((a, b) => a.name.localeCompare(b.name));
      queryClient.setQueryData(queryKey, ordered);
    };

    // Seed from backend group list so UI has immediate entries before Firestore resolves.
    for (const group of groups) {
      rooms.set(group.id, {
        id: group.id,
        name: group.groupName ?? group.id,
        type: 'group',
        createdBy: '',
        createdAt: new Date(0),
      });
    }
    pushRooms();

    for (const group of groups) {
      const roomDocRef = doc(db, 'teams', teamId, 'chatRooms', group.id);

      const unsub = onSnapshot(
        roomDocRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            return;
          }

          const rawData = snapshot.data() as unknown;
          const data =
            typeof rawData === 'object' && rawData !== null
              ? (rawData as Record<string, unknown>)
              : {};

          const createdAtValue = data.createdAt as { toDate?: () => Date } | undefined;
          const createdAt =
            createdAtValue && typeof createdAtValue.toDate === 'function'
              ? createdAtValue.toDate()
              : new Date(0);

          rooms.set(group.id, {
            id: group.id,
            name:
              typeof data.name === 'string' && data.name.trim().length > 0
                ? data.name
                : (group.groupName ?? group.id),
            type: 'group',
            createdBy: typeof data.createdBy === 'string' ? data.createdBy : '',
            createdAt,
          });
          pushRooms();
        },
        (error) => {
          console.warn(`[useChatRooms] room ${group.id} snapshot denied/unavailable:`, error);
        },
      );

      unsubscribes.push(unsub);
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, groups.map((g) => `${g.id}:${g.groupName ?? ''}`).join('|')]);

  return useQuery<ChatRoom[]>({
    queryKey,
    queryFn: () => queryClient.getQueryData(queryKey) ?? [],
    enabled: !!teamId,
    staleTime: Infinity,
  });
}
