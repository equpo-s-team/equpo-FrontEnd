import { useQuery } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

export function useTaskSteps(teamId: string, taskId: string) {
  return useQuery<{ steps: TaskStep[] }>({
    queryKey: ['task', teamId, taskId, 'steps'],
    queryFn: () => tasksApi.listSteps(teamId, taskId),
    enabled: Boolean(teamId && taskId),
    staleTime: 30_000,
  });
}
