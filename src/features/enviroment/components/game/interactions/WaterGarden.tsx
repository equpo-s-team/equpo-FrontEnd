import { useEffect, useState } from 'react';

import { useSoundEffects } from '@/hooks/useSoundEffects.ts';

import { HeartParticles } from '../particles/HeartParticles.tsx';

interface WaterGardenProps {
  position?: [number, number, number];
  playAnimation?: boolean;
  onComplete?: () => void;
}

export function WaterGarden({
  position = [-25, 4, 35],
  playAnimation = false,
  onComplete,
}: WaterGardenProps) {
  const [showParticles, setShowParticles] = useState(false);
  const { play } = useSoundEffects();


  useEffect(() => {
    if (playAnimation && !showParticles) {
      setShowParticles(true);
      play('waterGarden');
    }
  }, [playAnimation, showParticles, play]);

  const handleParticlesComplete = () => {
    setShowParticles(false);
    onComplete?.();
  };

  return (
    <>
      {showParticles && (
        <HeartParticles
          position={[position[0], position[1], position[2]]}
          count={15}
          onComplete={handleParticlesComplete}
        />
      )}
    </>
  );
}

