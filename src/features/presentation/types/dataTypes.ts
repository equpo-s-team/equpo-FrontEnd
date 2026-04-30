
export interface task {
  tag: string,
  tagBg: string,
  tagColor: string,
  text: string
}

export interface KanbanColProps {
  title: string,
  dotGrad: string,
  tasks: task[]
}

export interface SectionLabelProps {
  children: React.ReactNode,
  gradient?: string,
  textGrad?: string,
  barColor?: string,
  color?: string,
  className?: string
}

export interface NucleusDotsProps {
  count: number;
  activeIdx: number;
  onDotClick: (idx: number) => void;
}

export interface FloatCardProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  label: string;
  iconBg: string;
}
export interface FloatCardRingProps {
  title: string;
  label: string;
}
