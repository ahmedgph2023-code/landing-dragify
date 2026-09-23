import type { MutableRefObject } from 'react';
import * as THREE from 'three';
import type { Quality } from '../../config/landingScene';
import type { ScrollState } from '../../lib/animations/scrollState';

export type SceneProps = {
  scroll: MutableRefObject<ScrollState>;
  bus: { corePos: THREE.Vector3 };
  quality: Quality;
  isMobile: boolean;
  reducedMotion?: boolean;
};
