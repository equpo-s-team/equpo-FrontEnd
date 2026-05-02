import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Group } from 'three';
import { useSoundEffects } from '@/hooks/useSoundEffects.ts';

interface RaccoonQuotesProps {
  position?: [number, number, number];
  isInteracting?: boolean;
  onComplete?: () => void;
}

export function RaccoonQuotes({
  position = [65, 4, -35],
  isInteracting = false,
  onComplete
}: RaccoonQuotesProps) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF('/models/raccoon.glb');
  const { play } = useSoundEffects();
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (isInteracting && !hasPlayedRef.current) {
      play('raccoonQuotes');
      hasPlayedRef.current = true;

      const timer = setTimeout(() => {
        onComplete?.();
        hasPlayedRef.current = false; // Reset after completion
      }, 5000);

      return () => clearTimeout(timer);
    }

    // Reset when interaction ends (in case onComplete is not called)
    if (!isInteracting && hasPlayedRef.current) {
      hasPlayedRef.current = false;
    }
  }, [isInteracting, onComplete, play]);

  return (
    <group ref={group} position={position} scale={[4, 4, 4]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/raccoon.glb');
