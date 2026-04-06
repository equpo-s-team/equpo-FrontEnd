import { useQuery } from '@tanstack/react-query';

import { reportsApi } from '../api/reportsApi.ts';
import {
  type GetReportsKpiOptions,
  ReportsKpiResponseSchema,
  type ReportsKpiResponse,
} from '../types/reportsSchema.ts';

export function useReportsKpi(
  teamId: string | undefined,
  options: GetReportsKpiOptions = {}
) {
  return useQuery<ReportsKpiResponse>({
    queryKey: ['reports', teamId, 'kpi', options],
    queryFn: async () => {
      if (!teamId) {
        throw new Error('teamId is required to fetch reports KPI');
      }

      const response = await reportsApi.getKpi(teamId, options);
      return ReportsKpiResponseSchema.parse(response);
    },
    enabled: !!teamId,
  });
}

