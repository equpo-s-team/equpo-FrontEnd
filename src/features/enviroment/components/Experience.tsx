import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useRef } from 'react';
import * as THREE from 'three';

import { type InputState } from '../hooks/usePlayerInput';
import { normalizeHealthInput, type TintEntry } from '../lib/environmentEffects';
import { CLEAN_FOG_COLOR, CLEAN_SKY_COLOR } from '../lib/physicsConstants';
import { type PlayerRealtimeState, type SlotId, type Vector3State } from '../types/realtime';
import { Diorama } from './environment/Diorama';
import { EnvironmentLighting } from './environment/EnvironmentLighting';
import { FollowCamera } from './environment/FollowCamera';
import { LocalPlayer } from './environment/LocalPlayer';
import { RemotePlayers } from './environment/RemotePlayers';

const hour = new Date().getHours();
const isNightTime = hour >= 18 || hour < 6;

const SKY_COLOR = new THREE.Color(isNightTime ? 0x0042ad : CLEAN_SKY_COLOR);
const FOG_COLOR = new THREE.Color(isNightTime ? 0x70a7ff : CLEAN_FOG_COLOR);

interface ExperienceProps {
  localUid: string | null;
  localSlotId: SlotId | null;
  remotePlayers: Record<string, PlayerRealtimeState>;
  onLocalMove: (position: Vector3State, rotation: Vector3State) => void;
  inputRef: React.MutableRefObject<InputState>;
  healthPercent: number;
  playerNames?: Record<string, string>;
  onLoaded?: () => void;
}

export default function Experience({
  localUid,
  localSlotId,
  remotePlayers,
  onLocalMove,
  inputRef,
  healthPercent,
  playerNames = {},
  onLoaded,
}: ExperienceProps) {
  const tintMapRef = useRef<Map<string, TintEntry>>(new Map());
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const deterioration = 1 - normalizeHealthInput(healthPercent);

  const localPlayerName =
    localUid && playerNames[localUid] ? playerNames[localUid] : 'Me';

  return (
    <Canvas

      shadows
      camera={{ fov: 50, near: 0.1, far: 1000, position: [-30, 10, 30] }}
      gl={{
        preserveDrawingBuffer: false,
        outputColorSpace: THREE.SRGBColorSpace,
        antialias: true,
      }}
      scene={{
        background: SKY_COLOR,
        fog: new THREE.Fog(FOG_COLOR, 20, 60),
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <FollowCamera targetRef={cameraTargetRef} hasPlayer={!!localSlotId} />

      <EnvironmentLighting deterioration={deterioration} />

      <Physics gravity={[0, -20, 0]} timeStep={1 / 60}>
        <Diorama tintMapRef={tintMapRef} onLoaded={onLoaded} />

        {localSlotId && (
          <LocalPlayer
            slotId={localSlotId}
            playerName={localPlayerName}
            inputRef={inputRef}
            onLocalMove={onLocalMove}
            cameraTargetRef={cameraTargetRef}
          />
        )}

        <RemotePlayers remotePlayers={remotePlayers} playerNames={playerNames} />
      </Physics>
    </Canvas>
  );
}
