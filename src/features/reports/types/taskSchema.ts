import { z } from 'zod';

export const TaskPrioritySchema = z.enum(['high', 'medium', 'low']);
export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'in-qa', 'done']);
export const RecurringIntervalSchema = z.enum(['days', 'weeks', 'months', 'years']);

export const AssignedUserSchema = z.object({
  uid: z.string(),
  displayName: z.string().nullable(),
});

export const TeamTaskSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  name: z.string(),
  description: z.string(),
  dueDate: z.string(),
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  isRecurring: z.boolean(),
  recurringInterval: RecurringIntervalSchema.nullable(),
  recurringCount: z.number().nullable(),
  assignedGroupId: z.string().nullable(),
  updatedAt: z.string(),
  categories: z.array(z.string()),
  assignedUsers: z.array(AssignedUserSchema),
});

export const TaskListMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  maxLimit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
  nextPage: z.number().nullable(),
  prevPage: z.number().nullable(),
});

export const GetTeamTasksOptionsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type RecurringInterval = z.infer<typeof RecurringIntervalSchema>;
export type TeamTask = z.infer<typeof TeamTaskSchema>;
export type TaskListMeta = z.infer<typeof TaskListMetaSchema>;
export type GetTeamTasksOptions = z.infer<typeof GetTeamTasksOptionsSchema>;
