import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENE_TUNING } from '../../../config/landingScene';
import { damp, sampleStage } from '../../../lib/animations/math';
import { CORE_FRAGMENT, CORE_VERTEX } from '../shaders';
import type { SceneProps } from '../types';

const COLOR_ELECTRIC = new THREE.Color(SCENE_TUNING.colors.electric);
const COLOR_MAGENTA = new THREE.Color(SCENE_TUNING.colors.magenta);

/**
 * Faceted automation hub — procedural by default.
 * To swap for a GLB: set ASSET_SLOTS.heroObject.modelUrl in config/landingScene.ts
 * and render <GltfHub /> instead (see docs).
 */
export function PolymorphicCore({ scroll, bus, isMobile, reducedMotion }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1, isMobile ? 0 : 1),
    [isMobile],
  );
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(1.42, 0.016, 6, 96), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: 0.45 },
      uStructure: { value: 0.0 },
      uFlow: { value: 0.0 },
      uPulse: { value: 0.0 },
      uOpacity: { value: 1.0 },
      uGlow: { value: 0.9 },
      uColorA: { value: COLOR_ELECTRIC.clone() },
      uColorB: { value: COLOR_MAGENTA.clone() },
    }),
    [],
  );

  const shellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: 0.45 },
      uStructure: { value: 0.0 },
      uFlow: { value: 0.0 },
      uPulse: { value: 0.0 },
      uOpacity: { value: 0.12 },
      uGlow: { value: 1.2 },
      uColorA: { value: COLOR_MAGENTA.clone() },
      uColorB: { value: COLOR_ELECTRIC.clone() },
    }),
    [],
  );

  const ringMaterials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({
        color: COLOR_ELECTRIC,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      new THREE.MeshBasicMaterial({
        color: COLOR_MAGENTA,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      new THREE.MeshBasicMaterial({
        color: COLOR_ELECTRIC,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ],
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      ringGeometry.dispose();
      ringMaterials.forEach((m) => m.dispose());
    },
    [geometry, ringGeometry, ringMaterials],
  );

  useFrame((state, delta) => {
    if (!SCENE_TUNING.enableSceneAnimation) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = scroll.current.progress;
    const stage = sampleStage(p);
    const motionScale = reducedMotion ? 0.15 : 1;

    const chaosAmt =
      stage.morph === 'chaos' ? 0.55 : stage.morph === 'resolve' ? 0.08 : 0.12;
    const structureAmt =
      stage.morph === 'structure' ? 0.42 : stage.morph === 'resolve' ? 0.22 : 0.1;
    const flowAmt =
      stage.morph === 'flow' ? 0.55 : stage.morph === 'resolve' ? 0.3 : 0.05;

    uniforms.uChaos.value = damp(uniforms.uChaos.value, chaosAmt * motionScale, 4, dt);
    uniforms.uStructure.value = damp(uniforms.uStructure.value, structureAmt, 4, dt);
    uniforms.uFlow.value = damp(uniforms.uFlow.value, flowAmt * motionScale, 4, dt);

    const beat = Math.pow(Math.max(0, Math.sin(t * 1.9)), 6) * 0.14 * motionScale;
    uniforms.uPulse.value =
      beat * stage.orchestration + Math.sin(t * 1.2) * 0.02 + stage.finale * 0.04;

    const dip = stage.impact * (1 - stage.finale) * 0.45;
    const presence = 1 - dip;
    uniforms.uOpacity.value = damp(uniforms.uOpacity.value, presence, 5, dt);
    uniforms.uGlow.value = damp(
      uniforms.uGlow.value,
      0.85 + stage.orchestration * 0.25 + stage.finale * 0.85,
      3,
      dt,
    );
    uniforms.uTime.value = t;

    shellUniforms.uTime.value = t;
    shellUniforms.uChaos.value = uniforms.uChaos.value * 0.9;
    shellUniforms.uStructure.value = uniforms.uStructure.value;
    shellUniforms.uFlow.value = uniforms.uFlow.value;
    shellUniforms.uPulse.value = uniforms.uPulse.value + 0.06;
    shellUniforms.uOpacity.value = presence * (0.08 + stage.orchestration * 0.08);

    const group = groupRef.current;
    if (!group) return;

    const sideAmp = isMobile ? SCENE_TUNING.sideAmpMobile : SCENE_TUNING.sideAmpDesktop;
    group.position.x = damp(group.position.x, stage.side * sideAmp, 3.2, dt);
    group.position.y = damp(group.position.y, stage.rise, 3.2, dt);
    bus.corePos.copy(group.position);

    const scale =
      SCENE_TUNING.coreBaseScale *
      (1 + stage.orchestration * 0.14 + stage.finale * 0.18 - dip * 0.25);
    group.scale.setScalar(damp(group.scale.x, Math.max(0.001, scale), 4, dt));

    if (!reducedMotion) {
      group.rotation.y += dt * (0.2 + stage.orchestration * 0.28 + stage.finale * 0.15);
      group.rotation.x = Math.sin(t * 0.25) * 0.14;
    }

    if (shellRef.current && !reducedMotion) {
      shellRef.current.rotation.y -= dt * 0.35;
    }

    if (ringsRef.current) {
      const ringPresence =
        0.25 + Math.abs(stage.side) * 0.2 + stage.orchestration * 0.45 + stage.finale * 0.3;
      ringsRef.current.visible = ringPresence > 0.05;
      ringsRef.current.children.forEach((child, i) => {
        if (!reducedMotion) {
          child.rotation.x += dt * (0.35 + i * 0.12) * (i % 2 === 0 ? 1 : -1);
          child.rotation.y += dt * (0.22 + i * 0.08);
        }
        const mat = ringMaterials[i];
        if (mat) mat.opacity = ringPresence * (0.55 - i * 0.1) * presence;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <shaderMaterial
          vertexShader={CORE_VERTEX}
          fragmentShader={CORE_FRAGMENT}
          uniforms={uniforms}
          transparent
        />
      </mesh>
      <mesh ref={shellRef} geometry={geometry} scale={1.14}>
        <shaderMaterial
          vertexShader={CORE_VERTEX}
          fragmentShader={CORE_FRAGMENT}
          uniforms={shellUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      <group ref={ringsRef}>
        <mesh geometry={ringGeometry} material={ringMaterials[0]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh
          geometry={ringGeometry}
          material={ringMaterials[1]}
          rotation={[Math.PI / 3.2, Math.PI / 4, 0]}
          scale={1.08}
        />
        <mesh
          geometry={ringGeometry}
          material={ringMaterials[2]}
          rotation={[-Math.PI / 3.4, -Math.PI / 5, Math.PI / 6]}
          scale={1.16}
        />
      </group>
    </group>
  );
}
