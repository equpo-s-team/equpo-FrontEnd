import { ChartColumnBig, Home, MessageCircle, Settings, Star, UserCheck } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';
import { useTeams } from '@/features/team/hooks/useTeams';

import { useSidebar } from './SidebarContext.jsx';
import SidebarItem from './SidebarItem.jsx';
import SidebarLogo from './SidebarLogo.jsx';
import SidebarSection from './SidebarSection.jsx';
import SidebarToggle from './SidebarToggle.jsx';
import SidebarUser from './SidebarUser.jsx';

export default function Sidebar() {
  const { collapsed } = useSidebar();
  const { user } = useAuth();
  const { teamId } = useTeam();
  const { data: teams = [] } = useTeams();

  // Determine the current user's role in the active team
  const currentTeam = teams.find((t) => t.id === teamId);
  const currentUid = user?.uid ?? '';
  const myRole = (() => {
    if (!currentTeam || !currentUid) return null;
    if (currentTeam.leaderUid === currentUid) return 'leader';
    return currentTeam.members.find((m) => m.userUid === currentUid)?.role ?? null;
  })();
  const canAccessSettings = myRole === 'leader' || myRole === 'collaborator';

  return (
    <aside
      className={`
    hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50 rounded-r-2xl
    bg-primary border-r border-secondary transition-all duration-300 ease-in-out
    ${collapsed ? 'w-[68px]' : 'w-[220px]'}
    shadow-neonPurple
  `}
    >
      <SidebarLogo />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-5 scrollbar-hide">
        <SidebarSection label="Principal">
          <SidebarItem id="my-space" icon={Home} label="Mi Espacio" />
          <SidebarItem id="missiones" icon={Star} label="Misiones del Equipo" badge="3" />
          <SidebarItem id="my-missions" icon={UserCheck} label="Mis Misiones" />
          <SidebarItem id="chat" icon={MessageCircle} label="Chat" badge="12" />
        </SidebarSection>

        <SidebarSection label="Moderation">
          <SidebarItem id="reports" icon={ChartColumnBig} label="Reportes" badge="2" />
          {canAccessSettings && (
            <SidebarItem id="settings" icon={Settings} label="Ajustes del Equipo" />
          )}
        </SidebarSection>
      </nav>

      <SidebarUser />
      <SidebarToggle />
    </aside>
  );
}
