import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasksApi';

export function useValidTaskIds(teamId: string) {
  return useQuery({
    queryKey: ['tasks', teamId, 'valid-ids'],
    queryFn: () => tasksApi.getMyValidIds(teamId),
    enabled: !!teamId,
  });
}
