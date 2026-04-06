import { request } from '@/lib/api/core.ts';

import type {
  GetReportsKpiOptions,
  GetReportsOverviewOptions,
  ReportsKpiResponse,
  ReportsOverviewResponse,
} from '../types/reportsSchema.ts';
import type {
  GetTeamTasksOptions,
  TaskListMeta,
  TeamTask,
} from '../types/taskSchema.ts';

function buildQueryParams(params: Record<string, number | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  }

  return query.toString();
}

export const reportsApi = {
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
  getKpi: (teamId: string, options: GetReportsKpiOptions = {}) => {
    const queryString = buildQueryParams({ days: options.days });
    const path = queryString
      ? `/teams/${teamId}/reports/kpi?${queryString}`
      : `/teams/${teamId}/reports/kpi`;

    return request<ReportsKpiResponse>(path, 'GET');
  },
  getOverview: (teamId: string, options: GetReportsOverviewOptions = {}) => {
    const queryString = buildQueryParams({
      days: options.days,
      overdueLimit: options.overdueLimit,
    });
    const path = queryString
      ? `/teams/${teamId}/reports/overview?${queryString}`
      : `/teams/${teamId}/reports/overview`;

    return request<ReportsOverviewResponse>(path, 'GET');
  },
  getMyValidIds: (teamId: string) =>
    request<{ taskIds: string[] }>(`/teams/${teamId}/tasks/my-valid-ids`, 'GET'),
};
