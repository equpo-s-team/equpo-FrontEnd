import type { DatePreset } from '../types/types.ts';

export const DATE_PRESETS: DatePreset[] = [
  { label: 'Hoy', days: 1 },
  { label: '7 dias', days: 7 },
  { label: '30 dias', days: 30 },
  { label: '90 dias', days: 90 },
  { label: 'Este ano', days: 365 },
  { label: 'Personalizado', days: 0 },
];

