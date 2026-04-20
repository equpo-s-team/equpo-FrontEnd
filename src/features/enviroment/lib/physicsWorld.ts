import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import {
  DIORAMA_SCALE,
  GHOST_BODY_CENTER_Y,
  GHOST_PHYSICS_RADIUS,
  GHOST_SPAWN_Y,
  MAX_COLLIDER_AXIS_RATIO,
  MAX_ENV_COLLIDERS,
  MIN_COLLIDER_HEIGHT,
  MIN_COLLIDER_SIZE,
} from './physicsConstants';

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function isMesh(node: THREE.Object3D): node is THREE.Mesh {
  return (node as THREE.Mesh).isMesh === true;
}

// ─── World ────────────────────────────────────────────────────────────────────

/** Creates a CANNON.World with gravity and broad-phase configured. */
export function createPhysicsWorld(): CANNON.World {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
  });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  return world;
}

// ─── Ground ───────────────────────────────────────────────────────────────────

/**
 * Invisible static ground plane at Y = 0.
 * Gives the ghost a floor to stand on and prevents infinite falling
 * during normal play.
 */
export function createGroundPlane(): CANNON.Body {
  const body = new CANNON.Body({
    mass: 0,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  // Rotate so the plane normal points up (+Y)
  body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  body.position.set(0, 0, 0);
  return body;
}

// ─── Player body ─────────────────────────────────────────────────────────────

/**
 * Creates the dynamic sphere body for the local player.
 * Y-movement is enabled so gravity + the ground plane work normally.
 */
export function createPlayerBody(startX = 0, startZ = 0): CANNON.Body {
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(GHOST_PHYSICS_RADIUS),
    position: new CANNON.Vec3(startX, GHOST_SPAWN_Y, startZ),
    linearDamping: 0.8,
    angularDamping: 1,
    allowSleep: false,
  });
  // Prevent tumbling – only allow XZ translation and Y-axis rotation
  body.angularFactor.set(0, 0, 0);
  return body;
}

// ─── Environment colliders ────────────────────────────────────────────────────

function createStaticBoxBody(center: THREE.Vector3, size: THREE.Vector3): CANNON.Body {
  const hx = Math.max(size.x * 0.5, 0.05);
  const hy = Math.max(size.y * 0.5, 0.05);
  const hz = Math.max(size.z * 0.5, 0.05);
  const body = new CANNON.Body({
    mass: 0,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(center.x, center.y, center.z),
  });
  body.addShape(new CANNON.Box(new CANNON.Vec3(hx, hy, hz)));
  return body;
}

/** Names (lowercase) that indicate purely decorative meshes — skip colliders. */
const DECORATIVE_KEYWORDS = [
  'cloud', 'leaf', 'particle', 'smoke', 'light', 'glow', 'flare',
  'shadow', 'decal', 'grass', 'foliage', 'emitter',
];

function isDecorativeMesh(mesh: THREE.Mesh): boolean {
  const name = mesh.name.toLowerCase();
  return DECORATIVE_KEYWORDS.some((kw) => name.includes(kw));
}

function isMeshVisible(mesh: THREE.Mesh): boolean {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials.some((m) => {
    if (!m.visible) return false;
    if ((m as THREE.MeshBasicMaterial).transparent && (m as THREE.MeshBasicMaterial).opacity < 0.1) return false;
    return true;
  });
}

/**
 * Builds a set of static CANNON box bodies that approximate the solid parts of the
 * diorama.  Filtración agresiva para evitar generar colisores invisibles para
 * meshes decorativos, planos, o bounding-boxes sobredimensionados.
 */
export function buildDioramaCollisionBodies(root: THREE.Object3D): CANNON.Body[] {
  root.updateMatrixWorld(true);

  const dioramaBounds = new THREE.Box3().setFromObject(root);
  const dioramaSize = dioramaBounds.getSize(new THREE.Vector3());
  const maxColliderAxis = Math.max(dioramaSize.x, dioramaSize.z) * MAX_COLLIDER_AXIS_RATIO;

  const candidates: Array<{ volume: number; center: THREE.Vector3; size: THREE.Vector3 }> = [];

  root.traverse((node: THREE.Object3D) => {
    if (!isMesh(node)) return;

    // Skip decorative / invisible meshes
    if (isDecorativeMesh(node)) return;
    if (!isMeshVisible(node)) return;

    const geometry = node.geometry;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    if (!geometry.boundingBox) return;

    const worldBounds = geometry.boundingBox.clone().applyMatrix4(node.matrixWorld);
    const size = worldBounds.getSize(new THREE.Vector3());

    // Skip meshes that are too small in any axis
    if (size.x < MIN_COLLIDER_SIZE || size.y < MIN_COLLIDER_SIZE || size.z < MIN_COLLIDER_SIZE) return;

    // Skip large enclosing / floor meshes
    const isTooWide = size.x > maxColliderAxis && size.z > maxColliderAxis;
    if (isTooWide) return;

    // Skip flat horizontal planes (floors/ceilings handled by the ground plane)
    const isTooFlat = size.y < MIN_COLLIDER_HEIGHT;
    if (isTooFlat) return;

    // Skip meshes where the bounding-box is drastically larger than the local geometry
    // (a sign of a concave mesh whose AABB would create phantom walls)
    const localBounds = geometry.boundingBox;
    const localSize = localBounds.getSize(new THREE.Vector3());
    const worldVolume = size.x * size.y * size.z;
    const localVolume = localSize.x * localSize.y * localSize.z * Math.pow(DIORAMA_SCALE, 3);
    if (localVolume > 0 && worldVolume / localVolume > 8) return;

    const center = worldBounds.getCenter(new THREE.Vector3());
    candidates.push({ volume: worldVolume, center, size });
  });

  // Keep the most volumetric solid obstacles
  candidates.sort((a, b) => b.volume - a.volume);
  return candidates
    .slice(0, MAX_ENV_COLLIDERS)
    .map(({ center, size }) => createStaticBoxBody(center, size));
}


