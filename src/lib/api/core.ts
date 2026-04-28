import { auth } from '@/firebase';

export const BASE_URL: string = (
  import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080/api/v1'
).replace(/\/$/, '');

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

  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = (payload as { error?: string }).error;
    throw new Error(errorMessage ?? `Request failed (${response.status})`);
  }

  return payload as T;
}
