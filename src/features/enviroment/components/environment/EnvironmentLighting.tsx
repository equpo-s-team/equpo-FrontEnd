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

  useFrame((_, delta) => {
    currentDetRef.current = THREE.MathUtils.lerp(
      currentDetRef.current,
      deterioration,
      Math.min(1, delta * 2),
    );
    const d = currentDetRef.current;

    // Sky
    const bg = scene.background;
    if (bg instanceof THREE.Color) {
      bg.copy(BASE_SKY_COLOR).lerp(DETERIORATED_SKY, d);
    }

    // Fog
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(BASE_FOG_COLOR).lerp(DETERIORATED_FOG, d);
      scene.fog.near = THREE.MathUtils.lerp(FOG_NEAR_CLEAN, FOG_NEAR_DIRTY, d);
      scene.fog.far = THREE.MathUtils.lerp(FOG_FAR_CLEAN, FOG_FAR_DIRTY, d);
    }

    // Lights
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        baseAmbientIntensity,
        AMBIENT_LIGHT_DIRTY,
        d,
      );
    }
    if (sunRef.current) {
      sunRef.current.intensity = THREE.MathUtils.lerp(baseSunIntensity, SUN_LIGHT_DIRTY, d);
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
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
}
