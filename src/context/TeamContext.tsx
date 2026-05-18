import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useTeams } from '@/features/team/hooks/useTeams';
import type { Team } from '@/features/team/types/teamsTypes';

export type TeamRole = 'leader' | 'collaborator' | 'spectator' | 'member';

interface TeamContextType {
  teamId: string | undefined;
  setTeamId: (id: string | undefined) => void;
  activeTeam: Team | undefined;
  myRole: TeamRole | null;
  canAccessSettings: boolean;
  isSpectator: boolean;
}

const TeamContext = createContext<TeamContextType | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { teamId: urlTeamId } = useParams<{ teamId: string }>();
  const [teamId, setTeamId] = useState<string | undefined>(urlTeamId);
  const { user } = useAuth();
  const { data: teams = [] } = useTeams();

  useEffect(() => {
    if (urlTeamId) {
      setTeamId(urlTeamId);
    }
  }, [urlTeamId]);

  const activeTeam = useMemo(() => teams.find((t) => t.id === teamId), [teams, teamId]);

  const myRole = useMemo<TeamRole | null>(() => {
    if (!activeTeam || !user?.uid) return null;
    if (activeTeam.leaderUid === user.uid) return 'leader';
    return activeTeam.members.find((m) => m.userUid === user.uid)?.role ?? null;
  }, [activeTeam, user?.uid]);

  const canAccessSettings = myRole === 'leader' || myRole === 'collaborator';
  const isSpectator = myRole === 'spectator';

  return (
    <TeamContext.Provider
      value={{ teamId, setTeamId, activeTeam, myRole, canAccessSettings, isSpectator }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam(): TeamContextType {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used inside TeamProvider');
  return ctx;
}
