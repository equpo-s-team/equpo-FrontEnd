import { Droplets, Heart, MessageCircle, NotebookPen, Sparkles } from 'lucide-react';

import type { ProximityPoint } from '../types/proximityConfig';

export const PROXIMITY_POINTS: ProximityPoint[] = [
  {
    id: 'duck-feeding-area',
    position: [-18, 2, 40],
    label: 'Alimentar\nCosto: 10',
    icon: Heart,
    triggerDistance: 15,
    eventType: 'feed-ducks',
    cost: 10,
  },
  {
    id: 'raccoon-quotes-area',
    position: [65, 2.5, -30],
    label: 'Hablar',
    icon: MessageCircle,
    triggerDistance: 15,
    eventType: 'raccoon-quotes',
  },
  {
    id: 'duck-statue',
    position: [-32, 35, -27],
    label: 'Ver',
    icon: Sparkles,
    triggerDistance: 50,
    eventType: 'duck-statue',
  },
  {
    id: 'board-entry-point',
    position: [-2, 4, -30],
    label: 'Ver tareas',
    icon: NotebookPen,
    triggerDistance: 50,
    eventType: 'board-entry',
  },
  {
    id: 'water-garden1',
    position: [-25.5, 4, 70],
    label: 'Regar\nCosto: 15',
    icon: Droplets,
    triggerDistance: 10,
    eventType: 'water-garden',
    cost: 15,
  },
  {
    id: 'water-garden2',
    position: [-2.5, 4, 70],
    label: 'Regar\nCosto: 15',
    icon: Droplets,
    triggerDistance: 10,
    eventType: 'water-garden',
    cost: 15,
  },
  {
    id: 'water-garden3',
    position: [17.2, 4, 70],
    label: 'Regar\nCosto: 15',
    icon: Droplets,
    triggerDistance: 10,
    eventType: 'water-garden',
    cost: 15,
  },
];
