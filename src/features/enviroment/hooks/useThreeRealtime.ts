import { useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import {
  type PlayerRealtimeState,
  type SlotId,
  uidToModelId,
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

// 12 FPS update rate (approx 83ms)
const UPDATE_INTERVAL_MS = 83;

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

  // Assign model immediately from UID — no server dependency
  useEffect(() => {
    if (localUid) {
      setLocalSlotId(uidToModelId(localUid));
    } else {
      setLocalSlotId(null);
    }
  }, [localUid]);

  // ── Socket connection ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isEnabled || !teamId || !localUid) {
      setPlayersState({});
      setConnectedUsers(0);
      setConnectedUserUids([]);
      return;
    }

    const uid = localUid; // stable reference for closures
    const wsUrl = new URL(BASE_URL).origin;

    const socket = io(wsUrl, {
      query: { teamId, uid },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // ── Helper: update connected user counts ──────────────────────────
    function updateCounts(fullState: Record<string, PlayerRealtimeState>) {
      const uids: string[] = [];
      let count = 0;
      for (const [playerUid, state] of Object.entries(fullState)) {
        if (state.active) {
          count++;
          uids.push(playerUid);
        }
      }
      setConnectedUsers(count);
      setConnectedUserUids(uids);
    }

    // ── Helper: extract remote players (exclude self) ─────────────────
    function extractRemotePlayers(
      fullState: Record<string, PlayerRealtimeState>,
    ): Record<string, PlayerRealtimeState> {
      const states: Record<string, PlayerRealtimeState> = {};
      for (const [playerUid, state] of Object.entries(fullState)) {
        if (state.active && playerUid !== uid) {
          states[playerUid] = state;
        }
      }
      return states;
    }

    socket.on('connect', () => {
      socket.emit('join_room', { clientId });
    });

    // ── initial_state: full replace (sent from join_room on server) ──
    socket.on('initial_state', (state: Record<string, PlayerRealtimeState>) => {
      updateCounts(state);
      setPlayersState(extractRemotePlayers(state));
    });

    // ── room_sync: smart merge (preserves interpolated positions) ─────
    socket.on('room_sync', (state: Record<string, PlayerRealtimeState>) => {
      updateCounts(state);

      setPlayersState(prev => {
        const next: Record<string, PlayerRealtimeState> = {};
        for (const [playerUid, playerState] of Object.entries(state)) {
          if (playerUid === uid || !playerState.active) continue;
          // Preserve existing position data for smooth interpolation
          next[playerUid] = prev[playerUid] ?? playerState;
        }
        return next;
      });
    });

    // ── player_moved: high-frequency individual position updates ──────
    socket.on('player_moved', ({ uid: movedUid, state }: { uid: string; state: PlayerRealtimeState }) => {
      if (movedUid === uid) return;
      setPlayersState(prev => ({ ...prev, [movedUid]: state }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isEnabled, teamId, localUid, clientId]);

  // Interval for sending local movement updates
  useEffect(() => {
    if (!isEnabled || !teamId || !localUid || !localSlotId) return;

    const intervalId = setInterval(() => {
      if (socketRef.current?.connected) {
        const { position, rotation } = latestState.current;
        socketRef.current.emit('local_move', { position, rotation });
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isEnabled, teamId, localUid, localSlotId]);

  return { connectedUsers, connectedUserUids, playersState, localSlotId };
}

