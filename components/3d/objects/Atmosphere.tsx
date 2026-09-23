import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENE_TUNING } from '../../../config/landingScene';
import { damp, eased, sampleStage } from '../../../lib/animations/math';
import type { SceneProps } from '../types';

const BG_DARK = new THREE.Color(SCENE_TUNING.colors.bgDark);
const BG_CLEAR = new THREE.Color(SCENE_TUNING.colors.bgClear);
const COLOR_ELECTRIC = new THREE.Color(SCENE_TUNING.colors.electric);
const COLOR_MAGENTA = new THREE.Color(SCENE_TUNING.colors.magenta);

/** Camera + lighting + fog — the storytelling lens. */
export function Atmosphere({ scroll, isMobile, reducedMotion }: SceneProps) {
  const { camera, scene } = useThree();
  const keyLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const bgColor = useMemo(() => BG_DARK.clone(), []);

  useEffect(() => {
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(bgColor.getHex(), 0.045);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, bgColor]);

  useFrame((state, delta) => {
    if (!SCENE_TUNING.enableSceneAnimation) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = scroll.current.progress;
    const stage = sampleStage(p);
    const camAmp = reducedMotion ? 0.25 : 1;

    const targetZ =
      SCENE_TUNING.camera.baseZ -
      eased(p, 0.08, 0.22) * 0.35 * camAmp +
      stage.orchestration * 2.0 * camAmp +
      stage.impact * 1.2 * camAmp -
      stage.finale * 2.0 * camAmp;
    const targetY =
      Math.sin(t * 0.12) * 0.14 * camAmp + stage.rise * 0.45;
    const targetX =
      Math.sin(t * 0.09) * 0.18 * camAmp -
      stage.side * (isMobile ? 0 : 0.55) * camAmp;

    camera.position.z = damp(camera.position.z, targetZ, 2.2, dt);
    camera.position.y = damp(camera.position.y, targetY, 2.2, dt);
    camera.position.x = damp(camera.position.x, targetX, 2.2, dt);
    camera.lookAt(stage.side * (isMobile ? 0 : 0.6), stage.rise * 0.35, 0);

    const clarity = stage.impact * (1 - stage.finale * 0.45) + stage.finale * 0.2;
    bgColor.copy(BG_DARK).lerp(BG_CLEAR, clarity);
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(bgColor);
      scene.fog.density = 0.05 - clarity * 0.02;
    }

    if (keyLight.current) {
      keyLight.current.intensity = 12 + stage.orchestration * 16 + stage.finale * 26;
      keyLight.current.position.set(Math.sin(t * 0.4) * 3, 2.2, 3.4);
    }
    if (rimLight.current) {
      rimLight.current.intensity = 8 + stage.impact * 14 + stage.finale * 8;
      rimLight.current.position.set(Math.cos(t * 0.3) * -3.5, -1.6, -2.4);
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={keyLight} color={COLOR_ELECTRIC} distance={22} />
      <pointLight ref={rimLight} color={COLOR_MAGENTA} distance={22} />
    </>
  );
}
