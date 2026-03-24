import {useSidebar} from "@/components/navbar/SidebarContext.jsx";
import {ChessKnight} from "lucide-react";

export default function SidebarLogo() {
    const { collapsed } = useSidebar();

    return (
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
            {/* Logo mark */}
            <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-purple-bg flex items-center justify-center shadow-blue-glow">
                    <ChessKnight/>
                </div>
                {/* Online pulse */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green border-2 border-dark" />
            </div>

            {/* Team name */}
            {!collapsed && (
                <div className="overflow-hidden">
                    <p className="font-maxwell text-primary-foreground text-md font-semibold leading-tight tracking-tight whitespace-nowrap">
                        Equpo
                    </p>
                    <span className="inline-flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue flex-shrink-0" />
                        <p className="text-cyan text-sm font-body font-medium tracking-wide whitespace-nowrap">
                            Sofia's team
                        </p>
                    </span>
                </div>
            )}
        </div>
    );
}
