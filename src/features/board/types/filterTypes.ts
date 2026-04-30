import { type RecurringInterval, type TaskPriority } from '@/features/board';
import { TAG_COLOR_CONFIG } from '@/features/board/utils/columnConfig.ts';

export const CATEGORY_PALETTE = [
  TAG_COLOR_CONFIG.blue,
  TAG_COLOR_CONFIG.green,
  TAG_COLOR_CONFIG.cyan,
  TAG_COLOR_CONFIG.purple,
  TAG_COLOR_CONFIG.orange,
  TAG_COLOR_CONFIG.red,
];

export const PRIORITY_ITEMS = [
  { value: 'high', label: 'Alta', dot: 'bg-red' },
  { value: 'medium', label: 'Media', dot: 'bg-orange-dark' },
  { value: 'low', label: 'Baja', dot: 'bg-green' },
];

export const RECURRING_STATES = [
  { value: null, label: 'Todas' },
  { value: true, label: 'Solo recurrentes' },
  { value: false, label: 'Solo no recurrentes' },
];

export const INTERVAL_LABELS = {
  days: 'Días',
  weeks: 'Semanas',
  months: 'Meses',
  years: 'Años',
};

export const INITIAL_FILTERS: TaskFilters = {
  categories: [],
  priorities: [],
  dueDateBefore: null,
  isRecurring: null,
  recurringInterval: null,
  recurringCount: null,
  assignedUserUids: [],
  assignedGroupIds: [],
};

export interface User {
  uid: string;
  displayName?: string;
}

export interface Group {
  id: string;
  groupName: string;
}

export interface TaskFilters {
  categories: string[];
  priorities: TaskPriority[];
  dueDateBefore: string | null;
  isRecurring: boolean | null;
  recurringInterval: RecurringInterval | null;
  recurringCount: number | null;
  assignedUserUids: string[];
  assignedGroupIds: string[];
}

export interface pillProp {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export interface dropPanelProp {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface panelFooterProp {
  onClear: () => void;
  onApply: () => void;
}

export interface checkRowProp {
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onClick: () => void;
}

export interface categoryPillProp {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export interface categoryPillProp {
  label: string;
  selected: boolean;
  onClick: () => void;
}
export interface categoriesFilterProp {
  categories: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export interface priorityFilterProp {
  selected: TaskPriority[];
  onChange: (selected: TaskPriority[]) => void;
}

export interface dueDateFilterProp {
  value: string | null;
  onChange: (selected: string | null) => void;
}

export interface recurringFilterProp {
  isRecurring: boolean | null;
  onIsRecurringChange: (isRecurring: boolean | null) => void;
  interval: RecurringInterval | null;
  onIntervalChange: (interval: RecurringInterval | null) => void;
  count: number | null;
  onCountChange: (count: number | null) => void;
}

export interface assignedUserFilterProp {
  members: User[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export interface assignedGroupFilterProp {
  groups: Group[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export type SetFilterFn = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;

export interface filterBarProp {
  filters: TaskFilters;
  setFilter: SetFilterFn;
  resetFilters: () => void;
  activeFilterCount: number;
  allCategories: string[];
  members: User[];
  groups: Group[];
  onCreateTask: () => void;
  canCreateTask: boolean;
}
