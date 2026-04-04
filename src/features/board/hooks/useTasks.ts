import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasksApi';
import type { GetTeamTasksOptions } from '../types';

export function useTasks(teamId: string, options: GetTeamTasksOptions = {}) {
  return useQuery({
    queryKey: ['tasks', teamId, options],
    queryFn: () => tasksApi.list(teamId, options),
    enabled: !!teamId,
  });
}
