import { useQuery } from '@tanstack/react-query';

import { request } from '@/lib/api/core';

interface InvitePreviewResponse {
  team: {
    id: string;
    name: string;
    photoUrl?: string | null;
    description?: string | null;
  };
  role: 'collaborator' | 'spectator' | 'member';
  expiresAt: string;
  maxUses: number;
  currentUses: number;
  usesLeft: number;
  isValid: boolean;
}

async function fetchInvitePreview(code: string): Promise<InvitePreviewResponse> {
  return request<InvitePreviewResponse>(
    `/teams/invite-preview?code=${encodeURIComponent(code.toUpperCase())}`,
    'GET'
  );
}

export function useInvitePreview(code: string | null | undefined) {
  return useQuery({
    queryKey: ['invite-preview', code],
    queryFn: () => fetchInvitePreview(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
}
