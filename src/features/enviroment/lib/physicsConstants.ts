import * as THREE from 'three';

// ─── Ghost / Player ───────────────────────────────────────────────────────────
export const GHOST_SCALE = 0.4;
export const GHOST_Y_OFFSET = 3;
export const GHOST_PHYSICS_RADIUS = 1;
/** Center of the physics sphere in world-Y when resting on the ground plane. */
export const GHOST_BODY_CENTER_Y = GHOST_Y_OFFSET + GHOST_PHYSICS_RADIUS;
export const MOVEMENT_SPEED = 25;
export const ROTATION_SPEED = 10;
/** Initial spawn height and respawn height. */
export const GHOST_SPAWN_Y = 20;
/**
 * Visual position lerp smoothness factor (frame-rate independent).
 * Higher = snappier, lower = smoother.
 */
export const MESH_LERP_FACTOR = 0.4;
/** Y below which the player is considered to have fallen off the map. */
export const RESPAWN_Y_THRESHOLD = -10;

// ─── Diorama ──────────────────────────────────────────────────────────────────
export const DIORAMA_SCALE = 5;
export const DIORAMA_TINT_COLOR = new THREE.Color(0x6b5f4c);
export const MAX_DIORAMA_TINT = 0.5;

// ─── Sky / Fog / Lighting ─────────────────────────────────────────────────────
export const CLEAN_SKY_COLOR = new THREE.Color(0x84eefa);
export const DETERIORATED_SKY_COLOR = new THREE.Color(0x8b8c79);
export const CLEAN_FOG_COLOR = new THREE.Color(0x48dbda);
export const DETERIORATED_FOG_COLOR = new THREE.Color(0x8b8c79);
export const AMBIENT_LIGHT_CLEAN = 0.7;
export const AMBIENT_LIGHT_DIRTY = 0.25;
export const SUN_LIGHT_CLEAN = 1.2;
export const SUN_LIGHT_DIRTY = 0.35;
export const FOG_NEAR_CLEAN = 20;
export const FOG_FAR_CLEAN = 60;
export const FOG_NEAR_DIRTY = 12;
export const FOG_FAR_DIRTY = 32;

// ─── Physics ──────────────────────────────────────────────────────────────────
export const PHYSICS_FIXED_STEP = 1 / 60;
export const PHYSICS_MAX_SUB_STEPS = 3;
export const MAX_PHYSICS_DELTA = 1 / 20;

// ─── Collision builder ────────────────────────────────────────────────────────
export const MAX_ENV_COLLIDERS = 50;
export const MIN_COLLIDER_SIZE = 0.5;
export const MIN_COLLIDER_HEIGHT = 1.0;
export const MAX_COLLIDER_AXIS_RATIO = 0.35;

// ─── Firebase sync ────────────────────────────────────────────────────────────
/** Minimum ms between position uploads to Firebase (10 Hz). */
export const MOVE_SYNC_INTERVAL = 100;
