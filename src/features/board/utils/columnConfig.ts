import { CheckSquare, LayoutGrid, Loader, ShieldCheck } from 'lucide-react';

import {
  type ColumnEmptyConfig,
  type ColumnStyleConfig,
  type PriorityStyleConfig,
  type TagColorConfig,
} from '@/features/board/types';

export const COLUMN_CONFIG: Record<string, ColumnStyleConfig> = {
  todo: {
    border: 'border-kanban-todo/40',
    shadow: 'shadow-col-todo',
    topBar: 'bg-kanban-todo/60',
    indicator: 'bg-kanban-todo shadow-neonGrey',
    indicatorAnim: '',
    title: 'text-kanban-todo',

    cardBorder: 'border-kanban-todo/30',
    cardShadow: 'shadow-card-todo',
    cardBorderHover: 'hover:border-kanban-todo/75',
    cardShadowHover: 'hover:shadow-card-todo-hover',

    progressFill: 'bg-gradient-to-r from-grey-400 to-grey-300',
    progressColor: 'text-kanban-todo',
  },
  progress: {
    border: 'border-blue/45',
    shadow: 'shadow-col-progress',
    topBar: 'bg-blue',
    indicator: 'bg-blue shadow-neonBlue animate-pulse-neon',
    indicatorAnim: 'animate-pulse-neon',
    title: 'text-blue',
    cardBorder: 'border-blue/30',
    cardShadow: 'shadow-card-progress',
    cardBorderHover: 'hover:border-blue/75',
    cardShadowHover: 'hover:shadow-card-progress-hover',
    progressFill: 'bg-gradient-blue-bg',
    progressColor: 'text-blue',
  },
  qa: {
    border: 'border-kanban-qa/45',
    shadow: 'shadow-col-qa',
    topBar: 'bg-kanban-qa',
    indicator: 'bg-kanban-qa shadow-neonCyan',
    indicatorAnim: 'animate-pulse-neon-fast',
    title: 'text-kanban-qa',
    cardBorder: 'border-kanban-qa/30',
    cardShadow: 'shadow-card-qa',
    cardBorderHover: 'hover:border-kanban-qa/75',
    cardShadowHover: 'hover:shadow-card-qa-hover',
    progressFill: 'bg-gradient-qa-bg',
    progressColor: 'text-kanban-qa',
  },
  done: {
    border: 'border-green/45',
    shadow: 'shadow-col-done',
    topBar: 'bg-green',
    indicator: 'bg-green shadow-neonGreen',
    indicatorAnim: '',
    title: 'text-green',
    cardBorder: 'border-green/30',
    cardShadow: 'shadow-card-done',
    cardBorderHover: 'hover:border-green/75',
    cardShadowHover: 'hover:shadow-card-done-hover',
    progressFill: 'bg-gradient-green-bg',
    progressColor: 'text-green',
  },
};

export const PRIORITY_CONFIG: Record<string, PriorityStyleConfig> = {
  high: {
    label: 'Alta',
    bg: 'bg-red/10',
    text: 'text-red',
    border: 'border-red/30',
    dot: 'bg-red',
  },
  medium: {
    label: 'Media',
    bg: 'bg-orange-dark/10',
    text: 'text-orange-dark',
    border: 'border-orange-dark/30',
    dot: 'bg-orange-dark',
  },
  low: {
    label: 'Baja',
    bg: 'bg-green/10',
    text: 'text-green',
    border: 'border-green/30',
    dot: 'bg-green',
  },
};

export const TAG_COLOR_CONFIG: Record<string, TagColorConfig> = {
  blue: { bg: 'bg-blue/10', text: 'text-blue', border: 'border-blue/30' },
  green: { bg: 'bg-green/10', text: 'text-green', border: 'border-green/30' },
  cyan: { bg: 'bg-[#86F0FD]/10', text: 'text-[#0891b2]', border: 'border-[#86F0FD]/30' },
  red: { bg: 'bg-red/10', text: 'text-red', border: 'border-red/30' },
  orange: { bg: 'bg-orange/10', text: 'text-orange', border: 'border-orange/30' },
  purple: { bg: 'bg-purple/10', text: 'text-purple', border: 'border-purple/30' },
};

export const TAG_LABEL_TO_COLOR: Record<string, string> = {
  Frontend: 'blue',
  Backend: 'green',
  API: 'cyan',
  Bug: 'red',
  Urgente: 'orange',
  Diseño: 'purple',
  Mobile: 'blue',
  Testing: 'green',
  Crítico: 'red',
  Research: 'orange',
};

export const USER_GRADIENT: Record<string, string> = {
  AT: 'bg-avatar-at',
  JR: 'bg-avatar-jr',
  ML: 'bg-avatar-ml',
  CS: 'bg-avatar-cs',
  LV: 'bg-avatar-lv',
  DM: 'bg-avatar-dm',
  SR: 'bg-avatar-sr',
};

export const COLUMN_EMPTY: Record<string, ColumnEmptyConfig> = {
  todo: {
    icon: LayoutGrid,
    title: 'Sin misiones pendientes',
    description: 'Crea una misión para comenzar el sprint.',
  },
  progress: {
    icon: Loader,
    title: 'Nada en progreso',
    description: 'Mueve una misión aquí cuando empiece el trabajo.',
  },
  qa: {
    icon: ShieldCheck,
    title: 'Sin misiones en revisión',
    description: 'Las misiones listas para QA aparecerán aquí.',
  },
  done: {
    icon: CheckSquare,
    title: 'Nada completado aún',
    description: 'Las misiones completadas se verán en esta columna.',
  },
};

// Maps task status to column ID
export const STATUS_TO_COLUMN: Record<string, 'todo' | 'progress' | 'qa' | 'done'> = {
  todo: 'todo',
  'in-progress': 'progress',
  'in-qa': 'qa',
  done: 'done',
};

// Maps column ID to task status
export const COLUMN_TO_STATUS: Record<'todo' | 'progress' | 'qa' | 'done', string> = {
  todo: 'todo',
  progress: 'in-progress',
  qa: 'in-qa',
  done: 'done',
};

// Column definitions for the board
export const COLUMNS = [
  { id: 'todo', label: 'Por Hacer', accent: 'todo' },
  { id: 'progress', label: 'En Progreso', accent: 'progress' },
  { id: 'qa', label: 'Revisión', accent: 'qa' },
  { id: 'done', label: 'Terminado', accent: 'done' },
] as const;
