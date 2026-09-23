import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { NL3_TUNING, type ParticleStateId } from '../../../config/newLanding3Scene';
import { buildAllSectionTargets } from '../../../lib/particles/sections';
import type { ParticleTarget, ProgressBus } from '../../../lib/particles/types';
import { AmbientParticles } from './AmbientParticles';
import { CameraRig } from './CameraRig';
import { EnvironmentTerrain } from './EnvironmentTerrain';
import { MainParticles } from './MainParticles';

type Targets = Record<ParticleStateId, ParticleTarget>;

export default function ParticleMorphCanvas({
  bus,
  particleCount,
  ambientCount,
  bloom,
  dpr,
  reducedMotion,
  isMobile,
  debugForceState,
  onTargetsReady,
  overlayFade = 0,
}: {
  bus: ProgressBus;
  particleCount: number;
  ambientCount: number;
  bloom: (typeof NL3_TUNING.bloom)['desktop'];
  dpr: [number, number];
  reducedMotion: boolean;
  isMobile: boolean;
  debugForceState: ParticleStateId | null;
  onTargetsReady?: () => void;
  overlayFade?: number;
}) {
  const [targets, setTargets] = useState<Targets | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // كل سكشن من ملفه: heroSectionAnimation / shiftSectionAnimation / morphBridge
      const built = await buildAllSectionTargets(particleCount);
      if (!cancelled) {
        setTargets(built);
        onTargetsReady?.();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [particleCount, onTargetsReady]);

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(NL3_TUNING.colors.bgDeep), 1);
      }}
      camera={{
        position: NL3_TUNING.camera.start.position,
        fov: NL3_TUNING.camera.start.fov,
        near: 0.1,
        far: 60,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[NL3_TUNING.colors.bgPure || NL3_TUNING.colors.bgDeep]} />
      <fog attach="fog" args={[NL3_TUNING.colors.bgDeep, 12, 32]} />
      <ambientLight intensity={0.25} />

      <CameraRig bus={bus} reducedMotion={reducedMotion} isMobile={isMobile} />
      <AmbientParticles count={ambientCount} bus={bus} reducedMotion={reducedMotion} />
      <EnvironmentTerrain
        count={isMobile ? Math.floor(ambientCount * 0.7) : Math.floor(ambientCount * 0.92)}
        bus={bus}
        reducedMotion={reducedMotion}
      />

      <Suspense fallback={null}>
        {targets ? (
          <MainParticles
            bus={bus}
            targets={targets}
            count={particleCount}
            reducedMotion={reducedMotion}
            debugForceState={debugForceState}
            isMobile={isMobile}
            overlayFade={overlayFade}
          />
        ) : null}
      </Suspense>

      {bloom.enabled && !reducedMotion ? (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={bloom.intensity}
            luminanceThreshold={bloom.luminanceThreshold}
            luminanceSmoothing={bloom.luminanceSmoothing}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
