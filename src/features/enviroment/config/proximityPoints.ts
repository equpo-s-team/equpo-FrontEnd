import type { ProximityPoint } from '../types/proximityConfig';
import { Heart, MessageCircle } from 'lucide-react';

export const PROXIMITY_POINTS: ProximityPoint[] = [
  {
    id: 'duck-feeding-area',
    position: [-18, 2, 40],
    label: 'Alimentar\nCosto: 10',
    icon: Heart,
    triggerDistance: 15,
    eventType: 'feed-ducks'
  },
  {
    id: 'raccoon-quotes-area',
    position: [66.5a, 6, -40],
    label: 'Hablar',
    icon: MessageCircle,
    triggerDistance: 10,
    eventType: 'raccoon-quotes'
  }
];
