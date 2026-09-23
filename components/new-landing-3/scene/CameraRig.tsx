import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NL3_TUNING, sampleMorphProgress } from '../../../config/newLanding3Scene';
import { sampleIconOffset } from '../../../lib/particles/choreography';
import { damp, lerp } from '../../../lib/particles/noise';
import type { ProgressBus } from '../../../lib/particles/types';

/**
 * Camera gently tracks the active visual slot (left / right / center).
 */
export function CameraRig({
  bus,
  reducedMotion,
  isMobile = false,
}: {
  bus: ProgressBus;
  reducedMotion: boolean;
  isMobile?: boolean;
}) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(...NL3_TUNING.camera.start.lookAt));
  const booted = useRef(false);

  useFrame((_, delta) => {
    const p = bus.progress;
    const icon = sampleIconOffset(p, isMobile);
    const morph = sampleMorphProgress(p);
    const dissolving = morph.kind === 'dissolve' || morph.kind === 'reassemble';
    const cloud = dissolving ? Math.sin(Math.PI * morph.localT) * 0.55 : 0;

    const { start, mid, end } = NL3_TUNING.camera;
    let basePos: [number, number, number];
    let baseFov: number;
    if (p < 0.5) {
      const t = p / 0.5;
      basePos = [
        lerp(start.position[0], mid.position[0], t),
        lerp(start.position[1], mid.position[1], t),
        lerp(start.position[2], mid.position[2], t),
      ];
      baseFov = lerp(start.fov, mid.fov, t);
    } else {
      const t = (p - 0.5) / 0.5;
      basePos = [
        lerp(mid.position[0], end.position[0], t),
        lerp(mid.position[1], end.position[1], t),
        lerp(mid.position[2], end.position[2], t),
      ];
      baseFov = lerp(mid.fov, end.fov, t);
    }

    // Always look toward the right-side icon (gentle)
    const lookTarget: [number, number, number] = [icon[0] * 0.42, icon[1] * 0.25, 0];
    const pos: [number, number, number] = [
      basePos[0] + icon[0] * 0.04,
      basePos[1],
      basePos[2] + cloud * 0.7,
    ];
    const fov = baseFov + cloud * 3;

    if (!booted.current) {
      booted.current = true;
      camera.position.set(...start.position);
      look.current.set(...start.lookAt);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = start.fov;
        camera.updateProjectionMatrix();
      }
      camera.lookAt(look.current);
      return;
    }

    if (reducedMotion) {
      camera.position.set(...start.position);
      look.current.set(...start.lookAt);
      if (camera instanceof THREE.PerspectiveCamera) camera.fov = start.fov;
    } else {
      camera.position.x = damp(camera.position.x, pos[0], 5, delta);
      camera.position.y = damp(camera.position.y, pos[1], 5, delta);
      camera.position.z = damp(camera.position.z, pos[2], 5, delta);
      look.current.x = damp(look.current.x, lookTarget[0], 5.5, delta);
      look.current.y = damp(look.current.y, lookTarget[1], 5.5, delta);
      look.current.z = damp(look.current.z, lookTarget[2], 5.5, delta);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = damp(camera.fov, fov, 5, delta);
        camera.updateProjectionMatrix();
      }
    }
    camera.lookAt(look.current);
  });

  return null;
}
