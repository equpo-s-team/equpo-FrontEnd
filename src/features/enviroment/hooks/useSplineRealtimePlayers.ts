import { onDisconnect, onValue, ref, set } from 'firebase/database';
import { useEffect, useMemo } from 'react';

import {
  PLAYER_PRESENCE_STALE_MS,
  type PlayerKey,
  type PlayerRealtimeState,
  SPLINE_PLAYER_IDS,
  SPLINE_PLAYER_NAMES,
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

interface SplineRuntimeApp {
  findObjectById: (id: string) => unknown;
  findObjectByName?: (name: string) => unknown;
}

interface UseSplineRealtimePlayersParams {
  app: SplineRuntimeApp | null;
  localPlayer: PlayerKey | null;
  isEnabled: boolean;
}

const UPDATE_INTERVAL_MS = 100;
const MAX_FUTURE_TIMESTAMP_DRIFT_MS = 2_000;

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

  return {
    active: typeof source.active === 'boolean' ? source.active : fallback.active,
    visible: typeof source.visible === 'boolean' ? source.visible : fallback.visible,
    position: toVector3(source.position, fallback.position),
    rotation: toVector3(source.rotation, fallback.rotation),
    clientId: typeof source.clientId === 'string' ? source.clientId : fallback.clientId,
    updatedAt: isFiniteNumber(source.updatedAt) ? source.updatedAt : fallback.updatedAt,
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

function resolveSplineObject(
  app: SplineRuntimeApp,
  playerKey: PlayerKey,
  objectId: string,
): SplineSceneObject | null {
  const compactId = objectId.replace(/-/g, '');
  const candidates = [objectId, objectId.toLowerCase(), objectId.toUpperCase(), compactId];

  for (const candidateId of candidates) {
    const maybeObject = app.findObjectById(candidateId);
    const object = asSplineSceneObject(maybeObject);

    if (object) {
      return object;
    }
  }

  if (app.findObjectByName) {
    const objectByName = asSplineSceneObject(app.findObjectByName(SPLINE_PLAYER_NAMES[playerKey]));

    if (objectByName) {
      return objectByName;
    }
  }

  return null;
}

function getPlayerRef(dbPath: PlayerKey) {
  return ref(realtimeDb, `users/${dbPath}`);
}

export function useSplineRealtimePlayers({
  app,
  localPlayer,
  isEnabled,
}: UseSplineRealtimePlayersParams): void {
  const clientId = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    if (!app || !isEnabled || !localPlayer) {
      return;
    }

    const unsubscribers = (Object.keys(SPLINE_PLAYER_IDS) as PlayerKey[]).map((playerKey) => {
      const splineObjectId = SPLINE_PLAYER_IDS[playerKey];
      const object = resolveSplineObject(app, playerKey, splineObjectId);
      const playerRef = getPlayerRef(playerKey);

      if (!object) {
        console.warn(`Failed to find object for player ${playerKey}`);
        return () => undefined;
      }

      object.visible = playerKey === localPlayer;

      return onValue(playerRef, (snapshot) => {
        if (!snapshot.exists()) {
          object.visible = playerKey === localPlayer;
          return;
        }

        const fallbackState: PlayerRealtimeState = {
          active: playerKey === localPlayer,
          visible: object.visible,
          position: {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
          },
          rotation: {
            x: object.rotation.x,
            y: object.rotation.y,
            z: object.rotation.z,
          },
          clientId,
          updatedAt: Date.now(),
        };

        const data = toRealtimeState(snapshot.val(), fallbackState);
        const isFresh = isPresenceFresh(data.updatedAt);

        object.visible = data.active && data.visible && isFresh;
        object.position.x = data.position.x;
        object.position.y = data.position.y;
        object.position.z = data.position.z;
        object.rotation.x = data.rotation.x;
        object.rotation.y = data.rotation.y;
        object.rotation.z = data.rotation.z;
      }, (error) => {
        console.error(`RTDB read error for ${playerKey}:`, error);
      });
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [app, clientId, isEnabled, localPlayer]);

  useEffect(() => {
    if (!app || !isEnabled || !localPlayer) {
      return;
    }

    const splineObjectId = SPLINE_PLAYER_IDS[localPlayer];
    const localObject = resolveSplineObject(app, localPlayer, splineObjectId);

    if (!localObject) {
      return;
    }

    const playerRef = getPlayerRef(localPlayer);
    const disconnectHandler = onDisconnect(playerRef);

    localObject.visible = true;

    void disconnectHandler.update({
      active: false,
      visible: false,
      updatedAt: Date.now(),
      clientId,
    });

    const publishState = () => {
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
        updatedAt: Date.now(),
      };

      set(playerRef, payload).catch((error: unknown) => {
        console.error('RTDB write error:', error);
      });
    };

    publishState();

    const intervalId = window.setInterval(publishState, UPDATE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);

      set(playerRef, {
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
      }).catch((error: unknown) => {
        console.error('RTDB cleanup write error:', error);
      });

      localObject.visible = false;
    };
  }, [app, clientId, isEnabled, localPlayer]);
}







