import {useSidebar} from "./SidebarContext.jsx";

export default function SidebarSection({ label, children }) {
    const { collapsed } = useSidebar();

    return (
        <div className="flex flex-col gap-1">
            {!collapsed && label && (
                <p className="px-3 pt-1 pb-0.5 text-xs font-body font-semibold tracking-widest uppercase text-purple select-none">
                    {label}
                </p>
            )}
            {collapsed && label && (
                <div className="flex justify-center py-1">
                    <span className="w-4 h-px bg-dark-mid" />
                </div>
            )}
            <div className="flex flex-col gap-0.5">
                {children}
            </div>
        </div>
    );
}
