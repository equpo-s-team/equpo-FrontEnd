import type {
  TeamMember,
  OverdueTask,
  WeeklyVelocity,
  VelocityStats,
  DatePreset,
  KpiData,
} from '../types'

export const KPI_BY_DAYS: Record<number, KpiData> = {
  7:   { todo: 8,  progress: 6,  qa: 3,  done: 12,  overdue: 2  },
  30:  { todo: 24, progress: 18, qa: 9,  done: 61,  overdue: 7  },
  90:  { todo: 40, progress: 28, qa: 14, done: 180, overdue: 11 },
  180: { todo: 55, progress: 35, qa: 20, done: 340, overdue: 14 },
  365: { todo: 70, progress: 42, qa: 25, done: 680, overdue: 18 },
}

export function getKpiForDays(days: number): KpiData {
  if (days <= 7)   return KPI_BY_DAYS[7]
  if (days <= 30)  return KPI_BY_DAYS[30]
  if (days <= 90)  return KPI_BY_DAYS[90]
  if (days <= 180) return KPI_BY_DAYS[180]
  return KPI_BY_DAYS[365]
}

export const DATE_PRESETS: DatePreset[] = [
  { label: 'Esta semana',  days: 7   },
  { label: 'Últ. 30 días', days: 30  },
  { label: 'Trimestre',    days: 90  },
  { label: 'Semestre',     days: 180 },
  { label: 'Este año',     days: 365 },
  { label: 'Personalizado', days: 0  },
]

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'at',
    initials: 'AT',
    name: 'Andrea Torres',
    role: 'Frontend Dev',
    completed: 24,
    total: 29,
    avatarClass: 'av-at',
    barGradient: 'linear-gradient(90deg,#60AFFF,#5961F9)',
    barGlow: '0 0 8px rgba(96,175,255,0.5)',
    pctColor: '#5961F9',
  },
  {
    id: 'jr',
    initials: 'JR',
    name: 'Jorge Ramírez',
    role: 'Backend Dev',
    completed: 18,
    total: 22,
    avatarClass: 'av-jr',
    barGradient: 'linear-gradient(90deg,#9CEDC1,#86F0FD)',
    barGlow: '0 0 8px rgba(156,237,193,0.5)',
    pctColor: '#2e9660',
  },
  {
    id: 'ml',
    initials: 'ML',
    name: 'María López',
    role: 'UX / Design',
    completed: 21,
    total: 23,
    avatarClass: 'av-ml',
    barGradient: 'linear-gradient(90deg,#F65A70,#FF94AE)',
    barGlow: '0 0 8px rgba(246,90,112,0.45)',
    pctColor: '#c94155',
  },
  {
    id: 'cs',
    initials: 'CS',
    name: 'Carlos Soto',
    role: 'QA Engineer',
    completed: 25,
    total: 27,
    avatarClass: 'av-cs',
    barGradient: 'linear-gradient(90deg,#FF94AE,#FCE98D)',
    barGlow: '0 0 8px rgba(255,148,174,0.45)',
    pctColor: '#b85570',
  },
  {
    id: 'lv',
    initials: 'LV',
    name: 'Laura Vargas',
    role: 'DevOps',
    completed: 16,
    total: 20,
    avatarClass: 'av-lv',
    barGradient: 'linear-gradient(90deg,#9b7fe1,#5961F9)',
    barGlow: '0 0 8px rgba(155,127,225,0.5)',
    pctColor: '#7065d4',
  },
  {
    id: 'dm',
    initials: 'DM',
    name: 'Diego Morales',
    role: 'Full Stack',
    completed: 11,
    total: 15,
    avatarClass: 'av-dm',
    barGradient: 'linear-gradient(90deg,#86F0FD,#60AFFF)',
    barGlow: '0 0 8px rgba(134,240,253,0.45)',
    pctColor: '#4896e0',
  },
  {
    id: 'rp',
    initials: 'RP',
    name: 'Renata Paredes',
    role: 'Product Manager',
    completed: 19,
    total: 22,
    avatarClass: 'av-rp',
    barGradient: 'linear-gradient(90deg,#F65A70,#9b7fe1)',
    barGlow: '0 0 8px rgba(155,127,225,0.45)',
    pctColor: '#9b7fe1',
  },
  {
    id: 'kn',
    initials: 'KN',
    name: 'Kevin Núñez',
    role: 'Mobile Dev',
    completed: 13,
    total: 17,
    avatarClass: 'av-kn',
    barGradient: 'linear-gradient(90deg,#9CEDC1,#5961F9)',
    barGlow: '0 0 8px rgba(89,97,249,0.4)',
    pctColor: '#5961F9',
  },
  {
    id: 'so',
    initials: 'SO',
    name: 'Sofía Ortega',
    role: 'Data Analyst',
    completed: 8,
    total: 12,
    avatarClass: 'av-so',
    barGradient: 'linear-gradient(90deg,#FCE98D,#FF94AE)',
    barGlow: '0 0 8px rgba(252,233,141,0.5)',
    pctColor: '#c9a020',
  },
]

export const OVERDUE_TASKS: OverdueTask[] = [
  { id: '1', task: 'Migración DB producción',    assignee: 'Jorge R.',  daysOverdue: 14, priority: 'Alta'  },
  { id: '2', task: 'Pruebas de regresión v2.4',  assignee: 'Carlos S.', daysOverdue: 9,  priority: 'Alta'  },
  { id: '3', task: 'Rediseño onboarding',         assignee: 'María L.',  daysOverdue: 7,  priority: 'Media' },
  { id: '4', task: 'CI/CD pipeline staging',      assignee: 'Laura V.',  daysOverdue: 5,  priority: 'Media' },
  { id: '5', task: 'Documentación API pública',   assignee: 'Diego M.',  daysOverdue: 3,  priority: 'Baja'  },
  { id: '6', task: 'Fix notificaciones push iOS', assignee: 'Andrea T.', daysOverdue: 2,  priority: 'Media' },
  { id: '7', task: 'Analytics dashboard v1',      assignee: 'Andrea T.', daysOverdue: 1,  priority: 'Baja'  },
]

export const WEEKLY_VELOCITY: WeeklyVelocity[] = [
  { label: 'S-8', value: 5  },
  { label: 'S-7', value: 7  },
  { label: 'S-6', value: 9  },
  { label: 'S-5', value: 6  },
  { label: 'S-4', value: 12 },
  { label: 'S-3', value: 8  },
  { label: 'S-2', value: 14 },
  { label: 'S-1', value: 10 },
]

export const VELOCITY_STATS: VelocityStats = {
  average: 8.7,
  best: 14,
  growthPct: 18,
}
