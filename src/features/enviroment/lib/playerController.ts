import type * as CANNON from 'cannon-es';
import * as THREE from 'three';

import {
  GHOST_BODY_CENTER_Y,
  GHOST_SPAWN_Y,
  GHOST_Y_OFFSET,
  MOVEMENT_SPEED,
  RESPAWN_Y_THRESHOLD,
  ROTATION_SPEED,
} from './physicsConstants';

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

function smoothFactor(factor: number, delta: number): number {
  return 1 - Math.pow(1 - factor, delta * 60);
}

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

    const targetRotation = Math.atan2(dir.x, dir.z);
    proxy.rotation.y = THREE.MathUtils.lerp(
      proxy.rotation.y,
      targetRotation,
      smoothFactor(ROTATION_SPEED / 60, delta),
    );
  } else {
    body.velocity.x = 0;
    body.velocity.z = 0;
  }

  return isMoving;
}

export function syncBodyToProxy(body: CANNON.Body, proxy: PlayerProxy): void {
  proxy.position.set(body.position.x, body.position.y - GHOST_BODY_CENTER_Y, body.position.z);
}

export function syncMeshToProxy(mesh: THREE.Group, proxy: PlayerProxy): void {
  mesh.position.set(proxy.position.x, proxy.position.y + GHOST_Y_OFFSET, proxy.position.z);
  mesh.rotation.y = proxy.rotation.y;
}

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
