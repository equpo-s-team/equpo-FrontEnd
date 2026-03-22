import {Home, Star, MessageCircle, ChartColumnBig, Settings} from "lucide-react";
import {useSidebar} from "@/components/navbar/SidebarContext.jsx";

const NAV_ITEMS = [
    {id: 'my-space', label: 'Mi Espacio', icon: Home},
    {id: 'missiones', label: 'Misiones', icon: Star},
    {id: 'chat', label: 'Chat', icon: MessageCircle},
    {id: 'reports', label: 'Reportes', icon: ChartColumnBig},
    {id: 'settings', label: 'Ajustes', icon: Settings},
];

export default function BottomNav() {
    const {activeItem, setActiveItem} = useSidebar();

    return (
        <nav className="
            lg:hidden fixed bottom-0 left-0 right-0 z-50
            bg-primary/95 backdrop-blur-xl
            border-t border-secondary
            flex items-stretch
            pb-safe
        ">
            {NAV_ITEMS.map(({id, label, icon: Icon}) => {
                const isActive = activeItem === id;
                return (
                    <button
                        key={id}
                        onClick={() => setActiveItem(id)}
                        className={`
                            flex-1 flex flex-col items-center justify-center gap-1
                            py-3 relative transition-all duration-200
                            ${isActive
                            ? 'text-blue'
                            : 'text-primary-foreground/40 active:text-primary-foreground/70'
                        }
                        `}
                    >
                        {isActive && (
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue"/>
                        )}

                        <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8}/>

                        <span className={`
                            text-[10px] font-body font-medium leading-none transition-colors
                            ${isActive ? 'text-blue' : ''}
                        `}>
                            {label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}