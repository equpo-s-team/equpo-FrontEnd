import { useQuery } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskCommentary } from '../types/taskSchema';

export function useTaskCommentaries(teamId: string, taskId: string) {
  return useQuery<{ commentaries: TaskCommentary[] }>({
    queryKey: ['task', teamId, taskId, 'commentaries'],
    queryFn: () => tasksApi.listCommentaries(teamId, taskId),
    enabled: Boolean(teamId && taskId),
    staleTime: 30_000,
  });
}
