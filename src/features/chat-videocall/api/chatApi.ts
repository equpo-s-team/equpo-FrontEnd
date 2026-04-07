import { request } from '@/lib/api/core.ts';

import type { ZegoTokenResponse } from '../types/chat';

export const chatApi = {
  getZegoToken: (teamId: string, roomId: string) =>
    request<ZegoTokenResponse>(`/teams/${teamId}/rooms/${roomId}/zego-token`, 'POST'),
};
