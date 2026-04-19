import type { TaskStatus } from '../types';

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
