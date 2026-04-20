import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import {
  GHOST_PHYSICS_RADIUS,
  GHOST_SPAWN_Y,
} from './physicsConstants';

export function isMesh(node: THREE.Object3D): node is THREE.Mesh {
  return (node as THREE.Mesh).isMesh === true;
}

export function createPhysicsWorld(): CANNON.World {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0),
  });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  return world;
}

export function createGroundPlane(): CANNON.Body {
  const body = new CANNON.Body({
    mass: 0,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  // Rotate so the plane normal points up (+Y)
  body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  body.position.set(0, -50, 0);
  return body;
}

export function createPlayerBody(startX = 0, startZ = 0): CANNON.Body {
  const body = new CANNON.Body({
    mass: 10,
    shape: new CANNON.Sphere(GHOST_PHYSICS_RADIUS),
    position: new CANNON.Vec3(startX, GHOST_SPAWN_Y, startZ),
    linearDamping: 0.8,
    angularDamping: 1,
    allowSleep: false,
  });
  body.angularFactor.set(0, 0, 0);
  return body;
}

const DECORATIVE_KEYWORDS = [
  'cloud', 'leaf', 'particle', 'smoke', 'light', 'glow', 'flare',
  'shadow', 'decal', 'foliage', 'emitter',
];

/**
 * Mesh names (exact, case-insensitive) that are known decorative groups.
 * Their children are also skipped via the ancestry check below.
 */
const SKIP_MESH_NAMES = ['diograma.001', 'diograma.002'];

/** Minimum world-space size in any axis to be worth colliding with. */
const MIN_TRIMESH_WORLD_SIZE = 1.0;

function isDecorativeMesh(mesh: THREE.Mesh): boolean {
  return DECORATIVE_KEYWORDS.some((kw) => mesh.name.toLowerCase().includes(kw));
}

/** Returns true if the mesh or any of its ancestors is in the skip list. */
function isSkippedMesh(mesh: THREE.Mesh): boolean {
  let node: THREE.Object3D | null = mesh;
  while (node) {
    if (SKIP_MESH_NAMES.includes(node.name.toLowerCase())) return true;
    node = node.parent;
  }
  return false;
}

function isMeshVisible(mesh: THREE.Mesh): boolean {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials.some((m) => {
    if (!m.visible) return false;
    const basicMat = m as THREE.MeshBasicMaterial;
    if (basicMat.transparent && basicMat.opacity < 0.1) return false;
    return true;
  });
}

export function buildDioramaCollisionBodies(root: THREE.Object3D): CANNON.Body[] {
  root.updateMatrixWorld(true);
  const bodies: CANNON.Body[] = [];
  const tempVec = new THREE.Vector3();

  root.traverse((node: THREE.Object3D) => {
    if (!isMesh(node)) return;
    if (isDecorativeMesh(node)) return;
    if (isSkippedMesh(node)) return;
    if (!isMeshVisible(node)) return;

    const geometry = node.geometry;
    const posAttr = geometry.getAttribute('position');
    if (!posAttr) return;

    const vertexCount = posAttr.count;
    if (vertexCount < 3) return;

    // Skip meshes that are too small in world space (decorative details)
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      const worldBounds = geometry.boundingBox.clone().applyMatrix4(node.matrixWorld);
      const size = worldBounds.getSize(new THREE.Vector3());
      if (size.x < MIN_TRIMESH_WORLD_SIZE && size.y < MIN_TRIMESH_WORLD_SIZE && size.z < MIN_TRIMESH_WORLD_SIZE) return;
    }

    const vertices = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount; i++) {
      tempVec.fromBufferAttribute(posAttr, i).applyMatrix4(node.matrixWorld);
      vertices[i * 3] = tempVec.x;
      vertices[i * 3 + 1] = tempVec.y;
      vertices[i * 3 + 2] = tempVec.z;
    }

    let indices: number[];
    if (geometry.index) {
      indices = Array.from(geometry.index.array);
    } else {
      indices = Array.from({ length: vertexCount }, (_, i) => i);
    }

    if (indices.length < 3) return;

    const trimesh = new CANNON.Trimesh(Array.from(vertices), indices);
    const body = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
    body.addShape(trimesh);
    bodies.push(body);
  });

  return bodies;
}
