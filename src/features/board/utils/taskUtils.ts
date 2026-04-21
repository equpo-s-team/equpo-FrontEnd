import type { RecurringInterval, TaskStatus, TeamTask } from '../types';

export function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export function toInputDatetime(isoString: string | null | undefined): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  } catch {
    return '';
  }
}

export const STATUS_TO_PROGRESS: Record<TaskStatus, number> = {
  todo: 0,
  'in-progress': 40,
  'in-qa': 85,
  done: 100,
};

export const DESCRIPTION_MAX_LENGTH = 2000;

export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Alta', dot: 'bg-red' },
  { value: 'medium', label: 'Media', dot: 'bg-orange-dark' },
  { value: 'low', label: 'Baja', dot: 'bg-green' },
];

export const INTERVAL_OPTIONS = [
  { value: 'days', label: 'Días' },
  { value: 'weeks', label: 'Semanas' },
  { value: 'months', label: 'Meses' },
  { value: 'years', label: 'Años' },
];

export const READONLY_PRIORITY_STYLE: Record<string, { text: string; dot: string }> = {
  high: { text: 'text-red', dot: 'bg-red' },
  medium: { text: 'text-orange-dark', dot: 'bg-orange-dark' },
  low: { text: 'text-green', dot: 'bg-green' },
};

export function isTaskOverdue(task: { status: TaskStatus; dueDate?: string | null }): boolean {
  if (task.status === 'done') return false;
  if (!task.dueDate) return false;

  const now = new Date();
  const isDateOnly = !task.dueDate.includes('T') || task.dueDate.endsWith('T00:00:00.000Z');

  if (isDateOnly) {
    const datePart = task.dueDate.split('T')[0];
    const endOfDay = new Date(`${datePart}T23:59:59`);
    return endOfDay.getTime() < now.getTime();
  }

  const dueDateObj = new Date(task.dueDate);
  return dueDateObj.getTime() < now.getTime();
}

export function calculateNextRecurrenceDate(
  currentDateStr: string,
  interval: RecurringInterval,
  count: number,
): Date {
  const next = new Date(currentDateStr);
  switch (interval) {
    case 'days':
      next.setDate(next.getDate() + count);
      break;
    case 'weeks':
      next.setDate(next.getDate() + count * 7);
      break;
    case 'months':
      next.setMonth(next.getMonth() + count);
      break;
    case 'years':
      next.setFullYear(next.getFullYear() + count);
      break;
  }
  return next;
}

export type ProjectedTeamTask = TeamTask & {
  isProjected?: boolean;
  originalId?: string;
};

export function projectRecurringTasks(
  tasks: TeamTask[],
  maxDaysAhead: number = 365,
): ProjectedTeamTask[] {
  const result: ProjectedTeamTask[] = [];
  const now = new Date();
  const maxDate = new Date(now.getTime() + maxDaysAhead * 24 * 60 * 60 * 1000);

  for (const task of tasks) {
    result.push(task); // Always include the original task

    if (task.isRecurring && task.dueDate && task.recurringInterval && task.recurringCount) {
      let currentDueDate = new Date(task.dueDate);

      while (true) {
        currentDueDate = calculateNextRecurrenceDate(
          currentDueDate.toISOString(),
          task.recurringInterval,
          task.recurringCount,
        );

        if (currentDueDate.getTime() > maxDate.getTime()) {
          break;
        }

        // Limit to 50 projections per task to avoid runaway loops
        if (result.filter((t) => t.id.startsWith(task.id + '_proj_')).length >= 50) {
          break;
        }

        result.push({
          ...task,
          id: `${task.id}_proj_${currentDueDate.getTime()}`,
          originalId: task.id,
          dueDate: currentDueDate.toISOString(),
          isProjected: true,
          // A projected task is technically not "overdue" in the future,
          // but its status is cloned. If the original is done, the projected shouldn't be 'done'.
          // However, our backend lazily updates, so the base task might be overdue or 'todo'.
          // We'll leave status as is, but it's visual.
        });
      }
    }
  }

  return result;
}
