import type { TeamTask } from '../types/taskSchema';

export function needsRollover(task: TeamTask): boolean {
  return (
    task.isRecurring &&
    Boolean(task.dueDate) &&
    Boolean(task.recurringInterval) &&
    Boolean(task.recurringCount) &&
    new Date(task.dueDate).getTime() <= Date.now()
  );
}
