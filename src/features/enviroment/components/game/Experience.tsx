import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

import { type InputState } from '../../hooks/usePlayerInput.ts';
import { normalizeHealthInput, type TintEntry } from '../../lib/environmentEffects.ts';
import { CLEAN_FOG_COLOR, CLEAN_SKY_COLOR } from '../../lib/physicsConstants.ts';
import { type PlayerRealtimeState, type SlotId, type Vector3State } from '../../types/realtime.ts';
import { Diorama } from '@/features/enviroment/components/game/Diorama.tsx';
import { EnvironmentLighting } from '@/features/enviroment/components/game/EnvironmentLighting.tsx';
import { FollowCamera } from '@/features/enviroment/components/game/FollowCamera.tsx';
import { LocalPlayer } from '@/features/enviroment/components/game/LocalPlayer.tsx';
import { ProximityButtons } from '@/features/enviroment/components/game/ProximityButtons.tsx';
import { RemotePlayers } from '@/features/enviroment/components/game/RemotePlayers.tsx';
import { FeedingDucks } from '@/features/enviroment/components/game/FeedingDucks.tsx';
import { RaccoonQuotes } from '@/features/enviroment/components/game/interactions/RaccoonQuotes.tsx';
import { PROXIMITY_POINTS } from "@/features/enviroment/config/proximityPoints.ts";

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


  const [currentInteraction, setCurrentInteraction] = useState<{
    type: string;
    position: [number, number, number];
  } | null>(null);

  const handleProximityEvents = useMemo(() => ({
    onFeedDucks: (pointId: string) => {
      console.log('Feeding ducks at:', pointId);
      const point = PROXIMITY_POINTS.find(p => p.id === pointId);

      if (point) {
        setCurrentInteraction({
          type: 'duck-feeding',
          position: point.position
        });
      }
    },
    onRaccoonQuotes: (pointId: string) => {
      console.log('Raccoon quotes at:', pointId);
      const point = PROXIMITY_POINTS.find(p => p.id === pointId);

      if (point) {
        setCurrentInteraction({
          type: 'raccoon-quotes',
          position: point.position
        });
      }
    }
  }), []);

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
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

      <ProximityButtons
        eventHandlers={handleProximityEvents}
      />

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

        <FeedingDucks
          position={[-0, 0.5, 5]}
          playAnimation={currentInteraction?.type === 'duck-feeding'}
          onComplete={() => setCurrentInteraction(null)}
        />

        <RaccoonQuotes
          position={[13, 0.5, -5]}
          isInteracting={currentInteraction?.type === 'raccoon-quotes'}
          onComplete={() => setCurrentInteraction(null)}
        />
      </Physics>
    </Canvas>
  );
}
