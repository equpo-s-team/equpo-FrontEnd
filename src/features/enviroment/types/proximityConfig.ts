import type { LucideIcon } from 'lucide-react';

export interface ProximityPoint {
  id: string;
  position: [number, number, number];
  label: string;
  triggerDistance: number;
  eventType: 'feed-ducks' | 'raccoon-quotes' | 'duck-statue' | 'board-entry' | 'water-garden';
  icon: LucideIcon;
}

export interface ProximityEventHandlers {
  onFeedDucks?: (pointId: string) => void;
  onRaccoonQuotes?: (pointId: string) => void;
  onWaterGarden?: (pointId: string) => void;
  onBoardEntry?: () => void;
}
