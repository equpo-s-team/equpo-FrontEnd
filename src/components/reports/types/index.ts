export type Priority = 'Alta' | 'Media' | 'Baja'

export interface KpiData {
  todo: number
  progress: number
  qa: number
  done: number
  overdue: number
}

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DatePreset {
  label: string
  days: number // 0 = custom
}

export interface TeamMember {
  id: string
  initials: string
  name: string
  role: string
  completed: number
  total: number
  avatarClass: string
  barGradient: string
  barGlow: string
  pctColor: string
}

export interface OverdueTask {
  id: string
  task: string
  assignee: string
  daysOverdue: number
  priority: Priority
}

export interface WeeklyVelocity {
  label: string
  value: number
}

export interface VelocityStats {
  average: number
  best: number
  growthPct: number
}
