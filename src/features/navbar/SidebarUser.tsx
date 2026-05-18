import { Ellipsis } from 'lucide-react';

import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useAuth } from '@/context/AuthContext.tsx';
import { useTeam } from '@/context/TeamContext.tsx';

import { useSidebar } from './SidebarContext.tsx';
import UserActionsMenu from './UserActionsMenu';

export default function SidebarUser() {
  const { collapsed } = useSidebar();
  const { user } = useAuth();
  const { myRole } = useTeam();

  const displayRole = myRole ? myRole.charAt(0).toUpperCase() + myRole.slice(1) : 'Miembro';

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';

  return (
    <div
      className={`
        border-t border-foreground/5 pt-3 mt-auto
        flex items-center gap-3 px-3 py-2.5
        ${collapsed ? 'flex-col justify-center' : ''}
      `}
    >
      <div className="relative flex-shrink-0">
        <UserAvatar src={user?.photoURL} alt={userName} className="w-8 h-8" loading="eager" />
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green border border-dark" />
      </div>

      {!collapsed && (
        <div className="flex-1 min-w-0">
          <p
            className="text-primary-foreground dark:text-white text-sm font-body font-medium leading-tight truncate"
            title={userName}
          >
            {userName}
          </p>
          <p className="text-secondary-foreground dark:text-gray-400 text-xs font-body mt-0.5 truncate">
            {displayRole}
          </p>
        </div>
      )}

      <UserActionsMenu
        variant="desktop"
        tooltip="Opciones"
        trigger={
          <button
            className={`flex-shrink-0 p-1.5 rounded-lg text-secondary-foreground dark:text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none ${collapsed ? 'mt-1' : ''}`}
          >
            <Ellipsis size={18} />
          </button>
        }
      />
    </div>
  );
}
