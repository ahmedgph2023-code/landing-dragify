import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NL3_TUNING } from '../../../config/newLanding3Scene';
import { CHOREO } from '../../../lib/particles/choreography';
import { damp, hash2 } from '../../../lib/particles/noise';
import {
  AMBIENT_FRAG,
  AMBIENT_VERT,
  createSoftParticleTexture,
} from '../../../lib/particles/shaders';
import type { ProgressBus } from '../../../lib/particles/types';

/**
 * Ambient starfield + milky-way nebula band (reference look).
 * Never mixed with the main morphing icon system.
 */
export function AmbientParticles({
  count,
  bus,
  reducedMotion,
}: {
  count: number;
  bus: ProgressBus;
  reducedMotion: boolean;
}) {
  const mapTex = useMemo(() => createSoftParticleTexture(64), []);
  const mouseSmooth = useRef({ x: 0, y: 0, ndcX: 0, ndcY: 0 });
  const _hit = useRef(new THREE.Vector3());
  const _dir = useRef(new THREE.Vector3());
  const { camera } = useThree();

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const kind = hash2(i, 0);
      let x: number;
      let y: number;
      let z: number;

      if (kind < 0.48) {
        // Dense deep-space starfield — full sphere behind everything
        const r = 3.5 + hash2(i, 1) * 20;
        const theta = hash2(i, 2) * Math.PI * 2;
        const phi = Math.acos(2 * hash2(i, 3) - 1);
        x = Math.sin(phi) * Math.cos(theta) * r;
        y = Math.sin(phi) * Math.sin(theta) * r * 0.72;
        z = Math.cos(phi) * r - 2.2;
      } else if (kind < 0.68) {
        // Cyan/teal atmospheric band across mid-field (ref glow)
        const t = hash2(i, 4) * 2 - 1;
        const along = t * 14;
        const spread = (0.25 + hash2(i, 5) * 2.2) * (0.3 + Math.abs(t) * 0.6);
        const ang = -0.48;
        const ox = (hash2(i, 6) * 2 - 1) * spread;
        const oy = (hash2(i, 7) * 2 - 1) * spread * 0.5;
        x = Math.cos(ang) * along - Math.sin(ang) * oy + ox * 0.35 + 1.2;
        y = Math.sin(ang) * along + Math.cos(ang) * oy - 0.15;
        z = -1.5 + (hash2(i, 8) * 2 - 1) * 5.5;
      } else if (kind < 0.82) {
        // Soft purple-blue accent dust (cinematic RGB)
        x = (hash2(i, 9) * 2 - 1) * 11 + 1.5;
        y = (hash2(i, 10) * 2 - 1) * 4.8;
        z = -1.2 - hash2(i, 11) * 4.2;
      } else if (kind < 0.93) {
        // Foreground dust across full viewport
        x = (hash2(i, 12) * 2 - 1) * 10;
        y = (hash2(i, 13) * 2 - 1) * 5.2;
        z = -0.6 - hash2(i, 14) * 3.2;
        } else {
          // Extra low haze — glued to bottom band with terrain
          x = (hash2(i, 15) * 2 - 1) * 13;
          y = -2.2 - hash2(i, 16) * 1.4;
          z = -0.4 - hash2(i, 17) * 5;
        }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      rnd[i] = hash2(i, 18);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 28);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: NL3_TUNING.ambientSize },
        uPR: { value: 1 },
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color('#8af0e4') },
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

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // World hit on mid plane — use canvas pointer (aligned with the WebGL view)
    let wx = 0;
    let wy = 0;
    if (!reducedMotion) {
      _hit.current.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera);
      _dir.current.copy(_hit.current).sub(camera.position).normalize();
      const denom = _dir.current.z;
      if (Math.abs(denom) > 1e-5) {
        const tHit = (-2 - camera.position.z) / denom;
        _hit.current.copy(camera.position).addScaledVector(_dir.current, tHit);
        wx = _hit.current.x;
        wy = _hit.current.y;
      }
    }

    mouseSmooth.current.x = damp(mouseSmooth.current.x, wx, 6, delta);
    mouseSmooth.current.y = damp(mouseSmooth.current.y, wy, 6, delta);
    mouseSmooth.current.ndcX = damp(mouseSmooth.current.ndcX, state.pointer.x, 5, delta);
    mouseSmooth.current.ndcY = damp(mouseSmooth.current.ndcY, state.pointer.y, 5, delta);

    material.uniforms.uMouse.value.set(mouseSmooth.current.x, mouseSmooth.current.y);
    material.uniforms.uMouseNdc.value.set(mouseSmooth.current.ndcX, mouseSmooth.current.ndcY);
    const on = reducedMotion ? 0 : 1;
    material.uniforms.uParallax.value = CHOREO.mouse.ambientParallax * on;
    material.uniforms.uRepel.value = CHOREO.mouse.ambientRepel * on;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
