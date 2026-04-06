import { z } from 'zod';

import { TaskPrioritySchema, TaskStatusSchema } from './taskSchema.ts';

export const ReportsKpiSchema = z.object({
  todo: z.number(),
  progress: z.number(),
  qa: z.number(),
  done: z.number(),
  overdue: z.number(),
  total: z.number(),
});

export const ReportsMetaBaseSchema = z.object({
  teamId: z.string(),
  days: z.number(),
  rangeStart: z.string(),
  rangeEnd: z.string(),
  generatedAt: z.string(),
  actorRole: z.string().nullable(),
});

export const ReportsAssignedUserSchema = z.object({
  uid: z.string(),
  displayName: z.string().nullable(),
});

export const ReportsMemberSchema = z.object({
  uid: z.string(),
  displayName: z.string().nullable(),
  role: z.string(),
  completed: z.number(),
  total: z.number(),
  completionRate: z.number(),
});

export const ReportsOverdueTaskSchema = z.object({
  taskId: z.string(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  priorityLabel: z.enum(['Alta', 'Media', 'Baja']),
  dueDate: z.string(),
  daysOverdue: z.number(),
  categories: z.array(z.string()),
  assignedUsers: z.array(ReportsAssignedUserSchema),
  assignee: z.string(),
});

export const ReportsKpiResponseSchema = z.object({
  kpi: ReportsKpiSchema,
  meta: ReportsMetaBaseSchema,
});

export const ReportsOverviewResponseSchema = z.object({
  kpi: ReportsKpiSchema,
  members: z.array(ReportsMemberSchema),
  overdueTasks: z.array(ReportsOverdueTaskSchema),
  meta: ReportsMetaBaseSchema.extend({
    overdueLimit: z.number(),
  }),
});

export const GetReportsKpiOptionsSchema = z.object({
  days: z.number().optional(),
});

export const GetReportsOverviewOptionsSchema = z.object({
  days: z.number().optional(),
  overdueLimit: z.number().optional(),
});

export type ReportsKpi = z.infer<typeof ReportsKpiSchema>;
export type ReportsMetaBase = z.infer<typeof ReportsMetaBaseSchema>;
export type ReportsAssignedUser = z.infer<typeof ReportsAssignedUserSchema>;
export type ReportsMember = z.infer<typeof ReportsMemberSchema>;
export type ReportsOverdueTask = z.infer<typeof ReportsOverdueTaskSchema>;
export type ReportsKpiResponse = z.infer<typeof ReportsKpiResponseSchema>;
export type ReportsOverviewResponse = z.infer<typeof ReportsOverviewResponseSchema>;
export type GetReportsKpiOptions = z.infer<typeof GetReportsKpiOptionsSchema>;
export type GetReportsOverviewOptions = z.infer<typeof GetReportsOverviewOptionsSchema>;
