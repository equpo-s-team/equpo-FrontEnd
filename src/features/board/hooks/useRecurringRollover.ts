import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

import { tasksApi } from '../api/tasksApi';
import type { TeamTask } from '../types/taskSchema';
import { needsRollover } from '../utils/recurringRollover';

/**
 * Returns a `rollover(task)` function that fires a single idempotent POST
 * /teams/:teamId/tasks/:taskId/rollover when the task's due date has passed.
 * In-flight de-duplication prevents concurrent triggers from causing double rolls.
 */
export function useRecurringRollover() {
  const inFlightRef = useRef<Set<string>>(new Set());

  const mutation = useMutation({
    mutationFn: ({
      teamId,
      taskId,
      dueDate,
    }: {
      teamId: string;
      taskId: string;
      dueDate: string;
    }) => tasksApi.rollover(teamId, taskId, dueDate),
    onSettled: (_data, _err, variables) => {
      inFlightRef.current.delete(variables.taskId);
    },
  });

  function rollover(task: TeamTask) {
    if (!needsRollover(task)) return;
    if (inFlightRef.current.has(task.id)) return;
    inFlightRef.current.add(task.id);
    mutation.mutate({ teamId: task.teamId, taskId: task.id, dueDate: task.dueDate });
  }

  return { rollover };
}
