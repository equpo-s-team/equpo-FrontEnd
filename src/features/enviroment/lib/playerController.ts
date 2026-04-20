import type * as CANNON from 'cannon-es';
import * as THREE from 'three';

import {
  GHOST_BODY_CENTER_Y,
  GHOST_SPAWN_Y,
  GHOST_Y_OFFSET,
  MESH_LERP_FACTOR,
  MOVEMENT_SPEED,
  RESPAWN_Y_THRESHOLD,
  ROTATION_SPEED,
} from './physicsConstants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export interface PlayerProxy {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

// ─── Frame-rate independent lerp ─────────────────────────────────────────────

/**
 * Returns a lerp factor that is independent of frame rate.
 * @param factor  - Desired "snapiness" value (0–1) at 60 fps
 * @param delta   - Frame delta in seconds
 */
function smoothFactor(factor: number, delta: number): number {
  return 1 - Math.pow(1 - factor, delta * 60);
}

// ─── Movement ─────────────────────────────────────────────────────────────────

/**
 * Reads keyboard state and applies velocity to the physics body.
 * Returns true if any movement key is pressed.
 */
export function applyMovementInput(
  body: CANNON.Body,
  keyboard: KeyboardState,
  proxy: PlayerProxy,
  delta: number,
): boolean {
  const dir = new THREE.Vector3();
  if (keyboard.forward) dir.z -= 1;
  if (keyboard.backward) dir.z += 1;
  if (keyboard.left) dir.x -= 1;
  if (keyboard.right) dir.x += 1;

  const isMoving = dir.lengthSq() > 0;

  if (isMoving) {
    dir.normalize().multiplyScalar(MOVEMENT_SPEED);
    body.wakeUp();
    body.velocity.x = dir.x;
    body.velocity.z = dir.z;

    // Rotate ghost to face the direction of movement
    const targetRotation = Math.atan2(dir.x, dir.z);
    proxy.rotation.y = THREE.MathUtils.lerp(
      proxy.rotation.y,
      targetRotation,
      smoothFactor(ROTATION_SPEED / 60, delta),
    );
  } else {
    // Friction: stop horizontal motion immediately
    body.velocity.x = 0;
    body.velocity.z = 0;
  }

  return isMoving;
}

// ─── Proxy sync ───────────────────────────────────────────────────────────────

/**
 * Copies the physics body's world position into the logical proxy.
 * The proxy Y is kept at 0 so the visual mesh has a stable local offset.
 */
export function syncBodyToProxy(body: CANNON.Body, proxy: PlayerProxy): void {
  proxy.position.set(
    body.position.x,
    body.position.y - GHOST_BODY_CENTER_Y, // normalize to floor level
    body.position.z,
  );
}

// ─── Visual mesh sync ─────────────────────────────────────────────────────────

/**
 * Smoothly interpolates the visual mesh toward the proxy position.
 * Uses a frame-rate independent exponential curve so the mesh tracks
 * the physics body tightly without the trailing ghosting artifact.
 */
export function syncMeshToProxy(
  mesh: THREE.Group,
  proxy: PlayerProxy,
  delta: number,
): void {
  const targetPos = new THREE.Vector3(
    proxy.position.x,
    proxy.position.y + GHOST_Y_OFFSET,
    proxy.position.z,
  );

  const alpha = smoothFactor(MESH_LERP_FACTOR, delta);
  mesh.position.lerp(targetPos, alpha);
  mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, proxy.rotation.y, alpha);
}

// ─── Respawn ──────────────────────────────────────────────────────────────────

/**
 * Checks if the player has fallen below the respawn threshold and, if so,
 * teleports the physics body back to the spawn origin.
 */
export function checkFallRespawn(body: CANNON.Body, spawnX = 0, spawnZ = 0): boolean {
  if (body.position.y < RESPAWN_Y_THRESHOLD) {
    body.position.set(spawnX, GHOST_SPAWN_Y, spawnZ);
    body.velocity.set(0, 0, 0);
    body.angularVelocity.set(0, 0, 0);
    body.wakeUp();
    return true;
  }
  return false;
}
