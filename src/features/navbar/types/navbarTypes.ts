export interface SidebarContextType {
  collapsed: boolean;
  toggle: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}
export interface SidebarItemProps {
  id: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
}
