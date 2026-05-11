import * as THREE from 'three';

import {
  AMBIENT_LIGHT_CLEAN,
  AMBIENT_LIGHT_DIRTY,
  CLEAN_FOG_COLOR,
  CLEAN_SKY_COLOR,
  DETERIORATED_FOG_COLOR,
  DETERIORATED_SKY_COLOR,
  DIORAMA_TINT_COLOR_HEX,
  FOG_FAR_CLEAN,
  FOG_FAR_DIRTY,
  FOG_NEAR_CLEAN,
  FOG_NEAR_DIRTY,
  MAX_DIORAMA_TINT,
  SUN_LIGHT_CLEAN,
  SUN_LIGHT_DIRTY,
} from './physicsConstants';

// ─── Constants (as Three.Color) ───────────────────────────────────────────────
const DIORAMA_TINT_COLOR = new THREE.Color(DIORAMA_TINT_COLOR_HEX);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TintEntry {
  material: THREE.Material & { color: THREE.Color };
  baseColor: THREE.Color;
}

export interface LightRefs {
  ambient: THREE.AmbientLight | null;
  sun: THREE.DirectionalLight | null;
}

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function materialHasColor(
  material: THREE.Material,
): material is THREE.Material & { color: THREE.Color } {
  return 'color' in material && (material as { color?: unknown }).color instanceof THREE.Color;
}

export function isMesh(node: THREE.Object3D): node is THREE.Mesh {
  return (node as THREE.Mesh).isMesh === true;
}

export function normalizeHealthInput(value: number): number {
  if (!Number.isFinite(value)) return 1;
  const normalized = value > 1 ? value / 100 : value;
  return THREE.MathUtils.clamp(normalized, 0, 1);
}

// ─── Material Collection ──────────────────────────────────────────────────────

/**
 * Traverses the loaded diorama and collects all materials that have a `color`
 * property, storing their original base color so we can tint them at runtime.
 */
export function collectTintMaterials(root: THREE.Object3D, tintMap: Map<string, TintEntry>): void {
  root.traverse((node) => {
    if (!isMesh(node)) return;
    const mesh = node;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((mat) => {
      if (!materialHasColor(mat)) return;
      if (!tintMap.has(mat.uuid)) {
        tintMap.set(mat.uuid, { material: mat, baseColor: mat.color.clone() });
      }
    });
  });
}

// ─── Runtime Deterioration ────────────────────────────────────────────────────

export interface DeteriorationParams {
  scene: THREE.Scene;
  lights: LightRefs;
  tintMap: Map<string, TintEntry>;
  deterioration: number;
  baseline?: {
    skyColor?: THREE.Color;
    fogColor?: THREE.Color;
    ambientIntensity?: number;
    sunIntensity?: number;
  };
}

/** Applies health-based visual deterioration to the scene every frame. */
export function applyDeterioration({
  scene,
  lights,
  tintMap,
  deterioration,
  baseline,
}: DeteriorationParams): void {
  const baseSkyColor = baseline?.skyColor ?? new THREE.Color(CLEAN_SKY_COLOR);
  const baseFogColor = baseline?.fogColor ?? new THREE.Color(CLEAN_FOG_COLOR);
  const baseAmbientIntensity = baseline?.ambientIntensity ?? AMBIENT_LIGHT_CLEAN;
  const baseSunIntensity = baseline?.sunIntensity ?? SUN_LIGHT_CLEAN;

  const dioramaTintMix = deterioration * MAX_DIORAMA_TINT;

  // Tint diorama materials
  tintMap.forEach(({ material, baseColor }) => {
    material.color.copy(baseColor).lerp(DIORAMA_TINT_COLOR, dioramaTintMix);
  });

  // Sky color
  const bg = scene.background;
  if (bg instanceof THREE.Color) {
    bg.copy(baseSkyColor).lerp(new THREE.Color(DETERIORATED_SKY_COLOR), deterioration);
  }

  // Fog
  if (scene.fog instanceof THREE.Fog) {
    scene.fog.color
      .copy(baseFogColor)
      .lerp(new THREE.Color(DETERIORATED_FOG_COLOR), deterioration);
    scene.fog.near = THREE.MathUtils.lerp(FOG_NEAR_CLEAN, FOG_NEAR_DIRTY, deterioration);
    scene.fog.far = THREE.MathUtils.lerp(FOG_FAR_CLEAN, FOG_FAR_DIRTY, deterioration);
  }

  // Lighting
  if (lights.ambient) {
    lights.ambient.intensity = THREE.MathUtils.lerp(
      baseAmbientIntensity,
      AMBIENT_LIGHT_DIRTY,
      deterioration,
    );
  }
  if (lights.sun) {
    lights.sun.intensity = THREE.MathUtils.lerp(baseSunIntensity, SUN_LIGHT_DIRTY, deterioration);
  }
}
