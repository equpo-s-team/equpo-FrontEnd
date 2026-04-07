export const SPLINE_PLAYER_IDS = {
  // `Character`
  player1: '7f354b86-370c-48b4-97e8-097ad1fa4a69',
  // `Character2`
  player2: '1600fb18-bd80-4970-a2d7-7e8ab17cc0b0',
} as const;

export const SPLINE_PLAYER_NAMES = {
  player1: 'Character',
  player2: 'Character2',
} as const;

export type PlayerKey = keyof typeof SPLINE_PLAYER_IDS;

export interface Vector3State {
  x: number;
  y: number;
  z: number;
}

export interface PlayerRealtimeState {
  active: boolean;
  visible: boolean;
  position: Vector3State;
  rotation: Vector3State;
  clientId: string;
  updatedAt: number;
}

export const PLAYER_PRESENCE_STALE_MS = 10_000;


export function resolvePlayerKeyFromUid(uid: string): PlayerKey {
  const sum = uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return sum % 2 === 0 ? 'player1' : 'player2';
}
