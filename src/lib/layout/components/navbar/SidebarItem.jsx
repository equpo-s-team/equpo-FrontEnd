import { useSidebar } from './SidebarContext.jsx';

export default function SidebarItem({ id, icon: Icon, label, badge }) {
  const { collapsed, activeItem, setActiveItem } = useSidebar();
  const isActive = activeItem === id;

  return (
    <button
      onClick={() => setActiveItem(id)}
      title={collapsed ? label : undefined}
      className={`
                group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? 'bg-offwhite text-blue shadow-purple-glow/20'
                    : 'text-primary-foreground hover:text-tertiary-foreground hover:bg-secondary'
                }
                ${collapsed ? 'justify-center' : ''}
            `}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue rounded-r-full" />
      )}

      <span
        className={`flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-blue' : ''}`}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      </span>

      {!collapsed && (
        <span
          className={`text-sm font-body font-medium whitespace-nowrap transition-colors duration-200 ${isActive ? 'text-blue' : ''}`}
        >
          {label}
        </span>
      )}

      {badge && !collapsed && (
        <span className="ml-auto flex-shrink-0 px-1.5 py-0.5 rounded-full bg-purple-foreground/20 text-purple text-xs font-semibold font-body">
          {badge}
        </span>
      )}

      {collapsed && (
        <div
          className="
                    pointer-events-none absolute left-full ml-3 z-50
                    px-2.5 py-1.5 rounded-lg bg-dark-mid border border-white/10
                    text-offwhite text-xs font-body whitespace-nowrap
                    opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
                    transition-all duration-150 shadow-card
                "
        >
          {label}
          {badge && <span className="ml-1.5 text-cyan">({badge})</span>}
        </div>
      )}
    </button>
  );
}
