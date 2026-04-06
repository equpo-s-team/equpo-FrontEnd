import { ArrowRightLeft, ChessKnight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSidebar } from './SidebarContext.jsx';
import { useTeam } from '@/context/TeamContext.jsx';
import { useTeams } from '@/features/team/hooks/useTeams.ts';

export default function SidebarLogo() {
  const { collapsed } = useSidebar();
  const { teamId } = useTeam();
  const { data: teams = [] } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const activeTeam = teams.find((t) => t.id === teamId);
  const teamName = activeTeam?.name || 'Cargando...';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}
    >
      {/* Logo mark */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-purple-bg flex items-center justify-center shadow-blue-glow">
          <ChessKnight />
        </div>
        {/* Online pulse */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green border-2 border-dark" />
      </div>

      {/* Team name & Switcher */}
      {!collapsed && (
        <div className="flex-1 flex items-center justify-between">
          <div>
            <p className="font-maxwell text-primary-foreground text-md font-semibold leading-tight tracking-tight whitespace-nowrap">
              Equpo
            </p>
            <span className="inline-flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue flex-shrink-0" />
              <p className="text-cyan text-sm font-body font-medium tracking-wide whitespace-nowrap truncate max-w-[110px]" title={teamName}>
                {teamName}
              </p>
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              title="Cambiar de equipo"
              className="p-1.5 rounded-lg text-secondary-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowRightLeft size={16} />
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-grey-150 z-50 overflow-hidden py-1">
                  <p className="px-3 py-2 text-[10px] font-bold text-grey-400 uppercase tracking-wider">
                    Tus equipos
                  </p>
                  <div className="max-h-60 overflow-y-auto scrollbar-hide">
                    {teams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/dashboard/${t.id}`);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                          t.id === teamId
                            ? 'bg-blue/5 text-blue font-semibold'
                            : 'text-grey-700 hover:bg-grey-50 font-medium'
                        }`}
                      >
                        <span className="truncate flex-1">{t.name}</span>
                        {t.id === teamId && <span className="w-1.5 h-1.5 rounded-full bg-blue flex-shrink-0" />}
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
