interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

declare module '@/features/navbar/SidebarContext.jsx' {
  import type { ReactNode } from 'react';

  export function SidebarProvider(props: { children: ReactNode }): JSX.Element;
  export function useSidebar(): SidebarContextValue;
}

declare module '@/features/layout/components/navbar/SidebarContext.jsx' {
  import type { ReactNode } from 'react';

  export function SidebarProvider(props: { children: ReactNode }): JSX.Element;
  export function useSidebar(): SidebarContextValue;
}
