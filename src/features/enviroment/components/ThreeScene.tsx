import type * as CANNON from 'cannon-es';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
  applyDeterioration,
  collectTintMaterials,
  normalizeHealthInput,
  type TintEntry,
} from '../lib/environmentEffects';
import {
  CLEAN_FOG_COLOR,
  CLEAN_SKY_COLOR,
  DIORAMA_SCALE,
  GHOST_SCALE,
  GHOST_Y_OFFSET,
  MAX_PHYSICS_DELTA,
  MOVE_SYNC_INTERVAL,
  PHYSICS_FIXED_STEP,
  PHYSICS_MAX_SUB_STEPS,
} from '../lib/physicsConstants';
import {
  buildDioramaCollisionBodies,
  createGroundPlane,
  createPhysicsWorld,
  createPlayerBody,
} from '../lib/physicsWorld';
import {
  applyMovementInput,
  checkFallRespawn,
  syncBodyToProxy,
  syncMeshToProxy,
} from '../lib/playerController';
import { type SlotId, THREE_SLOT_MODELS, type Vector3State } from '../types/realtime';


interface ThreeSceneProps {
  localSlotId: SlotId | null;
  remotePlayers: Record<string, { position: Vector3State; rotation: Vector3State; slotId: SlotId | null }>;
  onLocalMove: (position: Vector3State, rotation: Vector3State) => void;
  keyboard: { forward: boolean; backward: boolean; left: boolean; right: boolean };
  healthPercent: number;
  onLoaded?: () => void;
}


export default function ThreeScene({
                                     localSlotId,
                                     remotePlayers,
                                     onLocalMove,
                                     keyboard,
                                     healthPercent,
                                     onLoaded,
                                   }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const physicsWorldRef = useRef<CANNON.World | null>(null);
  const localBodyRef = useRef<CANNON.Body | null>(null);
  const environmentBodiesRef = useRef<CANNON.Body[]>([]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const tintMaterialsRef = useRef<Map<string, TintEntry>>(new Map());

  const localProxy = useRef({ position: new THREE.Vector3(), rotation: new THREE.Euler() });
  const localMeshRef = useRef<THREE.Group | null>(null);
  const remoteGhosts = useRef<Map<string, THREE.Group>>(new Map());
  const pendingLoads = useRef<Set<string>>(new Set());

  const loader = useRef(new GLTFLoader());
  const keyboardRef = useRef(keyboard);
  const onLocalMoveRef = useRef(onLocalMove);
  const onLoadedRef = useRef(onLoaded);
  const remotePlayersRef = useRef(remotePlayers);
  const deteriorationRef = useRef(1 - normalizeHealthInput(healthPercent));
  const currentDeteriorationRef = useRef(deteriorationRef.current);

  useEffect(() => { keyboardRef.current = keyboard; }, [keyboard]);
  useEffect(() => { onLocalMoveRef.current = onLocalMove; }, [onLocalMove]);
  useEffect(() => { onLoadedRef.current = onLoaded; }, [onLoaded]);
  useEffect(() => { remotePlayersRef.current = remotePlayers; }, [remotePlayers]);
  useEffect(() => { deteriorationRef.current = 1 - normalizeHealthInput(healthPercent); }, [healthPercent]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const hour = new Date().getHours();
    const isNightTime = hour >= 18 || hour < 6;
    const baseSkyColor = isNightTime ? new THREE.Color('#0042ad') : CLEAN_SKY_COLOR.clone();
    const baseFogColor = isNightTime ? new THREE.Color('#70a7ff') : CLEAN_FOG_COLOR.clone();
    const baseAmbientIntensity = isNightTime ? 0.45 : 0.7;
    const baseSunIntensity = isNightTime ? 0.7 : 1.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = baseSkyColor.clone();
    scene.fog = new THREE.Fog(baseFogColor.clone(), 20, 60);
    sceneRef.current = scene;

    const tintMaterials = tintMaterialsRef.current;


    const ambientLight = new THREE.AmbientLight(0xffffff, baseAmbientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const directionalLight = isNightTime
      ? new THREE.DirectionalLight(0x9bbcff, baseSunIntensity)
      : new THREE.DirectionalLight(0xffffff, baseSunIntensity);

    if (isNightTime) {
      directionalLight.position.set(-6, 8, -5);
    } else {
      directionalLight.position.set(5, 10, 7.5);
      directionalLight.castShadow = true;
    }

    scene.add(directionalLight);
    sunLightRef.current = directionalLight;

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(-30, 10, 30);
    camera.lookAt(0, 0, 0);

    const physicsWorld = createPhysicsWorld();
    physicsWorldRef.current = physicsWorld;

    const groundPlane = createGroundPlane();
    physicsWorld.addBody(groundPlane);

    const localBody = createPlayerBody(0, 0);
    localBodyRef.current = localBody;
    physicsWorld.addBody(localBody);

    loader.current.load('/models/BigDiorama.glb', (glb: GLTF) => {
      glb.scene.scale.setScalar(DIORAMA_SCALE);
      scene.add(glb.scene);

      environmentBodiesRef.current.forEach((b) => physicsWorld.removeBody(b));
      const envBodies = buildDioramaCollisionBodies(glb.scene);
      envBodies.forEach((b) => physicsWorld.addBody(b));
      environmentBodiesRef.current = envBodies;

      collectTintMaterials(glb.scene, tintMaterials);

      glb.scene.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          (node as THREE.Mesh).receiveShadow = true;
        }
      });

      onLoadedRef.current?.();
    });

    let lastTime = performance.now();
    let lastMoveSync = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, MAX_PHYSICS_DELTA);
      lastTime = now;

      currentDeteriorationRef.current = THREE.MathUtils.lerp(
        currentDeteriorationRef.current,
        deteriorationRef.current,
        Math.min(1, delta * 2),
      );
      applyDeterioration({
        scene,
        lights: { ambient: ambientLightRef.current, sun: sunLightRef.current },
        tintMap: tintMaterials,
        deterioration: currentDeteriorationRef.current,
        baseline: {
          skyColor: baseSkyColor,
          fogColor: baseFogColor,
          ambientIntensity: baseAmbientIntensity,
          sunIntensity: baseSunIntensity,
        },
      });

      let isTryingToMove = false;
      const body = localBodyRef.current;

      if (localSlotId && body) {
        isTryingToMove = applyMovementInput(body, keyboardRef.current, localProxy.current, delta);
      }

      physicsWorld.step(PHYSICS_FIXED_STEP, delta, PHYSICS_MAX_SUB_STEPS);

      if (body) {
        checkFallRespawn(body);
        syncBodyToProxy(body, localProxy.current);
      }

      if (localMeshRef.current) {
        syncMeshToProxy(localMeshRef.current, localProxy.current);
      }

      if (localSlotId && isTryingToMove && now - lastMoveSync > MOVE_SYNC_INTERVAL) {
        const { x, y, z } = localProxy.current.position;
        onLocalMoveRef.current(
          { x, y, z },
          { x: 0, y: localProxy.current.rotation.y, z: 0 },
        );
        lastMoveSync = now;
      }

      if (localSlotId) {
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
      environmentBodiesRef.current.forEach((b) => physicsWorld.removeBody(b));
      environmentBodiesRef.current = [];
      physicsWorldRef.current = null;
      localBodyRef.current = null;
      ambientLightRef.current = null;
      sunLightRef.current = null;
      tintMaterials.clear();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [localSlotId]);

  useEffect(() => {
    if (!localSlotId || !sceneRef.current) return;

    const loadId = `local-${localSlotId}`;
    if (pendingLoads.current.has(loadId)) return;
    pendingLoads.current.add(loadId);

    loader.current.load(`/models/${THREE_SLOT_MODELS[localSlotId]}`, (glb: GLTF) => {
      pendingLoads.current.delete(loadId);
      if (!sceneRef.current || !localSlotId) return;

      if (localMeshRef.current) sceneRef.current.remove(localMeshRef.current);
      const mesh = glb.scene;
      mesh.scale.setScalar(GHOST_SCALE);
      mesh.position.set(
        localProxy.current.position.x,
        localProxy.current.position.y + GHOST_Y_OFFSET,
        localProxy.current.position.z,
      );
      mesh.rotation.copy(localProxy.current.rotation);
      sceneRef.current.add(mesh);
      localMeshRef.current = mesh;
    });
  }, [localSlotId]);

  useEffect(() => {
    if (!sceneRef.current) return;

    remoteGhosts.current.forEach((group, uid) => {
      if (!remotePlayers[uid]) {
        sceneRef.current?.remove(group);
        remoteGhosts.current.delete(uid);
      }
    });

    Object.entries(remotePlayers).forEach(([uid, player]) => {
      if (!player.slotId) return;

      const existing = remoteGhosts.current.get(uid);
      if (!existing && !pendingLoads.current.has(uid)) {
        pendingLoads.current.add(uid);
        loader.current.load(`/models/${THREE_SLOT_MODELS[player.slotId]}`, (glb: GLTF) => {
          pendingLoads.current.delete(uid);
          if (!sceneRef.current || !remotePlayersRef.current[uid]) return;

          const ghost = glb.scene;
          ghost.scale.setScalar(GHOST_SCALE);
          ghost.position.set(player.position.x, player.position.y + GHOST_Y_OFFSET, player.position.z);
          ghost.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);
          sceneRef.current.add(ghost);
          remoteGhosts.current.set(uid, ghost);
        });
      } else if (existing) {
        existing.position.set(player.position.x, player.position.y + GHOST_Y_OFFSET, player.position.z);
        existing.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);
      }
    });
  }, [remotePlayers]);

  return <div ref={mountRef} className="h-full w-full" />;
}
