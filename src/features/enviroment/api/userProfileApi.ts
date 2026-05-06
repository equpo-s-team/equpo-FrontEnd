import { request } from '@/lib/api/core';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  virtualCurrency: number;
  level: number;
  experiencePoints: number;
}

export const userProfileApi = {
  getMyProfile(): Promise<UserProfile> {
    return request<UserProfile>('/users/me/profile', 'GET');
  },
};
