import { auth } from '@/firebase';

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function authHeaders(): Promise<Record<string, string>> {
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

async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
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

export interface CreateTeamPayload {
  name: string;
  virtualCurrency: number;
  description?: string | null;
}

export interface UpdateTeamPayload {
  name?: string;
  virtualCurrency?: number;
  description?: string | null;
}

export interface AddTeamMemberPayload {
  userUid: string;
  role?: 'collaborator' | 'spectator' | 'member';
}

export interface UpdateTeamMemberRolePayload {
  role: 'collaborator' | 'spectator' | 'member';
}

export interface CreateTeamRewardPayload {
  rewardId: string;
  dateObtained?: string;
}

export interface CreateAchievementPayload {
  userUid: string;
  name: string;
  description?: string | null;
  iconURL?: string | null;
  unlockedAt?: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'in-qa' | 'done';
export type RecurringInterval = 'days' | 'weeks' | 'months';

export interface CreateTaskPayload {
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  categories?: string[];
  isRecurring?: boolean;
  recurringInterval?: RecurringInterval;
  assignedUserUid?: string | null;
  assignedGroupId?: string | null;
}

export interface UpdateTaskPayload {
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  categories?: string[];
  isRecurring?: boolean;
  recurringInterval?: RecurringInterval | null;
  assignedUserUid?: string | null;
  assignedGroupId?: string | null;
}

export interface TeamTask {
  id: string;
  teamId: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  isRecurring: boolean;
  recurringInterval: RecurringInterval | null;
  assignedGroupId: string | null;
  updatedAt: string;
  categories: string[];
  assignedUsers: Array<{
    uid: string;
    displayName: string | null;
  }>;
}

export interface TaskListMeta {
  page: number;
  limit: number;
  maxLimit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface GetTeamTasksOptions {
  page?: number;
  limit?: number;
}

export const backendApi = {
  createTeam: (payload: CreateTeamPayload) => request('/teams', 'POST', payload),
  updateTeam: (teamId: string, payload: UpdateTeamPayload) => request(`/teams/${teamId}`, 'PATCH', payload),
  addTeamMember: (teamId: string, payload: AddTeamMemberPayload) => request(`/teams/${teamId}/members`, 'POST', payload),
  updateTeamMemberRole: (teamId: string, userUid: string, payload: UpdateTeamMemberRolePayload) =>
    request(`/teams/${teamId}/members/${userUid}/role`, 'PATCH', payload),
  createTeamReward: (teamId: string, payload: CreateTeamRewardPayload) => request(`/teams/${teamId}/rewards`, 'POST', payload),
  createAchievement: (teamId: string, payload: CreateAchievementPayload) => request(`/teams/${teamId}/achievements`, 'POST', payload),
  createTask: (teamId: string, payload: CreateTaskPayload) =>
    request<{ task: TeamTask }>(`/teams/${teamId}/tasks`, 'POST', payload),
  updateTask: (teamId: string, taskId: string, payload: UpdateTaskPayload) =>
    request<{ task: TeamTask }>(`/teams/${teamId}/tasks/${taskId}`, 'PATCH', payload),
  getTeamTasks: (teamId: string, options: GetTeamTasksOptions = {}) => {
    const query = new URLSearchParams();
    if (options.page !== undefined) {
      query.set('page', String(options.page));
    }
    if (options.limit !== undefined) {
      query.set('limit', String(options.limit));
    }

    const queryString = query.toString();
    const path = queryString
      ? `/teams/${teamId}/tasks?${queryString}`
      : `/teams/${teamId}/tasks`;

    return request<{ tasks: TeamTask[]; meta: TaskListMeta }>(path, 'GET');
  },
  deleteTask: (teamId: string, taskId: string) =>
    request<{ deletedTaskId: string }>(`/teams/${teamId}/tasks/${taskId}`, 'DELETE'),
  getMyValidTaskIds: (teamId: string) =>
    request<{ taskIds: string[] }>(`/teams/${teamId}/tasks/my-valid-ids`, 'GET'),
};
