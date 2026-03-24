import {useSidebar} from "@/components/navbar/SidebarContext.jsx";
import {ChevronsLeft} from "lucide-react";

export default function SidebarToggle() {
    const { collapsed, toggle } = useSidebar();

    return (
        <button
            onClick={toggle}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="
                group w-full flex items-center justify-center gap-2 px-3 py-2
                text-purple hover:text-purple-foreground
                transition-all duration-200
            "
        >
            <ChevronsLeft className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}/>

            {!collapsed && (
                <span className="text-xs font-body">Colapsar</span>
            )}
        </button>
    );
}
