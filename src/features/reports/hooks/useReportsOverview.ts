import { useQuery } from '@tanstack/react-query';

import { reportsApi } from '../api/reportsApi.ts';
import {
  type GetReportsOverviewOptions,
  type ReportsOverviewResponse,
  ReportsOverviewResponseSchema,
} from '../types/reportsSchema.ts';

export function useReportsOverview(
  teamId: string | undefined,
  options: GetReportsOverviewOptions = {},
) {
  return useQuery<ReportsOverviewResponse>({
    queryKey: ['reports', teamId, 'overview', options],
    queryFn: async () => {
      if (!teamId) {
        throw new Error('teamId is required to fetch reports overview');
      }

      const response = await reportsApi.getOverview(teamId, options);
      return ReportsOverviewResponseSchema.parse(response);
    },
    enabled: !!teamId,
  });
}
