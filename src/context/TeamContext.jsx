import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Provides the current teamId for the active team dashboard.
 *
 * It will track the teamId parameter from the current route.
 * A fallback mock teamId is also included for dev boundaries if necessary.
 */


const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const { teamId: urlTeamId } = useParams();
  const [teamId, setTeamId] = useState(urlTeamId);

  // Synchronize teamId from URL if it changes
  useEffect(() => {
    if (urlTeamId) {
      setTeamId(urlTeamId);
    }
  }, [urlTeamId]);

  return <TeamContext.Provider value={{ teamId, setTeamId }}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used inside TeamProvider');
  return ctx;
}
