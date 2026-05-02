import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface HeartParticlesProps {
  position?: [number, number, number];
  count?: number;
  onComplete?: () => void;
}

export function HeartParticles({
  position = [0, 0, 0],
  count = 10,
  onComplete
}: HeartParticlesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      offset: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.03 + 0.01,
        (Math.random() - 0.5) * 0.02
      ),
      scale: Math.random() * 0.8 + 0.2,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    }));
  }, [count]);

  useFrame(() => {
    if (!groupRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    const maxDuration = 6;

    if (elapsed > maxDuration) {
      onComplete?.();
      return;
    }

    particles.forEach((particle) => {
      const mesh = groupRef.current?.children[particle.id] as THREE.Mesh;
      if (!mesh) return;

      // Update position
      particle.offset.add(particle.velocity);
      mesh.position.copy(particle.offset);

      // Float up and fade
      mesh.position.y += elapsed * 0.5;
      mesh.rotation.z += particle.rotationSpeed;

      // Fade out
      const opacity = Math.max(0, 1 - elapsed / maxDuration);
      (mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {particles.map((particle) => (
        <Text
          key={particle.id}
          position={particle.offset}
          fontSize={particle.scale}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          ❤︎
        </Text>
      ))}
    </group>
  );
}
