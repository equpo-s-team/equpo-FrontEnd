import { useQuery } from '@tanstack/react-query';

import { request } from '@/lib/api/core';

export interface UserPreviewResponse {
  uid: string;
  displayName: string;
  photoUrl?: string;
  exists: boolean;
}

export const useUserPreview = (uid?: string) => {
  return useQuery({
    queryKey: ['userPreview', uid],
    queryFn: async (): Promise<UserPreviewResponse> => {
      if (!uid) {
        throw new Error('UID is required');
      }

      // Validate UID format (Firebase UIDs are typically 28 characters)
      if (uid.length < 20) {
        throw new Error('Invalid UID format');
      }

      try {
        // Try without encoding first, as the backend might expect raw UIDs
        const response = await request<UserPreviewResponse>(`/users/preview?uid=${uid}`, 'GET');
        return response;
      } catch (error) {
        console.error('User preview request failed:', error);
        // If it's a 400 error, return a mock response for better UX
        if (error instanceof Error && error.message.includes('Invalid query parameters')) {
          return {
            uid,
            displayName: uid,
            exists: false,
          };
        }
        throw error;
      }
    },
    enabled: !!uid && uid.length >= 20, // Only enable if UID looks valid
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 400 errors (bad request) or invalid format
      if (
        error instanceof Error &&
        (error.message.includes('400') || error.message.includes('Invalid'))
      ) {
        return false;
      }
      return failureCount < 1; // Only retry once for other errors
    },
  });
};
