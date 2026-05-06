import { ChartColumnBig, Home, MessageCircle, Settings, Star } from 'lucide-react';

import { useAuth } from '@/context/AuthContext.tsx';
import { useTeam } from '@/context/TeamContext.tsx';
import { useTeams } from '@/features/team/hooks/useTeams.ts';

import { useSidebar } from './SidebarContext';

const BASE_NAV_ITEMS = [
  { id: 'my-space', label: 'Mi Espacio', icon: Home },
  { id: 'missiones', label: 'Misiones', icon: Star },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'reports', label: 'Reportes', icon: ChartColumnBig },
];

const SETTINGS_ITEM = { id: 'settings', label: 'Ajustes del Equipo', icon: Settings };

export default function BottomNav() {
  const { activeItem, setActiveItem } = useSidebar();
  const { user } = useAuth();
  const { teamId } = useTeam();
  const { data: teams = [] } = useTeams();

  const currentTeam = teams.find((t) => t.id === teamId);
  const currentUid = user?.uid ?? '';
  const myRole = (() => {
    if (!currentTeam || !currentUid) return null;
    if (currentTeam.leaderUid === currentUid) return 'leader';
    return currentTeam.members.find((m) => m.userUid === currentUid)?.role ?? null;
  })();
  const canAccessSettings = myRole === 'leader' || myRole === 'collaborator';

  const navItems = canAccessSettings ? [...BASE_NAV_ITEMS, SETTINGS_ITEM] : BASE_NAV_ITEMS;

  return (
    <nav
      className="
            lg:hidden fixed bottom-0 left-0 right-0 z-50
            bg-primary/95 backdrop-blur-xl
            border-t border-secondary
            flex items-stretch
            pb-safe
        "
      style={{
        '--bottom-nav-height': '56px',
      } as React.CSSProperties}
    >
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = activeItem === id;
        return (
          <button
            key={id}
            onClick={() => setActiveItem(id)}
            className={`
                            flex-1 flex flex-col items-center justify-center gap-1
                            py-3 relative transition-all duration-200
                            ${
                              isActive
                                ? 'text-blue'
                                : 'text-primary-foreground/40 active:text-primary-foreground/70'
                            }
                        `}
          >
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue" />
            )}

            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />

            <span
              className={`
                            text-xs font-body font-medium leading-none transition-colors truncate max-w-full px-1
                            ${isActive ? 'text-blue' : ''}
                        `}
            >
              {id === 'settings' ? 'Ajustes' : label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
