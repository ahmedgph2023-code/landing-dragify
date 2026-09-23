import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { NL2_TUNING } from '../../../config/newLanding2Scene';
import type { ProgressBus } from '../../../lib/new-landing-2/scrollEngine';
import { CameraRig } from './CameraRig';
import { EnergyParticles } from './EnergyParticles';
import { MorphWorld } from './MorphWorld';

export type SceneQuality = {
  nodes: number;
  particles: number;
  dpr: [number, number];
  bloom: boolean;
};

export default function SceneCanvas({
  bus,
  quality,
  reducedMotion,
}: {
  bus: ProgressBus;
  quality: SceneQuality;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={quality.dpr}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.2, 9.5], fov: 42, near: 0.1, far: 80 }}
    >
      <Suspense fallback={null}>
        <CameraRig bus={bus} reducedMotion={reducedMotion} />
        <MorphWorld
          bus={bus}
          nodeCount={quality.nodes}
          reducedMotion={reducedMotion}
        />
        <EnergyParticles bus={bus} count={quality.particles} />
        {quality.bloom && !reducedMotion ? (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.65}
              luminanceThreshold={0.32}
              luminanceSmoothing={0.7}
              mipmapBlur
              radius={0.55}
            />
            <Vignette offset={0.28} darkness={0.75} eskil={false} />
          </EffectComposer>
        ) : null}
      </Suspense>
    </Canvas>
  );
}

export { NL2_TUNING };
