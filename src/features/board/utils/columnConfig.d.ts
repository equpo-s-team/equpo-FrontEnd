export type ColumnAccent = 'todo' | 'progress' | 'qa' | 'done';

export type ColumnStyleConfig = {
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
};

export type PriorityKey = 'high' | 'medium' | 'low';

export type PriorityStyleConfig = {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
};

export const COLUMN_CONFIG: Record<ColumnAccent, ColumnStyleConfig>;
export const PRIORITY_CONFIG: Record<PriorityKey, PriorityStyleConfig>;
export const USER_GRADIENT: Record<string, string>;
export const TAG_COLOR_CONFIG: Record<string, { bg: string; text: string; border: string }>;
export const TAG_LABEL_TO_COLOR: Record<string, string>;
