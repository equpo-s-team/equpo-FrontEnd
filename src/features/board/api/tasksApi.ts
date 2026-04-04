import { request } from '@/lib/api/core.ts';
import type { CreateTaskPayload, GetTeamTasksOptions, TaskListMeta, TeamTask, UpdateTaskPayload } from '../types/taskSchema.ts';

export const tasksApi = {
  create: (teamId: string, payload: CreateTaskPayload) =>
    request<{ task: TeamTask }>(`/teams/${teamId}/tasks`, 'POST', payload),
  update: (teamId: string, taskId: string, payload: UpdateTaskPayload) =>
    request<{ task: TeamTask }>(`/teams/${teamId}/tasks/${taskId}`, 'PATCH', payload),
  list: (teamId: string, options: GetTeamTasksOptions = {}) => {
    const query = new URLSearchParams();
    if (options.page !== undefined) {
      query.set('page', String(options.page));
    }
    if (options.limit !== undefined) {
      query.set('limit', String(options.limit));
    }

    const queryString = query.toString();
    const path = queryString
      ? `/teams/${teamId}/tasks?${queryString}`
      : `/teams/${teamId}/tasks`;

    return request<{ tasks: TeamTask[]; meta: TaskListMeta }>(path, 'GET');
  },
  delete: (teamId: string, taskId: string) =>
    request<{ deletedTaskId: string }>(`/teams/${teamId}/tasks/${taskId}`, 'DELETE'),
  getMyValidIds: (teamId: string) =>
    request<{ taskIds: string[] }>(`/teams/${teamId}/tasks/my-valid-ids`, 'GET'),
};
