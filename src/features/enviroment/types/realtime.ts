export const PLAYER_PRESENCE_STALE_MS = 10_000;

type SlotNumber =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06';

export type SlotId = `Character_${SlotNumber}`;

export const SPLINE_SLOT_IDS: SlotId[] = [
  'Character_01',
  'Character_02',
  'Character_03',
  'Character_04',
  'Character_05',
  'Character_06',
];

export const SPLINE_SLOT_OBJECT_IDS: Record<SlotId, string> = {
  Character_01: '7f354b86-370c-48b4-97e8-097ad1fa4a69',
  Character_02: '1600fb18-bd80-4970-a2d7-7e8ab17cc0b0',
  Character_03: '168c900b-fe0a-4506-a649-5b4ecb2e7e3d',
  Character_04: 'd2cf9e6a-3dcd-4035-aedc-ec63a08f9c9d',
  Character_05: 'd44adf33-6b10-4454-b16c-253e8e541422',
  Character_06: '040cb552-0c18-4901-8211-eecd102a0da4',
};

export const THREE_SLOT_MODELS: Record<SlotId, string> = {
  Character_01: 'blueGhost.glb',
  Character_02: 'redGhost.glb',
  Character_03: 'greenGhost.glb',
  Character_04: 'purpleGhost.glb',
  Character_05: 'darkBlueGhost.glb',
  Character_06: 'blueGhost.glb', // Fallback or rotation
};

export const MAX_SPLINE_SLOTS = SPLINE_SLOT_IDS.length;

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
  slotId: SlotId | null;
}

export interface SlotClaimState {
  uid: string;
  clientId: string;
  updatedAt: number;
}

export function isSlotId(value: unknown): value is SlotId {
  return typeof value === 'string' && /^Character_0[1-6]$/.test(value);
}
