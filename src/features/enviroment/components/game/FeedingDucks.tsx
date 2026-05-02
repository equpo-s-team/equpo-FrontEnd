import { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';
import { HeartParticles } from './particles/HeartParticles.tsx';
import { useSoundEffects } from '@/hooks/useSoundEffects.ts';

interface DucksModelProps {
  position?: [number, number, number];
  playAnimation?: boolean;
  onComplete?: () => void;
}

export function FeedingDucks({
  position = [-18, 2, 40],
  playAnimation = false,
  onComplete
}: DucksModelProps) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF('/models/ducks.glb');
  const { actions, names } = useAnimations(animations, group);
  const [showParticles, setShowParticles] = useState(false);
  const { play } = useSoundEffects();

  useEffect(() => {
    if (!playAnimation) return;

    const activeActions: THREE.AnimationAction[] = [];

    names.forEach((clipName) => {
      const action = actions[clipName];
      if (action) {
        action.reset().setLoop(THREE.LoopOnce, 1).play();
        action.clampWhenFinished = true;

        action.setEffectiveTimeScale(1.25);

        activeActions.push(action);
      }
    });

    return () => {
      activeActions.forEach(action => action.stop());
    };
  }, [playAnimation, actions, names]);

  useEffect(() => {
    if (playAnimation && !showParticles) {
      setShowParticles(true);
      play('duckFeeding');
    }
  }, [playAnimation, showParticles, play]);

  const handleParticlesComplete = () => {
    setShowParticles(false);
    onComplete?.();
  };

  return (
    <>
      <group ref={group} position={position} scale={[5, 5, 5]}>
        <primitive object={scene} />
      </group>

      {showParticles && (
        <HeartParticles
          position={[position[0] - 5, position[1], position[2]]}
          count={15}
          onComplete={handleParticlesComplete}
        />
      )}
    </>
  );
}

useGLTF.preload('/models/ducks.glb');
