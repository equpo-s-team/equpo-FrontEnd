declare module '@/features/layout/components/navbar/SidebarContext.jsx' {
  import type { ReactNode } from 'react';

  interface SidebarContextValue {
    collapsed: boolean;
    toggle: () => void;
    activeItem: string;
    setActiveItem: (item: string) => void;
  }

  export function SidebarProvider(props: { children: ReactNode }): JSX.Element;
  export function useSidebar(): SidebarContextValue;
}

