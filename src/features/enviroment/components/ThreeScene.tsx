import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { THREE_SLOT_MODELS, type SlotId, type Vector3State } from '../types/realtime';

interface ThreeSceneProps {
  localSlotId: SlotId | null;
  remotePlayers: Record<string, { position: Vector3State; rotation: Vector3State; slotId: SlotId | null }>;
  onLocalMove: (position: Vector3State, rotation: Vector3State) => void;
  keyboard: { forward: boolean; backward: boolean; left: boolean; right: boolean };
}

const GHOST_SCALE = 0.4;
const GHOST_Y_OFFSET = 2.5;

export default function ThreeScene({ localSlotId, remotePlayers, onLocalMove, keyboard }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const localProxy = useRef({ position: new THREE.Vector3(0, 0, 0), rotation: new THREE.Euler(0, 0, 0) });
  const remoteGhosts = useRef<Map<string, THREE.Group>>(new Map());
  const sceneRef = useRef<THREE.Scene | null>(null);
  const loader = useRef(new GLTFLoader());
  const keyboardRef = useRef(keyboard);
  const onLocalMoveRef = useRef(onLocalMove);
  const remotePlayersRef = useRef(remotePlayers);
  const pendingLoads = useRef<Set<string>>(new Set());

  // Keep refs in sync with props
  useEffect(() => {
    keyboardRef.current = keyboard;
  }, [keyboard]);

  useEffect(() => {
    onLocalMoveRef.current = onLocalMove;
  }, [onLocalMove]);

  useEffect(() => {
    remotePlayersRef.current = remotePlayers;
  }, [remotePlayers]);

  // Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x84EEFA);
    scene.fog = new THREE.Fog(0x48DBDA, 20, 60);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(-30, 10, 30);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 10, 7.5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Load Environment
    loader.current.load('/models/diorama.glb', (glb) => {
      scene.add(glb.scene);
      glb.scene.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          node.receiveShadow = true;
        }
      });
    });

    let lastTime = performance.now();
    const MOVEMENT_SPEED = 25;
    const ROTATION_SPEED = 10;
    let lastMoveSync = 0;
    const MOVE_SYNC_INTERVAL = 100; // sync to React/Firebase at 10Hz

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Local Movement
      if (localSlotId) {
        const currentKeyboard = keyboardRef.current;
        const moveDir = new THREE.Vector3(0, 0, 0);
        if (currentKeyboard.forward) moveDir.z -= 1;
        if (currentKeyboard.backward) moveDir.z += 1;
        if (currentKeyboard.left) moveDir.x -= 1;
        if (currentKeyboard.right) moveDir.x += 1;

        if (moveDir.length() > 0) {
          moveDir.normalize().multiplyScalar(MOVEMENT_SPEED * delta);
          localProxy.current.position.add(moveDir);

          // Rotate to face movement
          const targetRotation = Math.atan2(moveDir.x, moveDir.z);
          localProxy.current.rotation.y = THREE.MathUtils.lerp(
            localProxy.current.rotation.y,
            targetRotation,
            ROTATION_SPEED * delta
          );

          if (currentTime - lastMoveSync > MOVE_SYNC_INTERVAL) {
            onLocalMoveRef.current(
              { x: localProxy.current.position.x, y: localProxy.current.position.y, z: localProxy.current.position.z },
              { x: 0, y: localProxy.current.rotation.y, z: 0 }
            );
            lastMoveSync = currentTime;
          }
        }

        // Follow cam
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, localProxy.current.position.x, 0.1);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, localProxy.current.position.z + 20, 0.1);
        camera.lookAt(localProxy.current.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [localSlotId]);

  // Sync Local Ghost Mesh
  const localMeshRef = useRef<THREE.Group | null>(null);
  useEffect(() => {
    if (!localSlotId || !sceneRef.current) return;

    const loadId = `local-${localSlotId}`;
    if (pendingLoads.current.has(loadId)) return;
    pendingLoads.current.add(loadId);

    const modelPath = `/models/${THREE_SLOT_MODELS[localSlotId]}`;
    loader.current.load(modelPath, (glb) => {
      pendingLoads.current.delete(loadId);
      if (!sceneRef.current || !localSlotId) return;

      if (localMeshRef.current) sceneRef.current.remove(localMeshRef.current);
      localMeshRef.current = glb.scene;
      localMeshRef.current.scale.setScalar(GHOST_SCALE);
      localMeshRef.current.position.copy(localProxy.current.position);
      localMeshRef.current.rotation.copy(localProxy.current.rotation);
      sceneRef.current.add(localMeshRef.current);
    });
  }, [localSlotId]);

  // Update local mesh every frame
  useEffect(() => {
    let animId: number;
    const update = () => {
      if (localMeshRef.current) {
        localMeshRef.current.position.x = localProxy.current.position.x;
        localMeshRef.current.position.y = localProxy.current.position.y + GHOST_Y_OFFSET;
        localMeshRef.current.position.z = localProxy.current.position.z;
        localMeshRef.current.rotation.copy(localProxy.current.rotation);
      }
      animId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Sync Remote Ghosts
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove stale ghosts
    remoteGhosts.current.forEach((group, uid) => {
      if (!remotePlayers[uid]) {
        sceneRef.current?.remove(group);
        remoteGhosts.current.delete(uid);
      }
    });

    // Add/Update current ghosts
    Object.entries(remotePlayers).forEach(([uid, player]) => {
      if (!player.slotId) return;

      let ghost = remoteGhosts.current.get(uid);
      if (!ghost && !pendingLoads.current.has(uid)) {
        pendingLoads.current.add(uid);
        const modelPath = `/models/${THREE_SLOT_MODELS[player.slotId]}`;

        loader.current.load(modelPath, (glb) => {
          pendingLoads.current.delete(uid);

          // Verify player still exists and needs this model using ref for latest state
          if (!sceneRef.current || !remotePlayersRef.current[uid]) return;

          const newGhost = glb.scene;
          newGhost.scale.setScalar(GHOST_SCALE);
          newGhost.position.set(player.position.x, player.position.y + GHOST_Y_OFFSET, player.position.z);
          newGhost.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);

          sceneRef.current.add(newGhost);
          remoteGhosts.current.set(uid, newGhost);
        });
      } else if (ghost instanceof THREE.Group) {
        ghost.position.set(player.position.x, player.position.y + GHOST_Y_OFFSET, player.position.z);
        ghost.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);
      }
    });
  }, [remotePlayers]);

  return <div ref={mountRef} className="h-full w-full" />;
}
