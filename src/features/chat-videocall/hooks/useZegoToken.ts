import { useMutation } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';

/**
 * Requests a ZEGO token from the backend.
 * The backend validates group membership before issuing the token
 * and auto-inserts a system message "📹 {user} inició una videollamada".
 */
export function useZegoToken() {
  return useMutation({
    mutationFn: ({ teamId, roomId }: { teamId: string; roomId: string }) =>
      chatApi.getZegoToken(teamId, roomId),
  });
}
