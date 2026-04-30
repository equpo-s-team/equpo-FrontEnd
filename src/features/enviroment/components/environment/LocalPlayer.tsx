import { Html, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { BallCollider, type RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { type InputState } from '../../hooks/usePlayerInput';
import {
  GHOST_PHYSICS_RADIUS,
  GHOST_SCALE,
  GHOST_SPAWN_Y,
  GHOST_Y_OFFSET,
  GROUND_RAY_EXTRA,
  JUMP_IMPULSE,
  MOVE_SYNC_INTERVAL,
  MOVEMENT_SPEED,
  RESPAWN_Y_THRESHOLD,
  ROTATION_SPEED,
} from '../../lib/physicsConstants';
import { type SlotId, THREE_SLOT_MODELS, type Vector3State } from '../../types/realtime';

interface LocalPlayerProps {
  slotId: SlotId;
  playerName: string;
  inputRef: React.MutableRefObject<InputState>;
  onLocalMove: (position: Vector3State, rotation: Vector3State) => void;
  cameraTargetRef: React.MutableRefObject<THREE.Vector3>;
}

const LABEL_POSITION: [number, number, number] = [0, 2, 0];

export function LocalPlayer({
  slotId,
  playerName,
  inputRef,
  onLocalMove,
  cameraTargetRef,
}: LocalPlayerProps) {
  const modelPath = `/models/${THREE_SLOT_MODELS[slotId]}`;
  const { scene } = useGLTF(modelPath);
  const clonedScene = useRef<THREE.Group | null>(null);

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const rotationY = useRef(0);
  const lastMoveSync = useRef(0);
  const { rapier, world } = useRapier();

  // Clone scene so multiple players don't share the same object
  useEffect(() => {
    clonedScene.current = scene.clone(true);
  }, [scene]);

  const smoothFactor = useCallback((factor: number, delta: number) => {
    return 1 - Math.pow(1 - factor, delta * 60);
  }, []);

  useFrame((_, delta) => {
    const body = rigidBodyRef.current;
    if (!body) return;

    const { forward, backward, left, right, jump } = inputRef.current;
    const dir = new THREE.Vector3(
      (right ? 1 : 0) - (left ? 1 : 0),
      0,
      (backward ? 1 : 0) - (forward ? 1 : 0),
    );

    const isMoving = dir.lengthSq() > 0;
    const pos = body.translation();

    if (jump) {
      const ray = new rapier.Ray(
        { x: pos.x, y: pos.y, z: pos.z },
        { x: 0, y: -1, z: 0 },
      );
      const maxToi = GHOST_PHYSICS_RADIUS + GROUND_RAY_EXTRA;
      const hit = world.castRay(ray, maxToi, true);
      if (hit && hit.timeOfImpact <= maxToi) {
        const vel = body.linvel();
        body.setLinvel({ x: vel.x, y: JUMP_IMPULSE, z: vel.z }, true);
      }
      inputRef.current.jump = false;
    }

    if (isMoving) {
      dir.normalize();
      const vel = body.linvel();
      body.setLinvel(
        { x: dir.x * MOVEMENT_SPEED, y: vel.y, z: dir.z * MOVEMENT_SPEED },
        true,
      );

      const targetRotation = Math.atan2(dir.x, dir.z);
      rotationY.current = THREE.MathUtils.lerp(
        rotationY.current,
        targetRotation,
        smoothFactor(ROTATION_SPEED / 60, delta),
      );
    } else {
      const vel = body.linvel();
      body.setLinvel({ x: 0, y: vel.y, z: 0 }, true);
    }

    // Respawn if fallen
    if (pos.y < RESPAWN_Y_THRESHOLD) {
      body.setTranslation({ x: 0, y: GHOST_SPAWN_Y, z: 0 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Sync mesh to body
    if (meshRef.current) {
      meshRef.current.position.set(pos.x, pos.y + GHOST_Y_OFFSET, pos.z);
      meshRef.current.rotation.y = rotationY.current;
    }

    // Update camera target
    cameraTargetRef.current.set(pos.x, pos.y, pos.z);

    // Broadcast move
    const now = performance.now();
    if (isMoving && now - lastMoveSync.current > MOVE_SYNC_INTERVAL) {
      lastMoveSync.current = now;
      onLocalMove(
        { x: pos.x, y: pos.y, z: pos.z },
        { x: 0, y: rotationY.current, z: 0 },
      );
    }
  });

  return (
    <>
      {/* Physics body — invisible capsule */}
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        position={[0, GHOST_SPAWN_Y, 0]}
        linearDamping={4}
        angularDamping={10}
        lockRotations
        mass={10}
      >
        <BallCollider args={[GHOST_PHYSICS_RADIUS]} />
      </RigidBody>

      {/* Visible mesh */}
      <group ref={meshRef}>
        {clonedScene.current && (
          <primitive object={clonedScene.current} scale={GHOST_SCALE} />
        )}
        <Html position={LABEL_POSITION} center distanceFactor={25} zIndexRange={[0, 5]}>
          <div className="px-2 py-1 text-md font-maxwell font-bold text-white bg-black/30 rounded backdrop-blur-sm pointer-events-none whitespace-nowrap">
            {playerName}
          </div>
        </Html>
      </group>
    </>
  );
}
