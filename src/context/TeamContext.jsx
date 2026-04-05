import { createContext, useContext, useState } from 'react';

/**
 * Provides the current teamId for the active team dashboard.
 *
 * In production, the teamId is set when the user selects a team.
 * For development, a fallback mock teamId is used to enable testing.
 */

const MOCK_TEAM_ID = '00000000-0000-0000-0000-000000000001';

const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const [teamId, setTeamId] = useState(MOCK_TEAM_ID);

  return <TeamContext.Provider value={{ teamId, setTeamId }}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used inside TeamProvider');
  return ctx;
}
