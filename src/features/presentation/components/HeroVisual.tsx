import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BLENDER = {
  diorama: {
    pos: [-0.210613, 11.4867, 6.10119],
    rot: [0, 0, 45],
    dim: [40, 46.5, 49.5],
  },
  red: {
    pos: [-1.38803, 8.13763, 11.7951],
    rot: [-1.79982, -14.4155, -15.054],
  },
  blue: {
    pos: [-8.60154, 23.638, 25.6323],
    rot: [28.5256, 44.9198, 20.6502],
    dim: [1, 1, 2],
  },
  green: {
    pos: [6.81631, 8.79447, 18.5554],
    rot: [4.76954, -14.5964, -1.5697],
    dim: [1, 1, 2],
  },
  purple: {
    pos: [-7.20747, 24.1785, 11.5395],
    rot: [-8.7537, 49.5327, -29.62],
    dim: [1, 1, 2],
  },
  darkBlue: {
    pos: [-20.4344, 15.2605, 10.8325],
    rot: [-2.53757, -43.5884, 174.4929],
    dim: [1, 1, 2],
  },
};

const DEG = Math.PI / 180;

function blenderPos([x, y, z]: number[]): [number, number, number] {
  return [x, z, -y];
}

function blenderRot([x, y, z]: number[]) {
  return new THREE.Euler(x * DEG, z * DEG, -y * DEG, 'YXZ');
}

function getScaled() {
  const scale = 1 / Math.max(...BLENDER.diorama.dim);
  const originBL = BLENDER.diorama.pos;
  const origin3 = blenderPos(originBL);

  function s(blPos: number[]): [number, number, number] {
    const [tx, ty, tz] = blenderPos(blPos);
    return [(tx - origin3[0]) * scale, (ty - origin3[1]) * scale, (tz - origin3[2]) * scale];
  }

  return {
    diorama: s(BLENDER.diorama.pos),
    red: s(BLENDER.red.pos),
    blue: s(BLENDER.blue.pos),
    green: s(BLENDER.green.pos),
    purple: s(BLENDER.purple.pos),
    darkBlue: s(BLENDER.darkBlue.pos),
    scale,
  };
}

export default function HeroVisual() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current as HTMLElement | null;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.001, 100);

    camera.position.set(0, 0.18, 1.4);
    camera.lookAt(0, 0.08, 0);

    const ambientLight = new THREE.AmbientLight(0xfff4e0, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8e7, 2.4);
    sunLight.position.set(3, 5, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 30;
    sunLight.shadow.camera.left = -2;
    sunLight.shadow.camera.right = 2;
    sunLight.shadow.camera.top = 2;
    sunLight.shadow.camera.bottom = -2;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xc8e8ff, 0.6);
    fillLight.position.set(-2, 2, -1);
    scene.add(fillLight);

    const N = getScaled();

    const loader = new GLTFLoader();
    const BASE = '/models/';

    const ghostPivot = new THREE.Group();
    scene.add(ghostPivot);

    const dioramaGroup = new THREE.Group();
    scene.add(dioramaGroup);

    const ghosts: Record<string, THREE.Object3D> = {};

    let loadedCount = 0;
    const TOTAL = 6;

    function onLoaded() {
      loadedCount++;
      if (loadedCount === TOTAL) fitCamera();
    }

    function loadModel(
      file: string,
      group: THREE.Group,
      pos: [number, number, number],
      rot: number[],
      key: string | null,
    ) {
      loader.load(
        BASE + file,
        (glb) => {
          const model = glb.scene;
          model.position.set(...pos);
          model.setRotationFromEuler(blenderRot(rot));
          model.scale.setScalar(N.scale);
          model.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const mesh = node as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = false;
            }
          });
          group.add(model);
          if (key) ghosts[key] = model;
          onLoaded();
        },
        undefined,
        (err) => {
          console.warn(`Could not load ${file}:`, err);
          onLoaded();
        },
      );
    }

    loadModel('diorama.glb', dioramaGroup, N.diorama, BLENDER.diorama.rot, null);
    loadModel('redGhost.glb', ghostPivot, N.red, BLENDER.red.rot, 'red');
    loadModel('blueGhost.glb', ghostPivot, N.blue, BLENDER.blue.rot, 'blue');
    loadModel('greenGhost.glb', ghostPivot, N.green, BLENDER.green.rot, 'green');
    loadModel('purpleGhost.glb', ghostPivot, N.purple, BLENDER.purple.rot, 'purple');
    loadModel('darkBlueGhost.glb', ghostPivot, N.darkBlue, BLENDER.darkBlue.rot, 'darkBlue');

    /* ── Camera framing (runs once all models are loaded) ─────────────── */
    function fitCamera() {
      // Frame the entire scene (diorama + ghosts)
      const box = new THREE.Box3();
      box.expandByObject(dioramaGroup);
      box.expandByObject(ghostPivot);

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fovRad = camera.fov * DEG;
      let dist = maxDim / 2 / Math.tan(fovRad / 2);
      dist *= 1; // padding

      camera.position.set(center.x, center.y + size.y * 0.05, center.z + dist);
      camera.lookAt(center.x, center.y - size.y * 0.05, center.z);
      camera.updateProjectionMatrix();
    }

    const mouse = { x: 0, y: 0 };
    const targetGhostOffset = new THREE.Vector2(0, 0);
    const currentGhostOffset = new THREE.Vector2(0, 0);
    const PARALLAX_STRENGTH = 0.04;

    function onMouseMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetGhostOffset.set(mouse.x * PARALLAX_STRENGTH, mouse.y * PARALLAX_STRENGTH * 0.5);
    }

    function onMouseLeave() {
      targetGhostOffset.set(0, 0);
    }

    container.addEventListener('mousemove', onMouseMove as EventListener);
    container.addEventListener('mouseleave', onMouseLeave as EventListener);

    /* ── Scroll animation for blueGhost ──────────────────────────────── */
    const blueRestY = N.blue[1];
    const blueTargetY = blueRestY - 0.35;
    let blueScrollT = 0;

    function onScroll() {
      if (!container) return;
      const heroSection = container.closest('section');
      if (!heroSection) return;
      const heroH = heroSection.offsetHeight;
      const scrolled = window.scrollY;
      blueScrollT = Math.min(1, Math.max(0, scrolled / (heroH * 0.8)));
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Animation loop ───────────────────────────────────────────────── */
    let animId: number | undefined;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth parallax
      currentGhostOffset.lerp(targetGhostOffset, 0.06);
      ghostPivot.position.set(currentGhostOffset.x, currentGhostOffset.y, 0);

      // Idle float
      if (ghosts.red) ghosts.red.position.y = N.red[1] + Math.sin(t * 0.9 + 0.0) * 0.008;
      if (ghosts.green) ghosts.green.position.y = N.green[1] + Math.sin(t * 0.8 + 1.2) * 0.01;
      if (ghosts.purple) ghosts.purple.position.y = N.purple[1] + Math.sin(t * 1.0 + 2.4) * 0.007;
      if (ghosts.darkBlue)
        ghosts.darkBlue.position.y = N.darkBlue[1] + Math.sin(t * 0.7 + 0.8) * 0.009;

      // Blue ghost scroll descent + fade
      if (ghosts.blue) {
        const targetY = THREE.MathUtils.lerp(blueRestY, blueTargetY, blueScrollT);
        ghosts.blue.position.y = targetY + Math.sin(t * 1.1 + 3.0) * 0.007;
        ghosts.blue.traverse((node) => {
          const mesh = node as THREE.Mesh;
          if (mesh.isMesh && mesh.material && 'opacity' in mesh.material) {
            const material = mesh.material as THREE.Material & { opacity: number; transparent: boolean };
            material.transparent = true;
            material.opacity = THREE.MathUtils.lerp(1, 0.15, blueScrollT);
          }
        });
      }

      renderer.render(scene, camera);
    }

    animate();

    /* ── Resize ───────────────────────────────────────────────────────── */
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId as number);
      container.removeEventListener('mousemove', onMouseMove as EventListener);
      container.removeEventListener('mouseleave', onMouseLeave as EventListener);
      window.removeEventListener('scroll', onScroll as EventListener);
      ro.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: 'auto',
      }}
    />
  );
}
