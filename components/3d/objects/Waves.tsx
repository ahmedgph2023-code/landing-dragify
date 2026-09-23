import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENE_TUNING } from '../../../config/landingScene';
import { sampleStage } from '../../../lib/animations/math';
import type { SceneProps } from '../types';

const COLOR_ELECTRIC = new THREE.Color(SCENE_TUNING.colors.electric);
const COLOR_MAGENTA = new THREE.Color(SCENE_TUNING.colors.magenta);
const WAVE_COUNT = 4;

export function Waves({ scroll }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: WAVE_COUNT }, (_, i) => ({
        offset: i / WAVE_COUNT,
        tilt: (i % 2 === 0 ? 1 : -1) * (0.25 + i * 0.12),
      })),
    [],
  );

  const geometry = useMemo(() => new THREE.TorusGeometry(1, 0.006, 3, 96), []);
  const materials = useMemo(
    () =>
      rings.map(
        (_, i) =>
          new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? COLOR_ELECTRIC : COLOR_MAGENTA,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
      ),
    [rings],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    },
    [geometry, materials],
  );

  useFrame((state) => {
    if (!SCENE_TUNING.enableSceneAnimation) return;
    const t = state.clock.elapsedTime;
    const stage = sampleStage(scroll.current.progress);
    const active =
      Math.max(stage.orchestration, stage.impact * 0.45, stage.finale * 0.35) *
      (0.55 + 0.45 * (1 - stage.finale * 0.3));

    const group = groupRef.current;
    if (!group) return;
    group.visible = active > 0.01;
    if (!group.visible) return;

    group.children.forEach((child, i) => {
      const ring = rings[i];
      const cycle = (t * 0.32 + ring.offset) % 1;
      child.scale.setScalar(1 + cycle * 6.5);
      child.rotation.x = Math.PI / 2 + ring.tilt + Math.sin(t * 0.3 + i) * 0.15;
      child.rotation.z = t * 0.1 * (i % 2 === 0 ? 1 : -1);
      materials[i].opacity = active * Math.pow(1 - cycle, 1.8) * 0.9;
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((_, i) => (
        <mesh key={i} geometry={geometry} material={materials[i]} />
      ))}
    </group>
  );
}
