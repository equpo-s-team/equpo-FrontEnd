import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useMemo } from 'react';

import { useAuth } from '@/context/AuthContext';
import { tasksApi } from '@/features/board/api/tasksApi';
import { useTasks } from '@/features/board/hooks/useTasks';
import { useValidTaskIds } from '@/features/board/hooks/useValidTaskIds';
import type { TeamTask } from '@/features/board/types';
import { db } from '@/firebase';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

const REST_TASKS_PAGE_LIMIT = 200;

async function fetchAssignmentsByTaskId(
  teamId: string,
): Promise<Map<string, TeamTask['assignedUsers']>> {
  const map = new Map<string, TeamTask['assignedUsers']>();
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await tasksApi.list(teamId, {
      page,
      limit: REST_TASKS_PAGE_LIMIT,
    });

    response.tasks.forEach((task) => {
      map.set(task.id, task.assignedUsers ?? []);
    });

    hasNext = response.meta.hasNext;
    page += 1;
  }

  return map;
}

/**
 * Returns the current user's personal tasks derived from the team task cache.
 *
 * Uses the `my-valid-ids` backend endpoint which resolves direct user assignment
 * AND group-membership assignment in a single query, so no extra group-fetching
 * logic is needed on the frontend.
 *
 * Also sets up a Firestore snapshot listener that invalidates the valid-ids
 * cache whenever any task in the team collection changes, ensuring real-time
 * reactivity even when the user is not on the Team Missions screen.
 */
export function useMyTasks(teamId: string | undefined) {
  const { user } = (useAuth as () => { user: AuthUser | null })();
  const queryClient = useQueryClient();

  // Full team task list (already Firestore-backed via useTasks)
  const { data: taskData, isLoading: tasksLoading } = useTasks(teamId ?? '');

  // Backend-derived IDs of tasks assigned to current user (direct + group)
  const { data: validIdsData, isLoading: idsLoading } = useValidTaskIds(teamId ?? '');
  const assignmentsQuery = useQuery({
    queryKey: ['tasks', teamId, 'assignments'],
    queryFn: () => fetchAssignmentsByTaskId(teamId ?? ''),
    enabled: !!teamId,
    staleTime: 60_000,
  });

  // ── Real-time sync: listen for Firestore changes and invalidate valid-ids ──
  useEffect(() => {
    if (!teamId) return;

    const firestoreQuery = query(collection(db, teamId));
    let isInitial = true;

    const unsubscribe = onSnapshot(
      firestoreQuery,
      () => {
        if (isInitial) {
          isInitial = false;
          return;
        }

        // Invalidate valid-ids so the filter set stays fresh
        void queryClient.invalidateQueries({
          queryKey: ['tasks', teamId, 'valid-ids'],
        });
      },
      (error) => {
        console.error(`My missions sync error [teamId: ${teamId}]:`, error);
      },
    );

    return () => unsubscribe();
  }, [teamId, queryClient]);

  const validIdSet = useMemo(() => new Set(validIdsData?.taskIds ?? []), [validIdsData]);

  // Filter full task list to only user's tasks
  const myTasks = useMemo(() => {
    if (!taskData?.tasks?.length || validIdSet.size === 0) return [];
    return taskData.tasks
      .filter((t) => validIdSet.has(t.id))
      .map((task) => ({
        ...task,
        assignedUsers: assignmentsQuery.data?.get(task.id) ?? task.assignedUsers,
      }));
  }, [assignmentsQuery.data, taskData, validIdSet]);

  // Group by date (YYYY-MM-DD) for calendar dot indicators
  const tasksByDate = useMemo(() => {
    const map = new Map<string, TeamTask[]>();
    for (const task of myTasks) {
      if (!task.dueDate) continue;
      const dateKey = task.dueDate.slice(0, 10); // YYYY-MM-DD
      const existing = map.get(dateKey) ?? [];
      existing.push(task);
      map.set(dateKey, existing);
    }
    return map;
  }, [myTasks]);

  // All unique categories across my tasks
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const task of myTasks) {
      for (const cat of task.categories ?? []) set.add(cat);
    }
    return [...set].sort();
  }, [myTasks]);

  const getTasksForDate = useCallback(
    (dateKey: string) => tasksByDate.get(dateKey) ?? [],
    [tasksByDate],
  );

  return {
    myTasks,
    tasksByDate,
    allCategories,
    getTasksForDate,
    isLoading: tasksLoading || idsLoading || assignmentsQuery.isPending,
    userUid: user?.uid ?? null,
  };
}
