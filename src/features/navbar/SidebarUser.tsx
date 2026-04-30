import { Ellipsis, SquareArrowRightExit, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppTooltip } from '@/components/ui/AppTooltip.tsx';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { logOut, useAuth } from '@/context/AuthContext.jsx';
import { useTeam } from '@/context/TeamContext.tsx';
import { useTeams } from '@/features/team/hooks/useTeams.ts';

import { useSidebar } from './SidebarContext.jsx';

export default function SidebarUser() {
  const { collapsed } = useSidebar();
  const { user } = useAuth();
  const { teamId } = useTeam();
  const { data: teams = [] } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const activeTeam = teams.find((t) => t.id === teamId);
  // Default to member if not found for whatever reason
  const teamRole = activeTeam?.members?.find((m) => m.userUid === user?.uid)?.role || 'Miembro';

  // Create a friendlier display version of the role
  const displayRole =
    typeof teamRole === 'string' && teamRole.length > 0
      ? teamRole.charAt(0).toUpperCase() + teamRole.slice(1)
      : 'Miembro';

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div
      className={`
            border-t border-foreground/5 pt-3 mt-auto
            flex items-center gap-3 px-3 py-2.5
            ${collapsed ? 'flex-col justify-center' : ''}
        `}
    >
      <div className="relative flex-shrink-0">
        <UserAvatar
          src={user?.photoURL}
          alt={userName}
          initials={initial}
          className="w-8 h-8"
          fallbackClassName="bg-gradient-blue-bg text-secondary font-maxwell text-xs select-none"
          loading="eager"
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green border-[1.5px] border-dark" />
      </div>

      {!collapsed && (
        <div className="flex-1 min-w-0">
          <p
            className="text-primary-foreground text-sm font-body font-medium leading-tight truncate"
            title={userName}
          >
            {userName}
          </p>
          <p className="text-secondary-foreground text-xs font-body mt-0.5 truncate">
            {displayRole}
          </p>
        </div>
      )}

      {/* Menu Options */}
      <div className="relative">
        <AppTooltip content="Opciones">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex-shrink-0 p-1.5 rounded-lg text-secondary-foreground hover:text-white hover:bg-white/10 transition-all duration-200 ${collapsed ? 'mt-1' : ''} `}
          >
            <Ellipsis size={18} />
          </button>
        </AppTooltip>

        {isOpen && (
          <>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute bottom-[calc(100%+8px)] right-0 w-44 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-grey-150 z-50 overflow-hidden py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  void navigate('/teams');
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-grey-700 hover:bg-grey-50 transition-colors flex items-center gap-2 font-medium"
              >
                <Users size={16} className="text-grey-400" />
                <span>Mis Equipos</span>
              </button>

              <div className="h-px w-full bg-grey-100 my-1" />

              <button
                onClick={() => {
                  setIsOpen(false);
                  void logOut();
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-[#F65A70] hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
              >
                <SquareArrowRightExit size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
