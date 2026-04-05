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
