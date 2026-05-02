import { useEffect, useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import type { Group } from 'three';
import { useSoundEffects } from '@/hooks/useSoundEffects.ts';
import { useRaccoonQuote } from '@/features/enviroment/hooks/useRaccoonQuote';

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
  const { quote, fetchQuote, clearQuote } = useRaccoonQuote();

  useEffect(() => {
    if (isInteracting && !hasPlayedRef.current) {
      play('raccoonQuotes');
      fetchQuote();
      hasPlayedRef.current = true;

      const timer = setTimeout(() => {
        onComplete?.();
        clearQuote();
        hasPlayedRef.current = false;
      }, 5000);

      return () => clearTimeout(timer);
    }

    if (!isInteracting && hasPlayedRef.current) {
      hasPlayedRef.current = false;
    }
  }, [isInteracting, onComplete, play, fetchQuote, clearQuote]);

  return (
    <group ref={group} position={position} scale={[4, 4, 4]}>
      <primitive object={scene} />
      {quote && (
        <Html position={[13, 2.3, -8]} center>
          <div className="bg-white rounded-lg p-4 w-96 shadow-md font-maxwell text-lg text-primary-foreground leading-[1.4] relative pointer-events-none select-none">
            <p className="m-0 mb-1">"{quote.quote}"</p>
            <p className="m-0 font-semibold text-[#555] text-sm">
              — {quote.author}
            </p>
            {/* cola de burbuja apuntando hacia abajo */}
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload('/models/raccoon.glb');
