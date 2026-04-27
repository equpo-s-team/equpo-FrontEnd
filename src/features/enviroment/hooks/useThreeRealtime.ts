import { useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import {
  type PlayerRealtimeState,
  type SlotId,
  type Vector3State,
} from '@/features/enviroment/types/realtime.ts';
import { BASE_URL } from '@/lib/api/core';

interface UseThreeRealtimeParams {
  teamId: string | null;
  localUid: string | null;
  isEnabled: boolean;
  localPosition: Vector3State;
  localRotation: Vector3State;
}

interface ThreePresenceSnapshot {
  connectedUsers: number;
  connectedUserUids: string[];
  playersState: Record<string, PlayerRealtimeState>;
  localSlotId: SlotId | null;
}

const UPDATE_INTERVAL_MS = 10;

export function useThreeRealtime({
  teamId,
  localUid,
  isEnabled,
  localPosition,
  localRotation,
}: UseThreeRealtimeParams): ThreePresenceSnapshot {
  const clientId = useMemo(() => crypto.randomUUID(), []);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [connectedUserUids, setConnectedUserUids] = useState<string[]>([]);
  const [playersState, setPlayersState] = useState<Record<string, PlayerRealtimeState>>({});
  const [localSlotId, setLocalSlotId] = useState<SlotId | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const latestState = useRef({ position: localPosition, rotation: localRotation });

  useEffect(() => {
    latestState.current = { position: localPosition, rotation: localRotation };
  }, [localPosition, localRotation]);

  useEffect(() => {
    if (!isEnabled || !teamId || !localUid) {
      setPlayersState({});
      setConnectedUsers(0);
      setConnectedUserUids([]);
      setLocalSlotId(null);
      return;
    }

    const wsUrl = new URL(BASE_URL).origin;

    const socket = io(wsUrl, {
      query: { teamId, uid: localUid },
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      // Claim a slot when connected
      socket.emit('claim_slot', { clientId }, (slotId: SlotId | null) => {
        setLocalSlotId(slotId);
      });
    });

    socket.on('state_update', (payload: Record<string, PlayerRealtimeState>) => {
      const nextUids: string[] = [];
      const nextStates: Record<string, PlayerRealtimeState> = {};
      let count = 0;

      Object.entries(payload).forEach(([uid, playerState]) => {
        if (playerState.active) {
          count++;
          nextUids.push(uid);
          if (uid !== localUid) {
            nextStates[uid] = playerState;
          } else if (playerState.slotId && playerState.slotId !== localSlotId) {
             setLocalSlotId(playerState.slotId);
          }
        }
      });

      setConnectedUsers(count);
      setConnectedUserUids(nextUids);
      setPlayersState(nextStates);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isEnabled, teamId, localUid, clientId, localSlotId]);

  const latestState = useRef({ position: localPosition, rotation: localRotation });
  useEffect(() => {
    latestState.current = { position: localPosition, rotation: localRotation };
  }, [localPosition, localRotation]);

  useEffect(() => {
    if (!isEnabled || !teamId || !localUid || !localSlotId) return;

    const intervalId = setInterval(() => {
      if (socketRef.current?.connected) {
        const { position, rotation } = latestState.current;
        socketRef.current.emit('local_move', {
          position,
          rotation,
        });
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isEnabled, teamId, localUid, localSlotId]);

  return { connectedUsers, connectedUserUids, playersState, localSlotId };
}
