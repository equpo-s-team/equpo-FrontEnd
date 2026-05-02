import { useCallback } from 'react';
import { Html } from '@react-three/drei';

import {PROXIMITY_POINTS} from "@/features/enviroment/config/proximityPoints.ts";
import {ProximityEventHandlers, ProximityPoint} from "@/features/enviroment/types/proximityConfig.ts";
import {AppTooltip} from "@/components/ui/AppTooltip.tsx";

interface ProximityButtonsProps {
  eventHandlers: ProximityEventHandlers;
}

export function ProximityButtons({
  eventHandlers
}: ProximityButtonsProps) {
  const handleButtonClick = useCallback((point: ProximityPoint) => {
    switch (point.eventType) {
      case 'feed-ducks':
        eventHandlers.onFeedDucks?.(point.id);
        break;
      case 'raccoon-quotes':
        eventHandlers.onRaccoonQuotes?.(point.id);
        break;
    }
  }, [eventHandlers]);

  return (
    <>
      {PROXIMITY_POINTS.map(point => (
        <group key={point.id} position={point.position}>

          <Html
            position={[0, 2, 0]}
            center
            occlude
          >
            <AppTooltip content={point.label}>
              <button
                onClick={() => handleButtonClick(point)}
                className="flex items-center justify-center w-16 h-16 border-4 border-white rounded-full text-white shadow-lg hover:bg-white/20 transition-colors"
              >
                <point.icon className="w-8 h-8" />
              </button>
            </AppTooltip>
          </Html>
        </group>
      ))}
    </>
  );
}
