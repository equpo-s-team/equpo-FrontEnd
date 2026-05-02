import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import {
  AMBIENT_LIGHT_CLEAN,
  AMBIENT_LIGHT_DIRTY,
  CLEAN_FOG_COLOR,
  CLEAN_SKY_COLOR,
  DETERIORATED_FOG_COLOR,
  DETERIORATED_SKY_COLOR,
  FOG_FAR_CLEAN,
  FOG_FAR_DIRTY,
  FOG_NEAR_CLEAN,
  FOG_NEAR_DIRTY,
  SUN_LIGHT_CLEAN,
  SUN_LIGHT_DIRTY,
} from '../../lib/physicsConstants';

interface EnvironmentLightingProps {
  deterioration: number;
}

const hour = new Date().getHours();
const isNightTime = hour >= 18 || hour < 6;

const BASE_SKY_COLOR = new THREE.Color(isNightTime ? 0x0042ad : CLEAN_SKY_COLOR);
const BASE_FOG_COLOR = new THREE.Color(isNightTime ? 0x70a7ff : CLEAN_FOG_COLOR);
const DETERIORATED_SKY = new THREE.Color(DETERIORATED_SKY_COLOR);
const DETERIORATED_FOG = new THREE.Color(DETERIORATED_FOG_COLOR);
const baseAmbientIntensity = isNightTime ? 0.45 : AMBIENT_LIGHT_CLEAN;
const baseSunIntensity = isNightTime ? 0.7 : SUN_LIGHT_CLEAN;

export function EnvironmentLighting({ deterioration }: EnvironmentLightingProps) {
  const { scene } = useThree();
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const currentDetRef = useRef(deterioration);
  const frameCountRef = useRef(0);
  const targetDetRef = useRef(deterioration);

  useFrame(() => {
    frameCountRef.current++;
    
    // Update every 4 frames (~15fps) for even better performance
    if (frameCountRef.current % 4 !== 0) return;

    const prevDet = currentDetRef.current;
    targetDetRef.current = deterioration;
    
    // Only lerp if target changed
    if (Math.abs(targetDetRef.current - prevDet) > 0.001) {
      currentDetRef.current = THREE.MathUtils.lerp(
        prevDet,
        targetDetRef.current,
        0.1, // Slower, smoother lerp
      );
    }

    const d = currentDetRef.current;

    // Cache references to avoid repeated property access
    const bg = scene.background;
    const fog = scene.fog;
    const ambient = ambientRef.current;
    const sun = sunRef.current;

    // Sky - direct color manipulation for better performance
    if (bg instanceof THREE.Color) {
      bg.r = BASE_SKY_COLOR.r + (DETERIORATED_SKY.r - BASE_SKY_COLOR.r) * d;
      bg.g = BASE_SKY_COLOR.g + (DETERIORATED_SKY.g - BASE_SKY_COLOR.g) * d;
      bg.b = BASE_SKY_COLOR.b + (DETERIORATED_SKY.b - BASE_SKY_COLOR.b) * d;
    }

    // Fog - direct manipulation
    if (fog instanceof THREE.Fog) {
      fog.color.r = BASE_FOG_COLOR.r + (DETERIORATED_FOG.r - BASE_FOG_COLOR.r) * d;
      fog.color.g = BASE_FOG_COLOR.g + (DETERIORATED_FOG.g - BASE_FOG_COLOR.g) * d;
      fog.color.b = BASE_FOG_COLOR.b + (DETERIORATED_FOG.b - BASE_FOG_COLOR.b) * d;
      fog.near = FOG_NEAR_CLEAN + (FOG_NEAR_DIRTY - FOG_NEAR_CLEAN) * d;
      fog.far = FOG_FAR_CLEAN + (FOG_FAR_DIRTY - FOG_FAR_CLEAN) * d;
    }

    // Lights - direct intensity calculation
    if (ambient) {
      ambient.intensity = baseAmbientIntensity + (AMBIENT_LIGHT_DIRTY - baseAmbientIntensity) * d;
    }
    if (sun) {
      sun.intensity = baseSunIntensity + (SUN_LIGHT_DIRTY - baseSunIntensity) * d;
    }
  });

  return (
    <>
      <ambientLight
        ref={ambientRef}
        color={isNightTime ? 0xffffff : 0xffffff}
        intensity={baseAmbientIntensity}
      />
      <directionalLight
        ref={sunRef}
        color={isNightTime ? 0x9bbcff : 0xffffff}
        intensity={baseSunIntensity}
        position={isNightTime ? [-6, 8, -5] : [5, 10, 7.5]}
        castShadow={!isNightTime}
        shadow-mapSize={[1048, 1048]}
        shadow-mapType={THREE.PCFShadowMap}
      />
    </>
  );
}
