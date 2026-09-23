import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';
import { SCENE_TUNING, type Quality } from '../../config/landingScene';
import type { ScrollState } from '../../lib/animations/scrollState';
import { Atmosphere } from './objects/Atmosphere';
import { PolymorphicCore } from './objects/Core';
import { Fragments } from './objects/Fragments';
import { Particles } from './objects/Particles';
import { Waves } from './objects/Waves';

export type LandingSceneProps = {
  scroll: MutableRefObject<ScrollState>;
  bus: { corePos: THREE.Vector3 };
  quality: Quality;
  isMobile: boolean;
  reducedMotion: boolean;
};

function Experience(props: LandingSceneProps) {
  return (
    <>
      <Atmosphere {...props} />
      <PolymorphicCore {...props} />
      <Fragments {...props} />
      <Waves {...props} />
      <Particles {...props} />
      {props.quality.bloom && !props.reducedMotion ? (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.72}
            luminanceThreshold={0.34}
            luminanceSmoothing={0.7}
            mipmapBlur
            radius={0.6}
          />
          <Vignette offset={0.3} darkness={0.7} eskil={false} />
        </EffectComposer>
      ) : null}
    </>
  );
}

/**
 * Persistent WebGL layer for the immersive home page.
 * Mount once; sections drive visual state via `scroll.current.progress`.
 */
export default function LandingScene(props: LandingSceneProps) {
  if (props.quality.disableWebGL) return null;

  return (
    <Canvas
      dpr={props.quality.dpr}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      camera={{
        position: SCENE_TUNING.camera.start,
        fov: SCENE_TUNING.camera.fov,
        near: SCENE_TUNING.camera.near,
        far: SCENE_TUNING.camera.far,
      }}
    >
      <Suspense fallback={null}>
        <Experience {...props} />
      </Suspense>
    </Canvas>
  );
}
