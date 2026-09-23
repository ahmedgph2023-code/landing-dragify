/**
 * Full-viewport digital terrain / particle floor.
 * Independent of MainParticles morph targets — spans 100% of the
 * WebGL view behind BOTH copy and visual hubs.
 *
 * Reference look: perspective cyan grid, flowing waves, horizontal
 * streams, vertical data columns, energy well under the hero robot.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NL3_TUNING } from '../../../config/newLanding3Scene';
import { hash2 } from '../../../lib/particles/noise';
import {
  AMBIENT_FRAG,
  AMBIENT_VERT,
  createSoftParticleTexture,
} from '../../../lib/particles/shaders';
import type { ProgressBus } from '../../../lib/particles/types';

export function EnvironmentTerrain({
  count,
  bus,
  reducedMotion,
}: {
  count: number;
  bus: ProgressBus;
  reducedMotion: boolean;
}) {
  const mapTex = useMemo(() => createSoftParticleTexture(64), []);
  const baseRef = useRef<Float32Array | null>(null);
  const beamMaskRef = useRef<Uint8Array | null>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const base = new Float32Array(count * 3);
    const beamMask = new Uint8Array(count);

    // Perspective digital floor — glued to the BOTTOM of the viewport
    // v=0 = near edge (screen bottom), v=1 = far horizon (still in lower band)
    const meshBudget = Math.floor(count * 0.68);
    const cols = Math.max(72, Math.floor(Math.sqrt(meshBudget * 2.8)));
    const rows = Math.max(28, Math.ceil(meshBudget / cols));

    let i = 0;
    for (let row = 0; row < rows && i < meshBudget; row++) {
      const v = row / Math.max(1, rows - 1);
      const vd = Math.pow(v, 0.82);
      for (let col = 0; col < cols && i < meshBudget; col++) {
        const u = col / Math.max(1, cols - 1);
        const halfW = 10.5 + vd * 9.5;
        const x = (u * 2 - 1) * halfW;
        // Stick to screen bottom (~y=-2.55 near) — do NOT float mid-frame
        const y = -2.52 - vd * 1.55;
        const z = 0.35 - vd * 8.4;
        const wave =
          Math.sin(u * Math.PI * 4.2 + vd * 2.6) * (0.04 + vd * 0.05) +
          Math.sin(u * Math.PI * 11 + vd * 1.4) * 0.018 * (1 - vd * 0.4);

        base[i * 3] = x;
        base[i * 3 + 1] = y + wave;
        base[i * 3 + 2] = z;
        pos[i * 3] = base[i * 3];
        pos[i * 3 + 1] = base[i * 3 + 1];
        pos[i * 3 + 2] = base[i * 3 + 2];
        rnd[i] = 0.4 + hash2(i, 3) * 0.6 * (1 - vd * 0.3);
        beamMask[i] = wave > 0.045 && hash2(i, 4) > 0.91 ? 1 : 0;
        i++;
      }
    }

    // Horizontal particle streams along the bottom band
    const streamBudget = Math.min(count - i, Math.floor(count * 0.12));
    const streamLanes = 7;
    const perLane = Math.floor(streamBudget / streamLanes);
    for (let lane = 0; lane < streamLanes && i < count; lane++) {
      const n = lane === streamLanes - 1 ? streamBudget - perLane * lane : perLane;
      const depth = lane / Math.max(1, streamLanes - 1);
      const zy = 0.15 - depth * 5.2;
      const yy = -2.48 - depth * 1.35;
      for (let k = 0; k < n && i < count; k++) {
        const u = k / Math.max(1, n - 1);
        const x = (u * 2 - 1) * (11 + depth * 6) + Math.sin(u * Math.PI * 6 + lane) * 0.12;
        base[i * 3] = x;
        base[i * 3 + 1] = yy + Math.sin(u * Math.PI * 3 + lane * 0.7) * 0.035;
        base[i * 3 + 2] = zy + (hash2(i, 5) * 2 - 1) * 0.06;
        pos[i * 3] = base[i * 3];
        pos[i * 3 + 1] = base[i * 3 + 1];
        pos[i * 3 + 2] = base[i * 3 + 2];
        rnd[i] = 0.5 + hash2(i, 6) * 0.5;
        beamMask[i] = 4;
        i++;
      }
    }

    // Vertical data beams from terrain peaks
    const beamBudget = Math.min(count - i, Math.floor(count * 0.1));
    let beams = 0;
    const meshEnd = Math.min(i, meshBudget);
    for (let s = 0; s < meshEnd && beams < beamBudget; s++) {
      if (!beamMask[s]) continue;
      const bx = base[s * 3];
      const by = base[s * 3 + 1];
      const bz = base[s * 3 + 2];
      const segs = 6 + Math.floor(hash2(s, 7) * 8);
      for (let k = 0; k < segs && beams < beamBudget && i < count; k++) {
        const t = (k + 0.5) / segs;
        base[i * 3] = bx + (hash2(s + k, 8) * 2 - 1) * 0.018;
        base[i * 3 + 1] = by + t * (0.22 + hash2(s, 9) * 0.35);
        base[i * 3 + 2] = bz;
        pos[i * 3] = base[i * 3];
        pos[i * 3 + 1] = base[i * 3 + 1];
        pos[i * 3 + 2] = base[i * 3 + 2];
        rnd[i] = 0.6 + hash2(i, 10) * 0.4;
        beamMask[i] = 2;
        i++;
        beams++;
      }
    }

    // Soft atmospheric mist above the mesh — full width
    // NOTE: energy portal under the robot lives ONLY in heroSectionAnimation
    // (MainParticles) — do not duplicate it here (caused blue+white double rings).
    while (i < count) {
      const x = (hash2(i, 15) * 2 - 1) * 13;
      const y = -2.35 - hash2(i, 16) * 1.6;
      const z = -0.2 - hash2(i, 17) * 6;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      rnd[i] = hash2(i, 18);
      beamMask[i] = 0;
      i++;
    }

    baseRef.current = base;
    beamMaskRef.current = beamMask;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0.4, -2.6, -3.2), 28);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: NL3_TUNING.ambientSize * 1.55 },
        uPR: { value: 1 },
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color('#4dd4ff') },
        uMap: { value: mapTex },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseNdc: { value: new THREE.Vector2(0, 0) },
        uParallax: { value: 0 },
        uRepel: { value: 0 },
      },
      vertexShader: AMBIENT_VERT,
      fragmentShader: AMBIENT_FRAG,
    });

    return { geometry: geo, material: mat };
  }, [count, mapTex]);

  useEffect(() => {
    material.uniforms.uPR.value = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      2,
    );
  }, [material]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      mapTex.dispose();
    },
    [geometry, material, mapTex],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;

    const p = bus.progress;
    // Strongest on hero + partners — digital landscape should read clearly
    const sectionBoost =
      p < 0.12 ? 1.28 : p >= 0.5 && p < 0.62 ? 1.22 : p < 0.99 ? 1.05 : 0.85;
    material.uniforms.uOpacity.value = (reducedMotion ? 0.55 : 1) * sectionBoost;

    const base = baseRef.current;
    const beams = beamMaskRef.current;
    const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
    if (base && attr && !reducedMotion) {
      const arr = attr.array as Float32Array;
      const n = Math.min(count, arr.length / 3);
      const speed = 0.58;
      for (let i = 0; i < n; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const bz = base[i * 3 + 2];
        const kind = beams ? beams[i] : 0;
        if (kind === 2) {
          const shimmer = Math.sin(t * 2.4 + by * 4.2 + bx) * 0.022;
          arr[i * 3] = bx;
          arr[i * 3 + 1] = by + shimmer;
          arr[i * 3 + 2] = bz;
        } else if (kind === 4) {
          // Horizontal streams drift along X
          const drift = ((t * 0.35 + hash2(i, 20) * 6) % 1) * 0.4 - 0.2;
          arr[i * 3] = bx + drift;
          arr[i * 3 + 1] = by + Math.sin(t * 1.1 + bx * 0.3) * 0.02;
          arr[i * 3 + 2] = bz;
        } else {
          const wave =
            Math.sin(bx * 0.38 + t * speed) * 0.028 +
            Math.sin(bx * 1.1 + bz * 0.3 + t * speed * 0.75) * 0.018 +
            Math.sin(bz * 0.55 + t * speed * 0.4) * 0.012;
          arr[i * 3] = bx;
          arr[i * 3 + 1] = by + wave;
          arr[i * 3 + 2] = bz;
        }
      }
      attr.needsUpdate = true;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}
