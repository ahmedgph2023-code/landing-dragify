import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NL2_TUNING } from '../../../config/newLanding2Scene';
import { damp, sampleWorld } from '../../../lib/new-landing-2/worldMath';
import type { ProgressBus } from '../../../lib/new-landing-2/scrollEngine';

const BG_DEEP = new THREE.Color(NL2_TUNING.colors.bgDeep);
const BG_MID = new THREE.Color(NL2_TUNING.colors.bgMid);
const ELECTRIC = new THREE.Color(NL2_TUNING.colors.electric);
const VIOLET = new THREE.Color(NL2_TUNING.colors.violet);

/** Scroll-driven camera + lighting — the storytelling lens. */
export function CameraRig({
  bus,
  reducedMotion,
}: {
  bus: ProgressBus;
  reducedMotion: boolean;
}) {
  const { camera, scene } = useThree();
  const bg = useMemo(() => BG_DEEP.clone(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const key = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.PointLight>(null);

  useEffect(() => {
    scene.background = bg;
    scene.fog = new THREE.FogExp2(bg.getHex(), 0.04);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, bg]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const world = sampleWorld(bus.progress);
    const motion = reducedMotion ? 0.3 : 1;

    camera.position.x = damp(camera.position.x, world.cameraPos[0] * motion, 2.4, dt);
    camera.position.y = damp(camera.position.y, world.cameraPos[1] * motion, 2.4, dt);
    camera.position.z = damp(camera.position.z, world.cameraPos[2], 2.4, dt);

    look.set(world.cameraLook[0], world.cameraLook[1], world.cameraLook[2]);
    camera.lookAt(look);

    const persp = camera as THREE.PerspectiveCamera;
    if (persp.isPerspectiveCamera) {
      persp.fov = damp(persp.fov, world.fov, 2.4, dt);
      persp.updateProjectionMatrix();
    }

    bg.copy(BG_DEEP).lerp(BG_MID, world.bgTint);
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(bg);
      scene.fog.density = 0.045 - world.bgTint * 0.015;
    }

    const t = state.clock.elapsedTime;
    if (key.current) {
      key.current.intensity = 10 + world.particleBurst * 18 + world.hubScale * 6;
      key.current.position.set(Math.sin(t * 0.35) * 3.2, 2.4, 3.5);
    }
    if (rim.current) {
      rim.current.intensity = 6 + world.lineOpacity * 10;
      rim.current.position.set(Math.cos(t * 0.28) * -3.2, -1.4, -2.2);
    }
  });

  return (
    <>
      <ambientLight intensity={0.32} />
      <pointLight ref={key} color={ELECTRIC} distance={24} />
      <pointLight ref={rim} color={VIOLET} distance={24} />
    </>
  );
}
