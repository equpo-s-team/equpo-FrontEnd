import type { LucideIcon } from 'lucide-react';

export interface ProximityPoint {
  id: string;
  position: [number, number, number];
  label: string;
  triggerDistance: number;
  eventType: 'feed-ducks' | 'raccoon-quotes';
  icon: LucideIcon;
}

export interface ProximityEventHandlers {
  onFeedDucks?: (pointId: string) => void;
  onRaccoonQuotes?: (pointId: string) => void;
}
