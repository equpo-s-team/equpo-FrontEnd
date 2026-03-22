import {useSidebar} from "@/components/navbar/SidebarContext.jsx";
import {SquareArrowRightExit} from "lucide-react";

export default function SidebarUser() {
    const { collapsed } = useSidebar();

    return (
        <div className={`
            border-t border-foreground/5 pt-3 mt-auto
            flex items-center gap-3 px-3 py-2.5
            ${collapsed ? 'flex-col justify-center' : ''}
        `}>

            <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-blue-bg flex items-center justify-center text-secondary text-xs font-maxwell font-bold select-none">
                    S
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green border-[1.5px] border-dark" />
            </div>

            {!collapsed && (
                <div className="flex-1 min-w-0">
                    <p className="text-primary-foreground text-sm font-body font-medium leading-tight truncate">Sofía Ramírez</p>
                    <p className="text-secondary-foreground text-[11px] font-body mt-0.5 truncate">Moderadora</p>
                </div>
            )}

            <button
                title="Cerrar sesión"
                className={`flex-shrink-0 p-1.5 rounded-lg text-secondary-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 ${collapsed ? 'mt-1' : ''} `}
            >
                <SquareArrowRightExit/>
            </button>
        </div>
    );
}
