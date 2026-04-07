import { onDisconnect, onValue, ref, runTransaction, set } from 'firebase/database';
import { useEffect, useMemo, useState } from 'react';

import {
  isSlotId,
  PLAYER_PRESENCE_STALE_MS,
  type PlayerRealtimeState,
  SPLINE_SLOT_OBJECT_IDS,
  SPLINE_SLOT_IDS,
  type SlotClaimState,
  type SlotId,
} from '@/features/enviroment/types/realtime.ts';
import { realtimeDb } from '@/firebase.ts';

interface SplineVector3 {
  x: number;
  y: number;
  z: number;
}

interface SplineSceneObject {
  visible: boolean;
  position: SplineVector3;
  rotation: SplineVector3;
}

interface SplineRuntimeObject extends SplineSceneObject {
  name?: string;
  uuid?: string;
  id?: string;
}

interface SplineRuntimeApp {
  findObjectById: (id: string) => unknown;
  findObjectByName?: (name: string) => unknown;
  getAllObjects?: () => unknown[];
}

interface UseSplineRealtimePlayersParams {
  app: SplineRuntimeApp | null;
  teamId: string | null;
  localUid: string | null;
  isEnabled: boolean;
  isSceneReady: boolean;
}

interface SplinePresenceSnapshot {
  connectedUsers: number;
  connectedUserUids: string[];
}

const UPDATE_INTERVAL_MS = 100;
const MAX_FUTURE_TIMESTAMP_DRIFT_MS = 2_000;
const SLOT_CLAIM_STALE_MS = 30_000;
const SLOT_DISCOVERY_RETRY_MS = 750;
const LOCAL_CONTROLLED_SLOT_ID: SlotId = 'Character_02';
const warnedMissingSlots = new Set<SlotId>();
let hasLoggedSlotPermissionError = false;

function isPresenceFresh(updatedAt: number): boolean {
  const now = Date.now();
  const age = now - updatedAt;

  return age >= -MAX_FUTURE_TIMESTAMP_DRIFT_MS && age <= PLAYER_PRESENCE_STALE_MS;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function toVector3(value: unknown, fallback: SplineVector3): SplineVector3 {
  const source = typeof value === 'object' && value ? (value as Record<string, unknown>) : {};

  return {
    x: isFiniteNumber(source.x) ? source.x : fallback.x,
    y: isFiniteNumber(source.y) ? source.y : fallback.y,
    z: isFiniteNumber(source.z) ? source.z : fallback.z,
  };
}

function toRealtimeState(value: unknown, fallback: PlayerRealtimeState): PlayerRealtimeState {
  const source = typeof value === 'object' && value ? (value as Record<string, unknown>) : {};
  const slotId = isSlotId(source.slotId) ? source.slotId : fallback.slotId;

  return {
    active: typeof source.active === 'boolean' ? source.active : fallback.active,
    visible: typeof source.visible === 'boolean' ? source.visible : fallback.visible,
    position: toVector3(source.position, fallback.position),
    rotation: toVector3(source.rotation, fallback.rotation),
    clientId: typeof source.clientId === 'string' ? source.clientId : fallback.clientId,
    updatedAt: isFiniteNumber(source.updatedAt) ? source.updatedAt : fallback.updatedAt,
    slotId,
  };
}

function asSplineSceneObject(value: unknown): SplineSceneObject | null {
  if (typeof value !== 'object' || !value) {
    return null;
  }

  const candidate = value as Partial<SplineSceneObject>;

  if (!candidate.position || !candidate.rotation) {
    return null;
  }

  return candidate as SplineSceneObject;
}

function asSplineRuntimeObject(value: unknown): SplineRuntimeObject | null {
  const object = asSplineSceneObject(value);

  if (!object || typeof value !== 'object' || !value) {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  return {
    ...object,
    name: typeof candidate.name === 'string' ? candidate.name : undefined,
    uuid: typeof candidate.uuid === 'string' ? candidate.uuid : undefined,
    id: typeof candidate.id === 'string' ? candidate.id : undefined,
  };
}

function parseSlotIdFromName(name: string): SlotId | null {
  const match = name.trim().match(/^Character(?:_|\s)?0?([1-6])$/i);

  if (!match) {
    return null;
  }

  return `Character_0${match[1]}` as SlotId;
}

function toComparableId(value: string): string {
  return value.replace(/-/g, '').toLowerCase();
}

function getCatalogSlotObjects(app: SplineRuntimeApp): Map<SlotId, SplineSceneObject> {
  const catalog = new Map<SlotId, SplineSceneObject>();

  if (!app.getAllObjects) {
    return catalog;
  }

  let objects: unknown[];

  try {
    objects = app.getAllObjects();
  } catch (error) {
    console.error('Failed to read Spline object catalog via getAllObjects():', error);
    return catalog;
  }

  const mappedIdsBySlot = new Map<string, SlotId>();

  for (const slotId of SPLINE_SLOT_IDS) {
    const mappedId = SPLINE_SLOT_OBJECT_IDS[slotId];
    mappedIdsBySlot.set(toComparableId(mappedId), slotId);
  }

  for (const rawObject of objects) {
    const object = asSplineRuntimeObject(rawObject);

    if (!object) {
      continue;
    }

    const byName = object.name ? parseSlotIdFromName(object.name) : null;

    if (byName && !catalog.has(byName)) {
      catalog.set(byName, object);
      continue;
    }

    const rawId = object.uuid ?? object.id;

    if (!rawId) {
      continue;
    }

    const byMappedId = mappedIdsBySlot.get(toComparableId(rawId));

    if (byMappedId && !catalog.has(byMappedId)) {
      catalog.set(byMappedId, object);
    }
  }

  return catalog;
}

function resolveSplineObject(
  app: SplineRuntimeApp,
  slotId: SlotId,
): SplineSceneObject | null {
  const mappedObjectId = SPLINE_SLOT_OBJECT_IDS[slotId];
  const slotNumber = slotId.split('_')[1] ?? '';
  const unpaddedNumber = String(Number(slotNumber));
  const compactId = slotId.replace('_', '');
  const nameCandidates = [
    slotId,
    slotId.toLowerCase(),
    slotId.toUpperCase(),
    `Character_${unpaddedNumber}`,
    `character_${unpaddedNumber}`,
    `Character ${slotNumber}`,
    `Character${slotNumber}`,
    `Character${unpaddedNumber}`,
  ];
  const idCandidates = [
    mappedObjectId,
    mappedObjectId.toUpperCase(),
    mappedObjectId.replace(/-/g, ''),
    mappedObjectId.replace(/-/g, '').toUpperCase(),
    slotId,
    slotId.toLowerCase(),
    slotId.toUpperCase(),
    compactId,
  ];

  if (app.findObjectByName) {
    for (const candidateName of nameCandidates) {
      const objectByName = asSplineSceneObject(app.findObjectByName(candidateName));

      if (objectByName) {
        return objectByName;
      }
    }
  }

  for (const candidateId of idCandidates) {
    const maybeObject = app.findObjectById(candidateId);
    const object = asSplineSceneObject(maybeObject);

    if (object) {
      return object;
    }
  }

  return null;
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

function getSlotObjects(app: SplineRuntimeApp): Map<SlotId, SplineSceneObject> {
  const objects = new Map<SlotId, SplineSceneObject>();
  const catalogObjects = getCatalogSlotObjects(app);

  for (const slotId of SPLINE_SLOT_IDS) {
    let object: SplineSceneObject | null = null;

    try {
      const resolvedObject = resolveSplineObject(app, slotId);
      const catalogObject = catalogObjects.get(slotId) ?? null;
      object = resolvedObject ?? catalogObject;
    } catch (error) {
      console.error(`Failed to resolve spline object for slot ${slotId}:`, error);
      object = null;
    }

    if (!object) {
      if (!warnedMissingSlots.has(slotId)) {
        warnedMissingSlots.add(slotId);
        console.warn(
          `Failed to find spline object for slot ${slotId}. ` +
            'Verify names/UUIDs in scene.splinecode and realtime slot mapping.',
        );
      }
      continue;
    }

    object.visible = false;
    objects.set(slotId, object);
  }

  return objects;
}

function toSlotClaim(value: unknown): SlotClaimState | null {
  if (typeof value !== 'object' || !value) {
    return null;
  }

  const source = value as Record<string, unknown>;

  if (typeof source.uid !== 'string' || typeof source.clientId !== 'string') {
    return null;
  }

  if (!isFiniteNumber(source.updatedAt)) {
    return null;
  }

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
  candidateSlots: SlotId[],
): Promise<SlotId | null> {
  for (const slotId of candidateSlots) {
    const slotRef = getSlotRef(teamId, slotId);

    let result;

    try {
      result = await runTransaction(
        slotRef,
        (current) => {
          const now = Date.now();

          if (!current) {
            return { uid: localUid, clientId, updatedAt: now };
          }

          const claim = toSlotClaim(current);

          if (!claim) {
            return { uid: localUid, clientId, updatedAt: now };
          }

          const isOwnedByUser = claim.uid === localUid;
          const isStale = now - claim.updatedAt > SLOT_CLAIM_STALE_MS;

          if (isOwnedByUser || isStale) {
            return { uid: localUid, clientId, updatedAt: now };
          }

          return;
        },
        { applyLocally: false },
      );
    } catch (error) {
      if (!hasLoggedSlotPermissionError) {
        hasLoggedSlotPermissionError = true;
        console.error('RTDB slot claim failed. Check teams/{teamId}/slots rules and auth.', error);
      }

      return null;
    }

    if (!result.committed) {
      continue;
    }

    const claim = toSlotClaim(result.snapshot.val());

    if (claim?.uid === localUid) {
      return slotId;
    }
  }

  return null;
}

function releaseSlot(teamId: string, slotId: SlotId, localUid: string, clientId: string): void {
  const slotRef = getSlotRef(teamId, slotId);

  runTransaction(
    slotRef,
    (current) => {
      const claim = toSlotClaim(current);

      if (!claim) {
        return null;
      }

      const isOwner = claim.uid === localUid && claim.clientId === clientId;

      if (isOwner) {
        return null;
      }

      return current;
    },
    { applyLocally: false },
  ).catch((error: unknown) => {
    console.error('RTDB slot release error:', error);
  });
}

export function useSplineRealtimePlayers({
  app,
  teamId,
  localUid,
  isEnabled,
  isSceneReady,
}: UseSplineRealtimePlayersParams): SplinePresenceSnapshot {
  const clientId = useMemo(() => crypto.randomUUID(), []);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [connectedUserUids, setConnectedUserUids] = useState<string[]>([]);
  const [slotDiscoveryTick, setSlotDiscoveryTick] = useState(0);

  useEffect(() => {
    if (!app || !isSceneReady || !isEnabled || !teamId || !localUid) {
      setConnectedUsers(0);
      setConnectedUserUids([]);
      return;
    }

    const slotObjects = getSlotObjects(app);
    if (slotObjects.size === 0) {
      const retryId = globalThis.setTimeout(() => {
        setSlotDiscoveryTick((tick) => tick + 1);
      }, SLOT_DISCOVERY_RETRY_MS);

      return () => {
        globalThis.clearTimeout(retryId);
      };
    }

    const presenceRootRef = getPresenceRootRef(teamId);

    const unsubscribe = onValue(presenceRootRef, (snapshot) => {
      if (!snapshot.exists()) {
        setConnectedUsers(0);
        setConnectedUserUids([]);
        return;
      }

      const source: unknown = snapshot.val();

      if (typeof source !== 'object' || !source) {
        setConnectedUsers(0);
        setConnectedUserUids([]);
        return;
      }

      const entries = Object.entries(source as Record<string, unknown>);
      let mySlotId: SlotId | null = null;

      for (const [uid, entry] of entries) {
        if (uid === localUid) {
          const fallbackState: PlayerRealtimeState = {
            active: false,
            visible: false,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            clientId,
            updatedAt: 0,
            slotId: null,
          };
          const data = toRealtimeState(entry, fallbackState);
          mySlotId = data.slotId;
          break;
        }
      }

      slotObjects.forEach((object, slotId) => {
        if (slotId === mySlotId) {
          return;
        }

        object.visible = false;
      });
      let nextConnectedUsers = 0;
      const nextConnectedUserUids: string[] = [];

      for (const [uid, entry] of entries) {
        const fallbackState: PlayerRealtimeState = {
          active: false,
          visible: false,
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          clientId,
          updatedAt: 0,
          slotId: null,
        };
        const data = toRealtimeState(entry, fallbackState);

        if (data.active && isPresenceFresh(data.updatedAt)) {
          nextConnectedUsers += 1;
          nextConnectedUserUids.push(uid);
        }

        if (uid === localUid) {
          continue;
        }

        if (!data.slotId) {
          continue;
        }

        if (!data.active || !data.visible || !isPresenceFresh(data.updatedAt)) {
          continue;
        }

        const object = slotObjects.get(data.slotId);

        if (!object) {
          continue;
        }

        object.visible = true;
        object.position.x = data.position.x;
        object.position.y = data.position.y;
        object.position.z = data.position.z;
        object.rotation.x = data.rotation.x;
        object.rotation.y = data.rotation.y;
        object.rotation.z = data.rotation.z;
      }

      setConnectedUsers((current) => (current === nextConnectedUsers ? current : nextConnectedUsers));
      setConnectedUserUids(nextConnectedUserUids);
    }, (error) => {
      console.error(`RTDB presence read error for team ${teamId}:`, error);
    });

    return () => {
      slotObjects.forEach((object) => {
        object.visible = false;
      });
      setConnectedUsers(0);
      setConnectedUserUids([]);
      unsubscribe();
    };
  }, [app, clientId, isEnabled, isSceneReady, localUid, slotDiscoveryTick, teamId]);

  useEffect(() => {
    if (!app || !isSceneReady || !isEnabled || !teamId || !localUid) {
      return;
    }

    const slotObjects = getSlotObjects(app);
    if (slotObjects.size === 0) {
      const retryId = globalThis.setTimeout(() => {
        setSlotDiscoveryTick((tick) => tick + 1);
      }, SLOT_DISCOVERY_RETRY_MS);

      return () => {
        globalThis.clearTimeout(retryId);
      };
    }

    let intervalId: ReturnType<typeof globalThis.setInterval> | null = null;
    let localSlotId: SlotId | null = null;
    let localObject: SplineSceneObject | null = null;
    let isDisposed = false;

    let rafId: number | null = null;

    const initialize = async () => {
      const availableSlots = [...slotObjects.keys()].filter(id => id !== LOCAL_CONTROLLED_SLOT_ID);
      const claimedSlotId = await claimSlot(teamId, localUid, clientId, availableSlots);

      if (isDisposed || !claimedSlotId) {
        return;
      }

      localSlotId = claimedSlotId;

      const claimedObject = slotObjects.get(claimedSlotId) ?? null;
      const controlledObject = slotObjects.get(LOCAL_CONTROLLED_SLOT_ID) ?? null;
      localObject = controlledObject ?? claimedObject;

      if (!localObject) {
        return;
      }

      if (controlledObject && claimedObject && controlledObject !== claimedObject) {
         controlledObject.visible = false;
         claimedObject.visible = true;
         
         const syncLocalVisuals = () => {
             claimedObject.position.x = controlledObject.position.x;
             claimedObject.position.y = controlledObject.position.y;
             claimedObject.position.z = controlledObject.position.z;
             claimedObject.rotation.x = controlledObject.rotation.x;
             claimedObject.rotation.y = controlledObject.rotation.y;
             claimedObject.rotation.z = controlledObject.rotation.z;
             rafId = globalThis.requestAnimationFrame(syncLocalVisuals);
         };
         syncLocalVisuals();
      } else if (controlledObject) {
         controlledObject.visible = true;
      }

      const presenceRef = getPresenceRef(teamId, localUid);
      const slotRef = getSlotRef(teamId, claimedSlotId);
      const presenceDisconnect = onDisconnect(presenceRef);
      const slotDisconnect = onDisconnect(slotRef);

      void presenceDisconnect.set({
        active: false,
        visible: false,
        position: {
          x: localObject.position.x,
          y: localObject.position.y,
          z: localObject.position.z,
        },
        rotation: {
          x: localObject.rotation.x,
          y: localObject.rotation.y,
          z: localObject.rotation.z,
        },
        clientId,
        updatedAt: Date.now(),
        slotId: null,
      });

      void slotDisconnect.set(null);
      localObject.visible = true;

      const publishState = () => {
        if (!localObject || !localSlotId) {
          return;
        }

        const now = Date.now();
        const payload: PlayerRealtimeState = {
          active: true,
          visible: true,
          position: {
            x: localObject.position.x,
            y: localObject.position.y,
            z: localObject.position.z,
          },
          rotation: {
            x: localObject.rotation.x,
            y: localObject.rotation.y,
            z: localObject.rotation.z,
          },
          clientId,
          updatedAt: now,
          slotId: localSlotId,
        };

        set(slotRef, { uid: localUid, clientId, updatedAt: now }).catch((error: unknown) => {
          console.error('RTDB slot heartbeat error:', error);
        });

        set(presenceRef, payload).catch((error: unknown) => {
          console.error('RTDB presence write error:', error);
        });
      };

      publishState();
      intervalId = globalThis.setInterval(publishState, UPDATE_INTERVAL_MS);
    };

    void initialize().catch((error: unknown) => {
      console.error('Failed to initialize realtime spline players:', error);
    });

    return () => {
      isDisposed = true;

      if (intervalId !== null) {
        globalThis.clearInterval(intervalId);
      }
      
      if (rafId !== null) {
        globalThis.cancelAnimationFrame(rafId);
      }

      if (localObject) {
        localObject.visible = false;
      }

      if (localSlotId) {
        const presenceRef = getPresenceRef(teamId, localUid);

        set(presenceRef, {
          active: false,
          visible: false,
          position: {
            x: localObject?.position.x ?? 0,
            y: localObject?.position.y ?? 0,
            z: localObject?.position.z ?? 0,
          },
          rotation: {
            x: localObject?.rotation.x ?? 0,
            y: localObject?.rotation.y ?? 0,
            z: localObject?.rotation.z ?? 0,
          },
          clientId,
          updatedAt: Date.now(),
          slotId: null,
        }).catch((error: unknown) => {
          console.error('RTDB cleanup presence write error:', error);
        });

        releaseSlot(teamId, localSlotId, localUid, clientId);
      }

      slotObjects.forEach((object) => {
        object.visible = false;
      });
    };
  }, [app, clientId, isEnabled, isSceneReady, localUid, slotDiscoveryTick, teamId]);

  return {
    connectedUsers,
    connectedUserUids,
  };
}

