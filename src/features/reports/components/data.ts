import { type KpiMetrics, type Member, type OverdueTask, type VelocityData } from './types.ts';

export const members: Member[] = [
  {
    id: 'AT',
    initials: 'AT',
    name: 'Andrea Torres',
    role: 'Frontend Dev',
    completed: 24,
    total: 29,
    gradient: 'linear-gradient(90deg,#60AFFF,#5961F9)',
    color: '#5961F9',
  },
  {
    id: 'JR',
    initials: 'JR',
    name: 'Jorge Ramírez',
    role: 'Backend Dev',
    completed: 18,
    total: 22,
    gradient: 'linear-gradient(90deg,#9CEDC1,#86F0FD)',
    color: '#2e9660',
  },
  {
    id: 'ML',
    initials: 'ML',
    name: 'María López',
    role: 'UX / Design',
    completed: 21,
    total: 23,
    gradient: 'linear-gradient(90deg,#F65A70,#FF94AE)',
    color: '#c94155',
  },
  {
    id: 'CS',
    initials: 'CS',
    name: 'Carlos Soto',
    role: 'QA Engineer',
    completed: 25,
    total: 27,
    gradient: 'linear-gradient(90deg,#FF94AE,#FCE98D)',
    color: '#b85570',
  },
  {
    id: 'LV',
    initials: 'LV',
    name: 'Laura Vargas',
    role: 'DevOps',
    completed: 16,
    total: 20,
    gradient: 'linear-gradient(90deg,#9b7fe1,#5961F9)',
    color: '#7065d4',
  },
  {
    id: 'DM',
    initials: 'DM',
    name: 'Diego Morales',
    role: 'Full Stack',
    completed: 11,
    total: 15,
    gradient: 'linear-gradient(90deg,#86F0FD,#60AFFF)',
    color: '#4896e0',
  },
  {
    id: 'RP',
    initials: 'RP',
    name: 'Renata Paredes',
    role: 'Product Manager',
    completed: 19,
    total: 22,
    gradient: 'linear-gradient(90deg,#F65A70,#9b7fe1)',
    color: '#9b7fe1',
  },
  {
    id: 'KN',
    initials: 'KN',
    name: 'Kevin Núñez',
    role: 'Mobile Dev',
    completed: 13,
    total: 17,
    gradient: 'linear-gradient(90deg,#9CEDC1,#5961F9)',
    color: '#5961F9',
  },
  {
    id: 'SO',
    initials: 'SO',
    name: 'Sofía Ortega',
    role: 'Data Analyst',
    completed: 8,
    total: 12,
    gradient: 'linear-gradient(90deg,#FCE98D,#FF94AE)',
    color: '#c9a020',
  },
];

export const overdueTasks: OverdueTask[] = [
  {
    id: '1',
    title: 'Migración DB producción',
    owner: 'Jorge R.',
    daysOverdue: 14,
    priority: 'Alta',
  },
  {
    id: '2',
    title: 'Pruebas de regresión v2.4',
    owner: 'Carlos S.',
    daysOverdue: 9,
    priority: 'Alta',
  },
  {
    id: '3',
    title: 'Rediseño onboarding',
    owner: 'María L.',
    daysOverdue: 7,
    priority: 'Media',
  },
  {
    id: '4',
    title: 'CI/CD pipeline staging',
    owner: 'Laura V.',
    daysOverdue: 5,
    priority: 'Media',
  },
  {
    id: '5',
    title: 'Documentación API pública',
    owner: 'Diego M.',
    daysOverdue: 3,
    priority: 'Baja',
  },
  {
    id: '6',
    title: 'Fix notificaciones push iOS',
    owner: 'Andrea T.',
    daysOverdue: 2,
    priority: 'Media',
  },
  {
    id: '7',
    title: 'Analytics dashboard v1',
    owner: 'Andrea T.',
    daysOverdue: 1,
    priority: 'Baja',
  },
];

export const velocityData: VelocityData[] = [
  { weekLabel: 'S-8', value: 5 },
  { weekLabel: 'S-7', value: 7 },
  { weekLabel: 'S-6', value: 9 },
  { weekLabel: 'S-5', value: 6 },
  { weekLabel: 'S-4', value: 12 },
  { weekLabel: 'S-3', value: 8 },
  { weekLabel: 'S-2', value: 14 },
  { weekLabel: 'S-1', value: 10 },
];

// Mock KPI data by days range
export const getKpiDataByDays = (days: number): KpiMetrics => {
  if (days <= 7) {
    return { todo: 8, progress: 6, qa: 3, done: 12, overdue: 2, total: 31 };
  } else if (days <= 30) {
    return { todo: 24, progress: 18, qa: 9, done: 61, overdue: 7, total: 119 };
  } else if (days <= 90) {
    return { todo: 40, progress: 28, qa: 14, done: 180, overdue: 11, total: 273 };
  } else if (days <= 180) {
    return { todo: 55, progress: 35, qa: 20, done: 340, overdue: 14, total: 464 };
  } else {
    return { todo: 70, progress: 42, qa: 25, done: 680, overdue: 18, total: 835 };
  }
};
