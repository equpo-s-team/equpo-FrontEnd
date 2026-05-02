import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FollowCameraProps {
  targetRef: React.MutableRefObject<THREE.Vector3>;
  hasPlayer: boolean;
}

const STATIC_POSITION = new THREE.Vector3(-30, 10, 30);
const STATIC_LOOKAT = new THREE.Vector3(0, 0, 0);

const CAM_OFFSET_X = 0;
const CAM_OFFSET_Y = 14;
const CAM_OFFSET_Z = 22;
const CAM_LERP = 0.1;

export function FollowCamera({ targetRef, hasPlayer }: FollowCameraProps) {
  const { camera } = useThree();
  const initialized = useRef(false);

  if (!initialized.current) {
    camera.position.copy(STATIC_POSITION);
    camera.lookAt(STATIC_LOOKAT);
    initialized.current = true;
  }

  useFrame(() => {
    if (!hasPlayer) {
      camera.position.lerp(STATIC_POSITION, CAM_LERP);
      camera.lookAt(STATIC_LOOKAT);
      return;
    }

    const target = targetRef.current;
    const desiredPos = new THREE.Vector3(
      target.x + CAM_OFFSET_X,
      target.y + CAM_OFFSET_Y,
      target.z + CAM_OFFSET_Z,
    );

    camera.position.lerp(desiredPos, CAM_LERP);
    camera.lookAt(target.x, target.y, target.z);
  });

  return null;
}
