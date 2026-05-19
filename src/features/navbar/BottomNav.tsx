import { Ellipsis, Home, MessageCircle, ShoppingBag, Star } from 'lucide-react';

import { useTeam } from '@/context/TeamContext';

import { useSidebar } from './SidebarContext';
import UserActionsMenu from './UserActionsMenu';

export default function BottomNav() {
  const { activeItem, setActiveItem } = useSidebar();
  const { isSpectator } = useTeam();

  const missionTarget = isSpectator ? 'missiones' : 'my-missions';
  const isMissionActive = activeItem === 'missiones' || activeItem === 'my-missions';
  const isMoreActive = activeItem === 'reports' || activeItem === 'settings';

  const navItems = [
    { id: 'my-space', label: 'Mi Espacio', icon: Home, isActive: activeItem === 'my-space' },
    { id: missionTarget, label: 'Misiones', icon: Star, isActive: isMissionActive },
    { id: 'chat', label: 'Chats', icon: MessageCircle, isActive: activeItem === 'chat' },
    { id: 'shop', label: 'Tienda', icon: ShoppingBag, isActive: activeItem === 'shop' },
  ];

  return (
    <nav
      className="
        lg:hidden fixed bottom-0 left-0 right-0 z-50
        bg-primary/95 dark:bg-gray-800/95 backdrop-blur-xl
        border-t border-secondary dark:border-gray-700
        flex items-stretch
        pb-safe
      "
      style={{ '--bottom-nav-height': '56px' } as React.CSSProperties}
    >
      {navItems.map(({ id, label, icon: Icon, isActive }) => (
        <button
          key={id}
          onClick={() => setActiveItem(id)}
          className={`
            flex-1 flex flex-col items-center justify-center gap-1
            py-3 relative transition-all duration-200
            ${isActive ? 'text-blue' : 'text-primary-foreground dark:text-gray-400 active:text-tertiary-foreground dark:active:text-gray-300'}
          `}
        >
          {isActive && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue" />
          )}
          <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
          <span
            className={`text-xs font-body font-medium leading-none transition-colors truncate max-w-full px-1 ${isActive ? 'text-blue' : ''}`}
          >
            {label}
          </span>
        </button>
      ))}

      {/* Más — opens UserActionsMenu dropdown */}
      <UserActionsMenu
        variant="mobile"
        trigger={
          <button
            className={`
              flex-1 flex flex-col items-center justify-center gap-1
              py-3 relative transition-all duration-200
              ${isMoreActive ? 'text-blue' : 'text-primary-foreground dark:text-gray-400 active:text-tertiary-foreground dark:active:text-gray-300'}
            `}
          >
            {isMoreActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue" />
            )}
            <Ellipsis size={22} strokeWidth={isMoreActive ? 2.2 : 1.8} />
            <span
              className={`text-xs font-body font-medium leading-none ${isMoreActive ? 'text-blue' : ''}`}
            >
              Más
            </span>
          </button>
        }
      />
    </nav>
  );
}
