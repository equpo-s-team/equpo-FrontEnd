import { ArrowRightLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppTooltip } from '@/components/ui/AppTooltip.tsx';
import { TeamAvatar } from '@/components/ui/TeamAvatar.tsx';
import { useTeam } from '@/context/TeamContext.tsx';
import { useTeams } from '@/features/team/hooks/useTeams.ts';

import { useSidebar } from './SidebarContext.tsx';

export default function SidebarLogo() {
  const { collapsed } = useSidebar();
  const { teamId } = useTeam();
  const { data: teams = [] } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const activeTeam = teams.find((t) => t.id === teamId);
  const teamName = activeTeam?.name || 'Cargando...';
  const teamPhotoUrl = activeTeam?.photoUrl || null;
  const activeUsersCount = activeTeam?.members?.length ?? 0;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}
    >
      {/* Logo mark */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-purple-bg flex items-center justify-center shadow-blue-glow">
          <TeamAvatar
            src={teamPhotoUrl}
            name={teamName}
            className="w-full h-full"
            fallbackClassName="w-full h-full text-white text-xs leading-none"
            loading="eager"
          />
        </div>
        {/* Online pulse */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green border-2 border-dark" />
      </div>

      {/* Team name & Switcher */}
      {!collapsed && (
        <div className="flex-1 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="flex flex-col gap-1 mt-0.5">
              <p
                className="text-primary dark:text-white text-md font-body font-bold tracking-wide whitespace-nowrap truncate max-w-[110px]"
                title={teamName}
              >
                {teamName}
              </p>
            </span>
            <span className="inline-flex items-center rounded-full border border-green/50 bg-green/30 px-1 py-0.5 text-[10px] font-bold tracking-wide text-green-500 gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
              {activeUsersCount + (activeUsersCount === 1 ? ' miembro' : ' miembros')}
            </span>
          </div>

          <div className="relative">
            <AppTooltip content="Cambiar de equipo">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-lg text-secondary-foreground dark:text-white hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowRightLeft size={16} />
              </button>
            </AppTooltip>

            {isOpen && (
              <>
                <button
                  type="button"
                  aria-label="Cerrar selector de equipos"
                  className="fixed inset-0 z-40 bg-transparent border-0 p-0"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-grey-150 z-50 overflow-hidden py-1">
                  <p className="px-3 py-2 text-xs font-bold text-grey-400 uppercase tracking-wider">
                    Tus equipos
                  </p>
                  <div className="max-h-60 overflow-y-auto scrollbar-hide">
                    {teams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setIsOpen(false);
                          void navigate(`/dashboard/${t.id}`);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                          t.id === teamId
                            ? 'bg-blue/5 text-blue font-semibold'
                            : 'text-grey-700 hover:bg-grey-50 font-medium'
                        }`}
                      >
                        <span className="truncate flex-1">{t.name}</span>
                        {t.id === teamId && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
