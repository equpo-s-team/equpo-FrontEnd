import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, orderBy, type Query, query } from 'firebase/firestore';
import { useCallback, useMemo } from 'react';

import { db } from '@/firebase';
import { useFirestoreSubscription } from '@/hooks/useFirestoreSubscription';

import type { GetTeamTasksOptions, TaskListMeta, TeamTask } from '../types';

type FirestoreDateValue = string | { toDate: () => Date } | undefined;

type FirestoreTaskDoc = {
  name?: string;
  description?: string;
  dueDate?: FirestoreDateValue;
  priority?: TeamTask['priority'];
  status?: TeamTask['status'];
  isRecurring?: boolean;
  recurringInterval?: TeamTask['recurringInterval'];
  recurringCount?: number | null;
  assignedUserId?: string;
  assignedGroup?: string;
  updatedAt?: FirestoreDateValue;
  category?: string[];
};

const EMPTY_META: TaskListMeta = {
  page: 1,
  limit: 0,
  maxLimit: 0,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
  nextPage: null,
  prevPage: null,
};

function toIsoString(value: FirestoreDateValue): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return '';
}

export function useTasks(teamId: string, options: GetTeamTasksOptions = {}) {
  // Stabilize options so that the default `{}` doesn't create a new reference
  // every render, which would make queryKey referentially unstable.
  const stableOptions = useMemo(
    () => options,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.page, options.limit],
  );
  const queryKey = useMemo(
    () => ['tasks', teamId, stableOptions] as const,
    [teamId, stableOptions],
  );
  const queryClient = useQueryClient();

  const firestoreQuery = useMemo<Query<FirestoreTaskDoc> | null>(() => {
    if (!teamId) {
      return null;
    }

    return query(collection(db, teamId), orderBy('dueDate', 'asc')) as Query<FirestoreTaskDoc>;
  }, [teamId]);

  const transformSnapshot = useCallback(
    (
      snapshot: Parameters<
        Parameters<
          typeof useFirestoreSubscription<
            { tasks: TeamTask[]; meta: TaskListMeta },
            FirestoreTaskDoc
          >
        >[2]
      >[0],
    ) => {
      // We need to fetch members from react-query cache to map assignedUserId -> assignedUsers
      // Normally queryClient.getQueryData(['team', teamId, 'members']) would have the team members
      const membersCache = queryClient.getQueryData<{ uid: string; displayName: string }[]>([
        'team',
        teamId,
        'members',
      ]);
      const membersMap = new Map((membersCache || []).map((m) => [m.uid, m.displayName]));

      const tasks: TeamTask[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const mappedAssignedUsers: TeamTask['assignedUsers'] = [];

        if (data.assignedUserId) {
          mappedAssignedUsers.push({
            uid: data.assignedUserId,
            displayName: membersMap.get(data.assignedUserId) || null,
          });
        }

        // If there are groups, we should map them but currently group users are flat assignedUsers array in REST API.
        // Firestore only stores assignedGroup string. We don't have a reliable synchronous way to get group member names.
        // We will fallback to returning the mapped userId.

        return {
          id: doc.id,
          teamId,
          name: data.name || '',
          description: data.description || '',
          dueDate: toIsoString(data.dueDate),
          priority: data.priority || 'medium',
          status: data.status || 'todo',
          isRecurring: !!data.isRecurring,
          recurringInterval: data.recurringInterval || null,
          recurringCount: data.recurringCount || null,
          assignedGroupId: data.assignedGroup || null,
          updatedAt: toIsoString(data.updatedAt),
          categories: data.category || [],
          assignedUsers: mappedAssignedUsers,
        };
      });

      return {
        tasks,
        meta: {
          page: 1,
          limit: tasks.length,
          maxLimit: tasks.length,
          total: tasks.length,
          totalPages: tasks.length ? 1 : 0,
          hasNext: false,
          hasPrev: false,
          nextPage: null,
          prevPage: null,
        },
      };
    },
    [queryClient, teamId],
  );

  useFirestoreSubscription<{ tasks: TeamTask[]; meta: TaskListMeta }, FirestoreTaskDoc>(
    queryKey,
    firestoreQuery,
    transformSnapshot,
  );

  return useQuery<{ tasks: TeamTask[]; meta: TaskListMeta }>({
    queryKey,
    queryFn: () => Promise.resolve({ tasks: [], meta: EMPTY_META }), // Should not run unless enabled
    enabled: false,
    staleTime: Infinity,
  });
}
