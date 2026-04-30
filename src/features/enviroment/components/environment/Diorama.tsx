import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useMemo, useRef } from 'react';
import type * as THREE from 'three';

import { collectTintMaterials, type TintEntry } from '../../lib/environmentEffects';
import { DIORAMA_SCALE } from '../../lib/physicsConstants';

interface DioramaProps {
  tintMapRef: React.MutableRefObject<Map<string, TintEntry>>;
  onLoaded?: () => void;
}

const DECORATIVE_KEYWORDS = [
  'flowers',
  'particle',
  'grass',
  'light',
  'water',
  'flare',
  'shadow',
  'decal',
  'foliage',
  'emitter',
  'cielo',
  'sky',
];

const SKIP_MESH_NAMES = ['grass', 'flowers'];

function isDecorative(node: THREE.Object3D): boolean {
  if (DECORATIVE_KEYWORDS.some((kw) => node.name.toLowerCase().includes(kw))) return true;
  let curr: THREE.Object3D | null = node;
  while (curr) {
    if (SKIP_MESH_NAMES.includes(curr.name.toLowerCase())) return true;
    curr = curr.parent;
  }
  return false;
}

export function Diorama({ tintMapRef, onLoaded }: DioramaProps) {
  const { scene } = useGLTF('/models/BigDiorama.glb');
  const loadedRef = useRef(false);

  // Debug: Log all model elements
  const logModelElements = (obj: THREE.Object3D, depth = 0) => {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${obj.name || 'unnamed'} (${obj.type})`);
    obj.children.forEach(child => logModelElements(child, depth + 1));
  };

  useEffect(() => {
    if (!loadedRef.current) {
      console.log('=== MODEL ELEMENTS ===');
      logModelElements(scene);
      console.log('=== END MODEL ELEMENTS ===');
      loadedRef.current = true;
    }
  }, [scene]);

  const collisionScene = useMemo(() => {
    const clone = scene.clone(true);
    const toRemove: THREE.Object3D[] = [];
    
    clone.traverse((node) => {
      if ((node as THREE.Mesh).isMesh && isDecorative(node)) {
        toRemove.push(node);
      }
    });
    
    toRemove.forEach((node) => node.removeFromParent());
    clone.visible = false;
    return clone;
  }, [scene]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    collectTintMaterials(scene, tintMapRef.current);

    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        (node as THREE.Mesh).receiveShadow = true;
        (node as THREE.Mesh).castShadow = false;
      }
    });

    onLoaded?.();
  }, [scene, tintMapRef, onLoaded]);

  return (
    <>
      {/* Visual Scene */}
      <primitive object={scene} scale={DIORAMA_SCALE} />

      {/* Collision Scene (invisible, filtered) */}
      <RigidBody type="fixed" colliders="trimesh" includeInvisible>
        <primitive object={collisionScene} scale={DIORAMA_SCALE} />
      </RigidBody>
    </>
  );
}

useGLTF.preload('/models/BigDiorama.glb');
