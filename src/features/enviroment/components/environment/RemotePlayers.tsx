import { Html, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { GHOST_SCALE, GHOST_Y_OFFSET } from '../../lib/physicsConstants';
import { type SlotId, THREE_SLOT_MODELS, type Vector3State } from '../../types/realtime';

interface RemotePlayerState {
  position: Vector3State;
  rotation: Vector3State;
  slotId: SlotId | null;
  updatedAt: number;
}

interface RemoteGhostProps {
  playerName: string;
  state: RemotePlayerState;
}

const LABEL_POSITION: [number, number, number] = [0, 2.5, 0];
const LERP_FACTOR = 0.2;

function RemoteGhost({ playerName, state }: RemoteGhostProps) {
  const modelPath = state.slotId ? `/models/${THREE_SLOT_MODELS[state.slotId]}` : null;
  const { scene } = useGLTF(modelPath ?? '/models/blueGhost.glb');
  const clonedScene = useRef<THREE.Group | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const hasInitialized = useRef(false);
  const lastUpdatedAt = useRef(0);

  const targetPos = useRef(new THREE.Vector3(state.position.x, state.position.y, state.position.z));
  const targetRotY = useRef(state.rotation.y);

  useEffect(() => {
    clonedScene.current = scene.clone(true);
  }, [scene]);

  // Track latest state changes
  useEffect(() => {
    if (state.updatedAt < lastUpdatedAt.current) {
      return;
    }
    lastUpdatedAt.current = state.updatedAt;
    targetPos.current.set(state.position.x, state.position.y + GHOST_Y_OFFSET, state.position.z);
    targetRotY.current = state.rotation.y;
    if (!hasInitialized.current && groupRef.current) {
      groupRef.current.position.copy(targetPos.current);
      groupRef.current.rotation.y = targetRotY.current;
      hasInitialized.current = true;
    }
  }, [state.position.x, state.position.y, state.position.z, state.rotation.y, state.updatedAt]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const smooth = 1 - Math.pow(1 - LERP_FACTOR, delta * 60);
    groupRef.current.position.lerp(targetPos.current, smooth);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY.current,
      smooth,
    );
  });

  return (
    <group ref={groupRef}>
      {clonedScene.current && <primitive object={clonedScene.current} scale={GHOST_SCALE} />}
      <Html position={LABEL_POSITION} center distanceFactor={15} zIndexRange={[0, 10]}>
        <div className="px-2 py-1 text-xs font-bold text-white bg-black/60 rounded backdrop-blur-sm pointer-events-none whitespace-nowrap transition-all">
          {playerName}
        </div>
      </Html>
    </group>
  );
}

interface RemotePlayersProps {
  remotePlayers: Record<string, RemotePlayerState>;
  playerNames: Record<string, string>;
}

export function RemotePlayers({ remotePlayers, playerNames }: RemotePlayersProps) {
  return (
    <>
      {Object.entries(remotePlayers).map(([uid, state]) => {
        if (!state.slotId) return null;
        return <RemoteGhost key={uid} playerName={playerNames[uid] || 'Player'} state={state} />;
      })}
    </>
  );
}
