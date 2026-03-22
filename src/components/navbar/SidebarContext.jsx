import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('my-espacio');

    const toggle = () => setCollapsed(prev => !prev);

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
