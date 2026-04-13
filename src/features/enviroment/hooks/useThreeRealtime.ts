import { onDisconnect, onValue, ref, runTransaction, set } from 'firebase/database';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  isSlotId,
  PLAYER_PRESENCE_STALE_MS,
  type PlayerRealtimeState,
  type SlotClaimState,
  type SlotId,
  Vector3State,
} from '@/features/enviroment/types/realtime.ts';
import { realtimeDb } from '@/firebase.ts';

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

const UPDATE_INTERVAL_MS = 100;
const MAX_FUTURE_TIMESTAMP_DRIFT_MS = 2_000;
const SLOT_CLAIM_STALE_MS = 30_000;

function isPresenceFresh(updatedAt: number): boolean {
  const now = Date.now();
  const age = now - updatedAt;
  return age >= -MAX_FUTURE_TIMESTAMP_DRIFT_MS && age <= PLAYER_PRESENCE_STALE_MS;
}

function getPresenceRef(teamId: string, uid: string) {
  return ref(realtimeDb, `teams/${teamId}/presence/${uid}`);
}

function getPresenceRootRef(teamId: string) {
  return ref(realtimeDb, `teams/${teamId}/presence`);
}

function getSlotRef(teamId: string, slotId: SlotId) {
  return ref(realtimeDb, `teams/${teamId}/slots/${slotId}`);
}

function toSlotClaim(value: unknown): SlotClaimState | null {
  if (typeof value !== 'object' || !value) return null;
  const source = value as Record<string, unknown>;
  if (typeof source.uid !== 'string' || typeof source.clientId !== 'string') return null;
  if (typeof source.updatedAt !== 'number') return null;
  return {
    uid: source.uid,
    clientId: source.clientId,
    updatedAt: source.updatedAt,
  };
}

async function claimSlot(
  teamId: string,
  localUid: string,
  clientId: string,
): Promise<SlotId | null> {
  const candidateSlots: SlotId[] = [
    'Character_01', 'Character_02', 'Character_03',
    'Character_04', 'Character_05', 'Character_06'
  ];

  for (const slotId of candidateSlots) {
    const slotRef = getSlotRef(teamId, slotId);
    try {
      const result = await runTransaction(slotRef, (current) => {
        const now = Date.now();
        if (!current) return { uid: localUid, clientId, updatedAt: now };
        const claim = toSlotClaim(current);
        if (!claim || now - claim.updatedAt > SLOT_CLAIM_STALE_MS || claim.uid === localUid) {
          return { uid: localUid, clientId, updatedAt: now };
        }
        return;
      }, { applyLocally: false });

      if (result.committed) return slotId;
    } catch (error) {
      console.error('RTDB slot claim failed', error);
    }
  }
  return null;
}

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

  useEffect(() => {
    if (!isEnabled || !teamId || !localUid) return;

    const presenceRootRef = getPresenceRootRef(teamId);
    const unsubscribe = onValue(presenceRootRef, (snapshot) => {
      if (!snapshot.exists()) {
        setConnectedUsers(0);
        setConnectedUserUids([]);
        setPlayersState({});
        return;
      }

      const source = snapshot.val() as Record<string, any>;
      const nextUids: string[] = [];
      const nextStates: Record<string, PlayerRealtimeState> = {};
      let count = 0;

      Object.entries(source).forEach(([uid, data]) => {
        if (data.active && isPresenceFresh(data.updatedAt)) {
          count++;
          nextUids.push(uid);
          if (uid !== localUid) {
            nextStates[uid] = data as PlayerRealtimeState;
          }
        }
      });

      setConnectedUsers(count);
      setConnectedUserUids(nextUids);
      setPlayersState(nextStates);
    });

    return () => unsubscribe();
  }, [isEnabled, localUid, teamId]);

  const latestState = useRef({ position: localPosition, rotation: localRotation });
  useEffect(() => {
    latestState.current = { position: localPosition, rotation: localRotation };
  }, [localPosition, localRotation]);

  useEffect(() => {
    if (!isEnabled || !teamId || !localUid) return;

    let isDisposed = false;
    let intervalId: any = null;
    let claimedSlot: SlotId | null = null;

    const init = async () => {
      const claimed = await claimSlot(teamId, localUid, clientId);
      if (isDisposed || !claimed) return;
      claimedSlot = claimed;
      setLocalSlotId(claimed);

      const presenceRef = getPresenceRef(teamId, localUid);
      const slotRef = getSlotRef(teamId, claimed);

      onDisconnect(presenceRef).set({ active: false, updatedAt: Date.now() });
      onDisconnect(slotRef).set(null);

      intervalId = setInterval(() => {
        const now = Date.now();
        const { position, rotation } = latestState.current;

        set(presenceRef, {
          active: true,
          visible: true,
          position,
          rotation,
          clientId,
          updatedAt: now,
          slotId: claimed,
        }).catch(() => {});

        set(slotRef, { uid: localUid, clientId, updatedAt: now }).catch(() => {});
      }, UPDATE_INTERVAL_MS);
    };

    init();

    return () => {
      isDisposed = true;
      if (intervalId) clearInterval(intervalId);
      if (claimedSlot) {
        set(getPresenceRef(teamId, localUid), { active: false, updatedAt: Date.now() }).catch(() => {});
        set(getSlotRef(teamId, claimedSlot), null).catch(() => {});
      }
      setLocalSlotId(null);
    };
  }, [clientId, isEnabled, localUid, teamId]);

  return { connectedUsers, connectedUserUids, playersState, localSlotId };
}
