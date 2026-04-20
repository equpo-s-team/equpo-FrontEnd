export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DatePreset {
  label: string;
  days: number;
}

export interface KpiData {
  todo: number;
  progress: number;
  qa: number;
  done: number;
  overdue: number;
  total: number;
}

export interface ReportMemberRow {
  id: string;
  initials: string;
  name: string;
  photoUrl?: string | null;
  role: string;
  completed: number;
  total: number;
  avatarClass: string;
  barGradient: string;
  barGlow: string;
  pctColor: string;
}

export type Priority = 'Alta' | 'Media' | 'Baja';

export interface OverdueTaskRow {
  id: string;
  task: string;
  assignee: string;
  daysOverdue: number;
  priority: Priority;
}
