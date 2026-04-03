import { auth } from '@/firebase';

export const BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function authHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user');
  }

  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
  const headers = await authHeaders();
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }

  return payload as T;
}
