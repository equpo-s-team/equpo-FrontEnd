import { request } from '@/lib/api/core';

export type UpdateMePayload = {
  displayName?: string;
  photoURL?: string | null;
};

export type UpdateMeResponse = {
  user: {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    updatedAt: string;
  };
};

export const usersApi = {
  updateMe: (payload: UpdateMePayload) => request<UpdateMeResponse>('/users/me', 'PATCH', payload),
};
