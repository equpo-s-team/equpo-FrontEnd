import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { tasksApi } from '../../board/api/tasksApi.ts';
import {
  TaskListMetaSchema,
  TeamTaskSchema,
  type GetTeamTasksOptions,
  type TaskListMeta,
  type TeamTask,
} from '../../board/types';

const TaskListResponseSchema = z.object({
  tasks: z.array(TeamTaskSchema),
  meta: TaskListMetaSchema,
});

type TaskListResponse = {
  tasks: TeamTask[];
  meta: TaskListMeta;
};

export function useTasksApi(teamId: string | undefined, options: GetTeamTasksOptions = {}) {
  return useQuery<TaskListResponse>({
    queryKey: ['tasks', teamId, 'api', options],
    queryFn: async () => {
      if (!teamId) {
        throw new Error('teamId is required to list tasks');
      }

      const response = await tasksApi.list(teamId, options);
      return TaskListResponseSchema.parse(response);
    },
    enabled: !!teamId,
  });
}

