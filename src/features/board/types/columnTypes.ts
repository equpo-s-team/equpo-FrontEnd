import type {LucideIcon} from "lucide-react";

import {type TaskPriority, type TaskStatus, type TeamTask} from "@/features/board";

export const STATUS_TO_COLUMN: Record<TaskStatus, BoardColumnId> = {
  todo: 'todo',
  'in-progress': 'progress',
  'in-qa': 'qa',
  done: 'done',
};

export const COLUMNS = [
  { id: 'todo', label: 'To Do', accent: 'todo' },
  { id: 'progress', label: 'In Progress', accent: 'progress' },
  { id: 'qa', label: 'In QA', accent: 'qa' },
  { id: 'done', label: 'Done', accent: 'done' },
];

export const COLUMN_TO_STATUS = {
  todo: 'todo',
  progress: 'in-progress',
  qa: 'in-qa',
  done: 'done',
};

export interface ColumnStyleConfig {
  border: string;
  shadow: string;
  topBar: string;
  indicator: string;
  indicatorAnim: string;
  title: string;
  cardBorder: string;
  cardShadow: string;
  cardBorderHover: string;
  cardShadowHover: string;
  progressFill: string;
  progressColor: string;
}

export interface PriorityStyleConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export interface TagColorConfig {
  bg: string;
  text: string;
  border: string;
}

export interface ColumnEmptyConfig {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface DropZoneProps {
  onDrop: (cardId: string, fromColumnId: string, position: number) => void;
  position: number;
}

export interface Column {
  id: BoardColumnId;
  label: string;
  accent: BoardColumnId;
}

export type Card = {
  id: string;
  name: string;
  description?: string;
  priority?: TaskPriority;
  categories?: string[];
  assignees?: string[];
  status: string;
  stepsTotal?: number;
  stepsDone?: number;
  _raw: TeamTask | null;
};

export interface BoardColumnProps {
  column: Column;
  cards: Card[];
  onMoveCard: (cardId: string, fromColumnId: string, toColumnId: string, position: number) => void | Promise<void>;
  onCardClick: (card: Card) => void;
  canMoveCard?: boolean;
}

export type BoardCardData = {
  id: string;
  name: string;
  description?: string;
  priority?: TaskPriority;
  categories?: string[];
  assignees?: string[];
  stepsTotal?: number;
  stepsDone?: number;
};

export type BoardCardProps = {
  card: Card;
  accent: BoardColumnId;
  columnId: BoardColumnId;
  onMoveCard?: (
    draggedCardId: string,
    fromColumnId: BoardColumnId,
    toColumnId: BoardColumnId,
    position: number,
  ) => void | Promise<void>;
  onCardClick?: (card: Card) => void;
  position: number;
  canMoveCard?: boolean;
};

export type PointerTracking = {
  x: number;
  y: number;
  t: number;
  dragged: boolean;
};

export type BoardColumnId = 'todo' | 'progress' | 'qa' | 'done';

export type TaskSidebarMode = 'create' | 'edit' | 'view' | 'readonly';

export interface TaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: TaskSidebarMode;
  task?: TeamTask | null;
  teamId: string;
  defaultStatus?: string;
  onTaskCreated?: () => void;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
  myRole?: string;
  currentUserUid?: string | null;
}
