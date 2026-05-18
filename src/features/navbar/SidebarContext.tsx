import { createContext, useContext, useState } from 'react';

import { type SidebarContextType } from '@/features/navbar/types';

const SidebarContext = createContext<SidebarContextType | null>(null);

function getInitialActiveItem() {
  if (typeof window === 'undefined') return 'missiones';
  const roomID = new URLSearchParams(window.location.search).get('roomID');
  return roomID ? 'video-call' : 'missiones';
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(getInitialActiveItem);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, activeItem, setActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextType {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider');
  return ctx;
}
