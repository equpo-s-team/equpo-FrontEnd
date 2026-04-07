import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext(null);

function getInitialActiveItem() {
  if (typeof window === 'undefined') return 'my-space';
  const roomID = new URLSearchParams(window.location.search).get('roomID');
  return roomID ? 'video-call' : 'my-space';
}

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(getInitialActiveItem);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, activeItem, setActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider');
  return ctx;
}
