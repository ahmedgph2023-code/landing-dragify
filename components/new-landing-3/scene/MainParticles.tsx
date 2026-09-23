import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  NL3_TUNING,
  sampleMorphProgress,
  type ParticleStateId,
} from '../../../config/newLanding3Scene';
import { CHOREO, sampleIconOffset, sampleIconScale } from '../../../lib/particles/choreography';
import { damp, hash2, morphArcOffset, smoothstep } from '../../../lib/particles/noise';
import {
  MAIN_FRAG,
  MAIN_VERT,
  createSoftParticleTexture,
} from '../../../lib/particles/shaders';
import { NL3_SECTIONS } from '../../../lib/particles/sections/registry';
import type { ParticleTarget, ProgressBus } from '../../../lib/particles/types';

type Targets = Record<ParticleStateId, ParticleTarget>;

/**
 * ONE main particle system — morph hold → dissolve → reassemble.
 * Particles stay on the RIGHT beside copy.
 */
export function MainParticles({
  bus,
  targets,
  count,
  reducedMotion,
  debugForceState,
  isMobile,
  overlayFade = 0,
}: {
  bus: ProgressBus;
  targets: Targets;
  count: number;
  reducedMotion: boolean;
  debugForceState: ParticleStateId | null;
  isMobile: boolean;
  /** 0–1 — fade morph particles when Studio section-2 overlay is visible */
  overlayFade?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mapTex = useMemo(() => createSoftParticleTexture(64), []);
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const offsetSmooth = useRef(new THREE.Vector3(...NL3_TUNING.visualOffset));
  const offsetBooted = useRef(false);
  const _hit = useRef(new THREE.Vector3());
  const _dir = useRef(new THREE.Vector3());
  const _core = useRef(new THREE.Color());
  const _glow = useRef(new THREE.Color());
  const _accent = useRef(new THREE.Color());
  const { camera } = useThree();

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const bright = new Float32Array(count);
    const cloud = targets.dissolve?.positions;
    const hero = targets.hero?.positions;
    for (let i = 0; i < count; i++) {
      const src = cloud ?? hero;
      if (src) {
        pos[i * 3] = src[i * 3];
        pos[i * 3 + 1] = src[i * 3 + 1];
        pos[i * 3 + 2] = src[i * 3 + 2];
      }
      rnd[i] = Math.random();
      bright[i] = 0.55 + Math.random() * 0.45;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    geo.setAttribute('aBright', new THREE.BufferAttribute(bright, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 22);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: NL3_TUNING.particleSize },
        uPR: { value: 1 },
        uIdle: { value: NL3_TUNING.idle.amplitude },
        uOpacity: { value: NL3_TUNING.particleOpacity },
        uCore: { value: new THREE.Color(NL3_TUNING.colors.core) },
        uGlow: { value: new THREE.Color(NL3_TUNING.colors.glow) },
        uAccent: { value: new THREE.Color('#5b9dff') },
        uColorMix: { value: 0.35 },
        uMap: { value: mapTex },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseStrength: { value: 0 },
        uMouseRadius: { value: CHOREO.mouse.mainRadius },
      },
      vertexShader: MAIN_VERT,
      fragmentShader: MAIN_FRAG,
    });

    return { geometry: geo, material: mat };
  }, [count, targets.dissolve, targets.hero, mapTex]);

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
    const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    const progress = bus.progress;
    const intro = reducedMotion ? 1 : bus.intro;

    // CRITICAL: once user scrolls, scroll owns the timeline (cancel intro morph lock)
    if (progress > 0.012 && intro < 1) {
      bus.intro = 1;
    }

    let fromId: ParticleStateId = 'hero';
    let toId: ParticleStateId = 'dissolve';
    let localT = 0;
    let kind: 'hold' | 'dissolve' | 'reassemble' = 'hold';

    if (debugForceState) {
      fromId = debugForceState;
      toId = debugForceState;
      localT = 0;
      kind = 'hold';
    } else if (bus.intro < 0.999 && progress < 0.012) {
      fromId = 'dissolve';
      toId = 'hero';
      localT = smoothstep(0, 1, bus.intro);
      kind = 'reassemble';
    } else {
      const sample = sampleMorphProgress(progress);
      fromId = sample.from;
      toId = sample.to;
      localT = sample.localT;
      kind = sample.kind;
    }

    const from = targets[fromId]?.positions;
    const to = targets[toId]?.positions;
    if (!from || !to) return;

    // Professional ease — slow assemble, no snap
    const workflowMorph =
      (fromId === 'hero' || fromId === 'heroNode' || fromId === 'heroChain' || fromId === 'heroFlow') &&
      (toId === 'hero' || toId === 'heroNode' || toId === 'heroChain' || toId === 'heroFlow');

    const morphT =
      kind === 'dissolve'
        ? smoothstep(0, 1, localT * localT * (3 - 2 * localT))
        : kind === 'reassemble'
          ? smoothstep(0, 1, Math.pow(localT, workflowMorph ? 1.05 : 1.15))
          : 0;

    // Soft random drift — avoid reinforcing any spoke geometry
    const explode =
      kind === 'dissolve'
        ? Math.sin(Math.PI * morphT) * NL3_TUNING.dispersion * 0.55
        : kind === 'reassemble'
          ? Math.sin(Math.PI * (1 - morphT)) * NL3_TUNING.dispersion * (workflowMorph ? 0.12 : 0.4)
          : 0;

    const chaos =
      NL3_TUNING.chaosStrength *
      Math.sin(Math.PI * Math.max(morphT, kind === 'hold' ? 0 : localT)) *
      (kind === 'dissolve' ? 0.85 : kind === 'reassemble' ? (workflowMorph ? 0.06 : 0.28) : 0.04);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = kind === 'hold' ? 0 : morphT;
      const [ox, oy, oz] = morphArcOffset(
        i,
        t || 0.001,
        NL3_TUNING.dispersion * (workflowMorph ? 0.08 : 0.35 + chaos * 0.55),
      );

      // Deterministic fly-out direction per particle
      const dx = hash2(i, 91) * 2 - 1;
      const dy = hash2(i, 92) * 2 - 1;
      const dz = hash2(i, 93) * 2 - 1;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

      arr[i3] = from[i3] + (to[i3] - from[i3]) * t + ox + (dx / len) * explode;
      arr[i3 + 1] = from[i3 + 1] + (to[i3 + 1] - from[i3 + 1]) * t + oy + (dy / len) * explode * 0.7;
      arr[i3 + 2] = from[i3 + 2] + (to[i3 + 2] - from[i3 + 2]) * t + oz + (dz / len) * explode * 0.55;
    }
    attr.needsUpdate = true;

    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Sharper dots on stats; cinematic cyan palette on agents
    const holdSection =
      NL3_SECTIONS.find((s) => progress >= s.range[0] && progress < s.range[1]) ??
      NL3_SECTIONS[NL3_SECTIONS.length - 1];
    const isAgents = holdSection.id === 'agents';
    const isIntegrations = holdSection.id === 'integrations';
    const isStats = holdSection.id === 'stats';
    const isHow = holdSection.id === 'how';
    const isFaq = holdSection.id === 'faq';
    const isHero = holdSection.id === 'hero';
    const isPartners = holdSection.id === 'partners';
    const cinematic =
      isAgents || isIntegrations || isStats || isHow || isFaq || isHero || isPartners;
    const sizeTarget = isStats
      ? NL3_TUNING.particleSize * 0.78
      : isHero
        ? NL3_TUNING.particleSize * 1.12
      : isPartners
        ? NL3_TUNING.particleSize * 0.98
      : cinematic
        ? NL3_TUNING.particleSize * 1.05
        : NL3_TUNING.particleSize;
    const opacityTarget =
      (isStats
        ? Math.min(1, NL3_TUNING.particleOpacity * 1.1)
        : isHero
          ? Math.min(1, NL3_TUNING.particleOpacity * 1.08)
          : isPartners
            ? Math.min(1, NL3_TUNING.particleOpacity * 1.06)
            : cinematic
              ? Math.min(1, NL3_TUNING.particleOpacity * 1.04)
              : NL3_TUNING.particleOpacity) * (1 - Math.min(1, Math.max(0, overlayFade)));
    material.uniforms.uSize.value = damp(material.uniforms.uSize.value, sizeTarget, 8, delta);
    material.uniforms.uOpacity.value = damp(material.uniforms.uOpacity.value, opacityTarget, 8, delta);

    const coreHex = cinematic ? '#c8fff8' : NL3_TUNING.colors.core;
    const glowHex = cinematic ? '#2be9d1' : NL3_TUNING.colors.glow;
    const accentHex = isAgents
      ? '#7a6cff'
      : isIntegrations
        ? '#4f8cff'
        : isStats
          ? '#9b6cff'
          : isHow
            ? '#8b5cf6'
            : isFaq
              ? '#7c6bff'
              : isHero
                ? '#9b6cff'
                : isPartners
                  ? '#5b9dff'
                  : '#3dd4c0';
    const mixTarget = isHero ? 0.78 : isPartners ? 0.42 : isStats ? 0.55 : cinematic ? 0.68 : 0.28;
    const k = 1 - Math.exp(-8 * delta);
    (material.uniforms.uCore.value as THREE.Color).lerp(_core.current.set(coreHex), k);
    (material.uniforms.uGlow.value as THREE.Color).lerp(_glow.current.set(glowHex), k);
    (material.uniforms.uAccent.value as THREE.Color).lerp(_accent.current.set(accentHex), k);
    material.uniforms.uColorMix.value = damp(material.uniforms.uColorMix.value, mixTarget, 8, delta);

    // Composition — smoother follow so morphs feel fluid
    const targetOff = sampleIconOffset(progress, isMobile);
    const followLambda = kind === 'hold' ? 8 : 6;
    if (!offsetBooted.current) {
      offsetSmooth.current.set(targetOff[0], targetOff[1], targetOff[2]);
      offsetBooted.current = true;
    } else {
      offsetSmooth.current.x = damp(offsetSmooth.current.x, targetOff[0], followLambda, delta);
      offsetSmooth.current.y = damp(offsetSmooth.current.y, targetOff[1], followLambda, delta);
      offsetSmooth.current.z = damp(offsetSmooth.current.z, targetOff[2], followLambda, delta);
    }
    if (groupRef.current) {
      groupRef.current.position.copy(offsetSmooth.current);
      const targetScale = sampleIconScale(progress, isMobile);
      const s = groupRef.current.scale.x || targetScale;
      groupRef.current.scale.setScalar(damp(s, targetScale, 7, delta));
    }

    const liveIntro = reducedMotion ? 1 : bus.intro;
    const settle =
      reducedMotion || debugForceState
        ? 0
        : liveIntro < 1
          ? liveIntro * 0.35
          : kind === 'hold'
            ? 1
            : Math.max(0, 1 - Math.abs(localT - 0.5) * 1.5);
    // Kill idle wobble on stats — soft breathing on agents
    const idleMul = holdSection.id === 'stats' ? 0.18 : cinematic ? 0.5 : 0.45;
    material.uniforms.uIdle.value =
      NL3_TUNING.idle.amplitude * settle * idleMul * (reducedMotion ? 0.1 : 1);

    // Convert canvas pointer → icon LOCAL space (accounts for group rotation/scale)
    let localMx = 0;
    let localMy = 0;
    if (groupRef.current && !reducedMotion && !isMobile && kind === 'hold') {
      groupRef.current.updateWorldMatrix(true, false);
      _hit.current.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera);
      _dir.current.copy(_hit.current).sub(camera.position).normalize();
      // Hit plane through icon origin, facing camera roughly on Z
      const icon = groupRef.current.position;
      const denom = _dir.current.z;
      if (Math.abs(denom) > 1e-5) {
        const tHit = (icon.z - camera.position.z) / denom;
        _hit.current.copy(camera.position).addScaledVector(_dir.current, tHit);
        // World → local (undo rotation + scale)
        groupRef.current.worldToLocal(_hit.current);
        localMx = _hit.current.x;
        localMy = _hit.current.y;
      }
    }
    mouseSmooth.current.x = damp(mouseSmooth.current.x, localMx, 7, delta);
    mouseSmooth.current.y = damp(mouseSmooth.current.y, localMy, 7, delta);
    material.uniforms.uMouse.value.set(mouseSmooth.current.x, mouseSmooth.current.y);
    // Only gentle hover while settled — never during morph (prevents shatter)
    material.uniforms.uMouseStrength.value =
      reducedMotion || isMobile || kind !== 'hold' ? 0 : CHOREO.mouse.mainRepel;

    // Gentle ±yaw swing (not a full spin) + soft mouse tilt
    if (groupRef.current) {
      const holdMul = kind === 'hold' ? 1 : 0.2;
      const introMul = liveIntro < 1 ? liveIntro : 1;
      const heroStill = holdSection.id === 'hero' ? 0.45 : 1;
      const amp = ((CHOREO.yawSwingDeg ?? 18) * Math.PI) / 180 * heroStill;
      const period = CHOREO.yawPeriodSec ?? 9.5;
      const targetYaw =
        reducedMotion ? 0 : Math.sin((state.clock.elapsedTime * Math.PI * 2) / period) * amp * holdMul * introMul;
      groupRef.current.rotation.y = damp(groupRef.current.rotation.y, targetYaw, 3.5, delta);

      const tiltX = reducedMotion || isMobile || kind !== 'hold' ? 0 : mouseSmooth.current.y * 0.04;
      const tiltZ = reducedMotion || isMobile || kind !== 'hold' ? 0 : -mouseSmooth.current.x * 0.03;
      groupRef.current.rotation.x = damp(groupRef.current.rotation.x, tiltX, 5, delta);
      groupRef.current.rotation.z = damp(groupRef.current.rotation.z, tiltZ, 5, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
