import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENE_TUNING } from '../../../config/landingScene';
import { damp, eased, mulberry32, sampleStage } from '../../../lib/animations/math';
import { PARTICLE_FRAGMENT, PARTICLE_VERTEX } from '../shaders';
import type { SceneProps } from '../types';

const COLOR_ELECTRIC = new THREE.Color(SCENE_TUNING.colors.electric);
const COLOR_MAGENTA = new THREE.Color(SCENE_TUNING.colors.magenta);

export function Particles({ scroll, quality }: SceneProps) {
  const count = quality.particles;
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const rng = mulberry32(90210);
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const axis = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const orbit = new Float32Array(count * 3);
    const rnd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const u = rng() * 2 - 1;
      const theta = rng() * Math.PI * 2;
      const s = Math.sqrt(Math.max(0, 1 - u * u));
      const ax = s * Math.cos(theta);
      const ay = u;
      const az = s * Math.sin(theta);

      axis[i * 3] = ax;
      axis[i * 3 + 1] = ay;
      axis[i * 3 + 2] = az;

      const tr = 1.05 + rng() * 0.12;
      target[i * 3] = ax * tr;
      target[i * 3 + 1] = ay * tr * 0.92;
      target[i * 3 + 2] = az * tr;

      const band = Math.floor(rng() * 4);
      orbit[i * 3] = 1.9 + band * 0.62 + rng() * 0.24;
      orbit[i * 3 + 1] = (0.16 + rng() * 0.2) * (band % 2 === 0 ? 1 : -1);
      orbit[i * 3 + 2] = rng() * Math.PI * 2;
      rnd[i] = rng();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aAxis', new THREE.BufferAttribute(axis, 3));
    geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    geo.setAttribute('aOrbit', new THREE.BufferAttribute(orbit, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uConverge: { value: 0 },
      uSize: { value: 4.5 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uColorA: { value: COLOR_ELECTRIC.clone() },
      uColorB: { value: COLOR_MAGENTA.clone() },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      quality.dpr[1],
    );
  }, [uniforms, quality.dpr, viewport.dpr]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    if (!SCENE_TUNING.enableSceneAnimation) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const stage = sampleStage(scroll.current.progress);
    const burst = Math.max(stage.impact, stage.finale * 0.35);
    const converge = stage.finale;
    const visible = Math.max(
      stage.impact * 0.95,
      stage.finale * 0.75,
      eased(scroll.current.progress, 0.5, 0.62) * 0.35,
    );

    uniforms.uTime.value = t;
    uniforms.uBurst.value = damp(uniforms.uBurst.value, burst, 5, dt);
    uniforms.uConverge.value = damp(uniforms.uConverge.value, converge, 5, dt);
    uniforms.uOpacity.value = damp(uniforms.uOpacity.value, visible * 0.95, 4, dt);

    if (pointsRef.current) {
      pointsRef.current.visible = uniforms.uOpacity.value > 0.01;
      pointsRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
