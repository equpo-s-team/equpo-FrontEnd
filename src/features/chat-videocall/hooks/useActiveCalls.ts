import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';

import { rtdb } from '@/firebase';

export interface ActiveCall {
  roomId: string;
  callerId: string;
  callerName: string;
  roomName?: string;
  startedAt: number;
}

export function useActiveCalls(teamId: string) {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);

  useEffect(() => {
    if (!teamId) return;

    const callsRef = ref(rtdb, `teams/${teamId}/activeCalls`);
    const unsub = onValue(
      callsRef,
      (snapshot) => {
        const calls: ActiveCall[] = [];
        snapshot.forEach((child) => {
          calls.push({ roomId: child.key, ...(child.val() as Omit<ActiveCall, 'roomId'>) });
        });
        setActiveCalls(calls);
      },
      (error) => {
        console.warn('Error reading activeCalls data:', error);
      },
    );

    return () => unsub();
  }, [teamId]);

  return activeCalls;
}
