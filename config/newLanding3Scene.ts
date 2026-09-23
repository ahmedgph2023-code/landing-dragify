/**
 * New-Landing-3 — scroll-driven particle morph of classic home `/`.
 * Sections + copy + images match pages/index.tsx.
 * Per-section shapes: lib/particles/sections/*SectionAnimation.ts
 */

import {
  NL3_SECTIONS,
  buildMorphWindowsFromSections,
  type Nl3SectionId,
} from '../lib/particles/sections/registry';

export type Vec3 = [number, number, number];

/** Named morph targets (one Buffer of N particles interpolates between these). */
export type ParticleStateId =
  | Nl3SectionId
  | 'heroNode'
  | 'heroChain'
  | 'heroFlow'
  | 'dissolve'
  | 'transition';

export type IconTargetConfig = {
  kind: 'core' | 'svg' | 'network';
  src: string;
  scale: number;
  depth: number;
  jitter: number;
  nodeCount?: number;
  particlesPerNode?: number;
  particlesPerEdge?: number;
};

/** @deprecated — shapes live in sections/* */
export const PARTICLE_TARGETS: {
  hero: IconTargetConfig;
  shift: IconTargetConfig;
} = {
  hero: {
    kind: 'core',
    src: '/icons/nl3/hero-core.svg',
    scale: 2.45,
    depth: 0.32,
    jitter: 0.018,
  },
  shift: {
    kind: 'network',
    src: '/icons/nl3/network.svg',
    scale: 2.5,
    depth: 0.32,
    jitter: 0.014,
    nodeCount: 7,
    particlesPerNode: 0.28,
    particlesPerEdge: 0.72,
  },
};

/** Morph windows derived from NL3_SECTIONS — hold / dissolve / reassemble */
export const MORPH_WINDOWS: Array<{
  from: ParticleStateId;
  to: ParticleStateId;
  range: [number, number];
  kind?: 'hold' | 'dissolve' | 'reassemble';
}> = buildMorphWindowsFromSections();

export { NL3_SECTIONS };

/** @deprecated Prefer sectionTextOpacity from registry */
export const TEXT_WINDOWS = {
  hero: { visible: [0.0, 0.12] as [number, number], peak: [0.0, 0.06] as [number, number] },
  second: { visible: [0.17, 0.3] as [number, number], peak: [0.2, 0.26] as [number, number] },
};

export const NL3_TUNING = {
  /**
   * Longer scroll = professional morph pacing (not rushed).
   */
  scrollVh: 3000,
  scrub: 3.6,
  scrubReduced: true as boolean | number,
  lenisEnabled: true,
  lenisDuration: 2.05,

  particleCount: {
    desktop: 16000,
    tablet: 8500,
    mobile: 4500,
  },
  ambientCount: {
    desktop: 17000,
    tablet: 9000,
    mobile: 4200,
  },

  particleSize: 3.55,
  ambientSize: 2.55,
  particleOpacity: 0.92,

  /** Softer dissolve — magical, not explosive shatter */
  dispersion: 0.72,
  chaosStrength: 0.28,
  depthScale: 1.05,

  idle: {
    amplitude: 0.012,
    speed: 0.22,
    /** Unused for continuous spin — yaw is a gentle ±swing in MainParticles */
    rotationSpeed: 0,
  },

  camera: {
    start: { position: [-0.25, 0.12, 7.5] as Vec3, lookAt: [1.85, -0.22, 0] as Vec3, fov: 38 },
    mid: { position: [-0.15, 0.08, 7.6] as Vec3, lookAt: [1.15, -0.1, 0] as Vec3, fov: 39 },
    end: { position: [-0.3, 0.08, 7.4] as Vec3, lookAt: [2.0, -0.15, 0] as Vec3, fov: 38 },
  },

  visualOffset: [2.45, 0.05, 0] as Vec3,
  visualOffsetMobile: [0.0, 0.85, 0] as Vec3,
  /** Sit firmly in the non-text half */
  iconScale: 0.7,
  iconScaleMobile: 0.52,

  /** Virtual Verse–style palette (Dragify content, VV look) */
  colors: {
    core: '#f5fffc',
    glow: '#2be9d1',
    glowBright: '#38f5dd',
    accent: '#2be9d1',
    warm: '#caa25a',
    ambient: '#1a6b5c',
    ambientDim: '#0a2a24',
    bgDeep: '#050708',
    bgPure: '#04070a',
    vignette: '#0a1a1a',
  },

  bloom: {
    desktop: { enabled: true, intensity: 0.95, luminanceThreshold: 0.42, luminanceSmoothing: 0.25 },
    tablet: { enabled: true, intensity: 0.65, luminanceThreshold: 0.5, luminanceSmoothing: 0.3 },
    mobile: { enabled: false, intensity: 0.28, luminanceThreshold: 0.8, luminanceSmoothing: 0.45 },
  },

  dpr: {
    desktop: [1, 1.75] as [number, number],
    tablet: [1, 1.4] as [number, number],
    mobile: [1, 1.15] as [number, number],
  },

  mobileMax: 820,
  tabletMax: 1100,
  debugShortcut: 'd',
};

/**
 * Resolve which morph segment is active and local t ∈ [0,1] inside it.
 */
export function sampleMorphProgress(progress: number): {
  from: ParticleStateId;
  to: ParticleStateId;
  localT: number;
  label: string;
  kind: 'hold' | 'dissolve' | 'reassemble';
} {
  const p = Math.min(1, Math.max(0, progress));
  for (const w of MORPH_WINDOWS) {
    const [a, b] = w.range;
    if (p <= b || w === MORPH_WINDOWS[MORPH_WINDOWS.length - 1]) {
      const localT = b === a ? 1 : Math.min(1, Math.max(0, (p - a) / (b - a)));
      const kind = w.kind ?? (w.from === w.to ? 'hold' : w.to === 'dissolve' ? 'dissolve' : 'reassemble');
      const label =
        localT < 0.05 ? w.from : localT > 0.95 ? w.to : `${w.from}→${w.to}`;
      return { from: w.from, to: w.to, localT, label, kind };
    }
  }
  const last = MORPH_WINDOWS[MORPH_WINDOWS.length - 1];
  return {
    from: last.from,
    to: last.to,
    localT: 1,
    label: last.to,
    kind: last.kind ?? 'hold',
  };
}

/** Smoothstep edge fade for text layers. */
export function textOpacity(progress: number, key: keyof typeof TEXT_WINDOWS): number {
  const win = TEXT_WINDOWS[key];
  const [a, b] = win.visible;
  const [pa, pb] = win.peak;
  if (progress < a || progress > b) return 0;

  if (progress >= pa && progress <= pb) return 1;

  if (progress < pa) {
    const span = Math.max(0.001, pa - a);
    return Math.min(1, Math.max(0, (progress - a) / span));
  }

  const span = Math.max(0.001, b - pb);
  return Math.min(1, Math.max(0, (b - progress) / span));
}
