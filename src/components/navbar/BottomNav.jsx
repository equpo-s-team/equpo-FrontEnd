import {useSidebar} from "@/components/navbar/SidebarContext.jsx";


const NAV_ITEMS = [
    {
        id: 'my-espacio',
        label: 'Mi Espacio',
        icon: ({ active }) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        id: 'misiones',
        label: 'Misiones',
        icon: ({ active }) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
    },
    {
        id: 'chat',
        label: 'Chat',
        icon: ({ active }) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'reportes',
        label: 'Reportes',
        icon: ({ active }) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    {
        id: 'ajustes',
        label: 'Ajustes',
        icon: ({ active }) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const { activeItem, setActiveItem } = useSidebar();

    return (
        <nav className="
            lg:hidden fixed bottom-0 left-0 right-0 z-50
            bg-dark-mid/95 backdrop-blur-xl
            border-t border-white/[0.08]
            flex items-stretch
            pb-safe
        ">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeItem === id;
                return (
                    <button
                        key={id}
                        onClick={() => setActiveItem(id)}
                        className={`
                            flex-1 flex flex-col items-center justify-center gap-1
                            py-3 relative transition-all duration-200
                            ${isActive ? 'text-green' : 'text-offwhite/40 active:text-offwhite/70'}
                        `}
                    >
                        {/* Active glow blob */}
                        {isActive && (
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-green shadow-green-glow" />
                        )}
                        <Icon active={isActive} />
                        <span className={`text-[10px] font-body font-medium leading-none transition-colors ${isActive ? 'text-green' : ''}`}>
                            {label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
