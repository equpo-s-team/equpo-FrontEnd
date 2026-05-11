import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';

import { AppTooltip } from '@/components/ui/AppTooltip.tsx';
import { PROXIMITY_POINTS } from '@/features/enviroment/config/proximityPoints.ts';
import { type ProximityEventHandlers, type ProximityPoint } from '@/features/enviroment/types/proximityConfig.ts';

interface ProximityButtonsProps {
  eventHandlers: ProximityEventHandlers;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  coinBalance: number;
  disabledIds?: Set<string>;
}

const CHECK_INTERVAL_MS = 200;

export function ProximityButtons({
  eventHandlers,
  playerPosRef,
  coinBalance,
  disabledIds,
}: ProximityButtonsProps) {
  const [nearbyIds, setNearbyIds] = useState<Set<string>>(new Set());
  const lastCheckRef = useRef(0);
  const _pointPositions = useRef(
    PROXIMITY_POINTS.map(p => new THREE.Vector3(...p.position))
  );
  const _triggerDistancesSq = useRef(
    PROXIMITY_POINTS.map(p => p.triggerDistance * p.triggerDistance)
  );

  useFrame(() => {
    const now = performance.now();
    if (now - lastCheckRef.current < CHECK_INTERVAL_MS) return;
    lastCheckRef.current = now;

    const player = playerPosRef.current;
    const next = new Set<string>();
    PROXIMITY_POINTS.forEach((point, i) => {
      const dist2 = player.distanceToSquared(_pointPositions.current[i]);
      if (dist2 < _triggerDistancesSq.current[i]) {
        next.add(point.id);
      }
    });

    setNearbyIds(prev => {
      const same =
        prev.size === next.size && [...prev].every(id => next.has(id));
      return same ? prev : next;
    });
  });

  const handleButtonClick = useCallback((point: ProximityPoint, canAfford: boolean) => {
    if (point.cost !== undefined && !canAfford) return;
    if (disabledIds?.has(point.id)) return;
    switch (point.eventType) {
      case 'feed-ducks':
        eventHandlers.onFeedDucks?.(point.id);
        break;
      case 'raccoon-quotes':
        eventHandlers.onRaccoonQuotes?.(point.id);
        break;
      case 'water-garden':
        eventHandlers.onWaterGarden?.(point.id);
        break;
      case 'board-entry':
        eventHandlers.onBoardEntry?.();
        break;
      case 'duck-statue':
        eventHandlers.onDuckStatue?.();
        break;
    }
  }, [eventHandlers, disabledIds]);

  return (
    <>
      {PROXIMITY_POINTS.filter(p => nearbyIds.has(p.id)).map(point => {
        const canAfford = point.cost === undefined || coinBalance >= point.cost;
        const isAchievementDisabled = disabledIds?.has(point.id) ?? false;
        const buttonClass = !canAfford
          ? 'flex items-center justify-center w-16 h-16 border-4 border-red-500 rounded-full text-red-400 shadow-lg cursor-not-allowed opacity-80'
          : isAchievementDisabled
            ? 'flex items-center justify-center w-16 h-16 border-4 border-gray-400 rounded-full text-gray-400 shadow-lg cursor-not-allowed opacity-50'
            : 'flex items-center justify-center w-16 h-16 border-4 border-white rounded-full text-white shadow-lg hover:bg-white/20 transition-colors cursor-pointer';

        return (
          <group key={point.id} position={point.position}>
            <Html
              position={[0, 2, 0]}
              center
              occlude
            >
              <AppTooltip content={point.label}>
                <button
                  onClick={() => handleButtonClick(point, canAfford)}
                  className={buttonClass}
                  disabled={!canAfford || isAchievementDisabled}
                >
                  <point.icon className="w-8 h-8" />
                </button>
              </AppTooltip>
            </Html>
          </group>
        );
      })}
    </>
  );
}
