import { request } from '@/lib/api/core.ts';

import type {
  CreateTaskPayload,
  GetTeamTasksOptions,
  TaskCommentary,
  TaskListMeta,
  TaskStep,
  TeamTask,
  UpdateTaskPayload,
} from '../types/taskSchema.ts';

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
    const path = queryString ? `/teams/${teamId}/tasks?${queryString}` : `/teams/${teamId}/tasks`;

    return request<{ tasks: TeamTask[]; meta: TaskListMeta }>(path, 'GET');
  },
  delete: (teamId: string, taskId: string) =>
    request<{ deletedTaskId: string }>(`/teams/${teamId}/tasks/${taskId}`, 'DELETE'),
  getMyValidIds: (teamId: string) =>
    request<{ taskIds: string[] }>(`/teams/${teamId}/tasks/my-valid-ids`, 'GET'),

  // Steps
  listSteps: (teamId: string, taskId: string) =>
    request<{ steps: TaskStep[] }>(`/teams/${teamId}/tasks/${taskId}/steps`, 'GET'),
  createStep: (teamId: string, taskId: string, payload: { step: string }) =>
    request<{ step: TaskStep }>(`/teams/${teamId}/tasks/${taskId}/steps`, 'POST', payload),
  toggleStep: (teamId: string, taskId: string, stepId: string, payload: { isDone: boolean }) =>
    request<{ step: TaskStep; newStatus: string }>(
      `/teams/${teamId}/tasks/${taskId}/steps/${encodeURIComponent(stepId)}/toggle`,
      'PATCH',
      payload,
    ),
  updateStep: (teamId: string, taskId: string, stepId: string, payload: { step: string }) =>
    request<{ step: TaskStep }>(
      `/teams/${teamId}/tasks/${taskId}/steps/${encodeURIComponent(stepId)}`,
      'PATCH',
      payload,
    ),
  deleteStep: (teamId: string, taskId: string, stepId: string) =>
    request<{ deletedStepId: string }>(
      `/teams/${teamId}/tasks/${taskId}/steps/${encodeURIComponent(stepId)}`,
      'DELETE',
    ),

  // Recurring rollover
  rollover: (teamId: string, taskId: string, expectedDueDate: string) =>
    request<{ rolledOver: boolean }>(`/teams/${teamId}/tasks/${taskId}/rollover`, 'POST', {
      expectedDueDate,
    }),

  // Commentaries
  listCommentaries: (teamId: string, taskId: string) =>
    request<{ commentaries: TaskCommentary[] }>(
      `/teams/${teamId}/tasks/${taskId}/commentaries`,
      'GET',
    ),
  createCommentary: (teamId: string, taskId: string, payload: { commentary: string }) =>
    request<{ commentary: TaskCommentary }>(
      `/teams/${teamId}/tasks/${taskId}/commentaries`,
      'POST',
      payload,
    ),
  updateCommentary: (
    teamId: string,
    taskId: string,
    commentaryId: string,
    payload: { commentary: string },
  ) =>
    request<{ commentary: TaskCommentary }>(
      `/teams/${teamId}/tasks/${taskId}/commentaries/${encodeURIComponent(commentaryId)}`,
      'PATCH',
      payload,
    ),
  deleteCommentary: (teamId: string, taskId: string, commentaryId: string) =>
    request<{ deletedCommentaryId: string }>(
      `/teams/${teamId}/tasks/${taskId}/commentaries/${encodeURIComponent(commentaryId)}`,
      'DELETE',
    ),
};
