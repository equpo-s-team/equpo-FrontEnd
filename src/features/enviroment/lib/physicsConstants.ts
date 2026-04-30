// ─── Character / Ghost ────────────────────────────────────────────────────────
export const GHOST_SCALE = 0.5;
export const GHOST_Y_OFFSET = 5;
export const GHOST_PHYSICS_RADIUS = 0.5;
export const GHOST_SPAWN_Y = 10;

export const MOVEMENT_SPEED = 20;
export const ROTATION_SPEED = 20;
export const RESPAWN_Y_THRESHOLD = -20;

// ─── Diorama ──────────────────────────────────────────────────────────────────
export const DIORAMA_SCALE = 5;
export const DIORAMA_TINT_COLOR_HEX = 0x6b5f4c;
export const MAX_DIORAMA_TINT = 0.7;

// ─── Sky / Fog / Lighting (clean state) ───────────────────────────────────────
export const CLEAN_SKY_COLOR = 0x84eefa;
export const DETERIORATED_SKY_COLOR = 0x8b8c79;
export const CLEAN_FOG_COLOR = 0x48dbda;
export const DETERIORATED_FOG_COLOR = 0x8b8c79;
export const AMBIENT_LIGHT_CLEAN = 0.7;
export const AMBIENT_LIGHT_DIRTY = 0.25;
export const SUN_LIGHT_CLEAN = 1.2;
export const SUN_LIGHT_DIRTY = 0.35;
export const FOG_NEAR_CLEAN = 10;
export const FOG_FAR_CLEAN = 60;
export const FOG_NEAR_DIRTY = 12;
export const FOG_FAR_DIRTY = 32;

// ─── Physics ──────────────────────────────────────────────────────────────────
export const MAX_PHYSICS_DELTA = 1 / 20;

// ─── Jumping ─────────────────────────────────────────────────────────────────
export const JUMP_IMPULSE = 30;
export const GROUND_RAY_EXTRA = 0.15;

// ─── Firebase / WebSocket sync ────────────────────────────────────────────────
/** Minimum ms between position uploads. */
export const MOVE_SYNC_INTERVAL = 10;

// ─── Mobile Joystick ──────────────────────────────────────────────────────────
export const JOYSTICK_SIZE = 110;
export const JOYSTICK_THUMB_SIZE = 44;
export const JOYSTICK_DEAD_ZONE = 0.12;
export const JOYSTICK_JUMP_SIZE = 68;
