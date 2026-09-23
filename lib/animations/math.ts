import { CHAPTERS, SCENE_TUNING, type Formation, type Morph } from '../../config/landingScene';

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Normalised 0..1 progress of a sub-range of the global scroll. */
export const range = (p: number, start: number, end: number) =>
  clamp01((p - start) / (end - start));

/** Smoothstep-eased sub-range. */
export const eased = (p: number, start: number, end: number) => {
  const t = range(p, start, end);
  return t * t * (3 - 2 * t);
};

/** Frame-rate independent lerp. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

/** Deterministic PRNG so layout is identical every load. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type StageSample = {
  side: number;
  rise: number;
  formationA: Formation;
  formationB: Formation;
  blend: number;
  morph: Morph;
  focus: Set<string>;
  /** Soft peaks used by particles / waves / camera. */
  orchestration: number;
  impact: number;
  finale: number;
  chapterIndex: number;
  localProgress: number;
};

/**
 * Sample the master visual timeline from global scroll progress 0..1.
 * Interpolates between neighbouring CHAPTERS for continuous bridges.
 */
export function sampleStage(p: number): StageSample {
  const n = CHAPTERS.length;
  const x = clamp01(p) * (n - 0.0001);
  const i = Math.floor(x);
  const local = x - i;
  const a = CHAPTERS[i];
  const b = CHAPTERS[Math.min(i + 1, n - 1)];
  const blendStart = SCENE_TUNING.chapterBlendStart;
  const blend = local < blendStart ? 0 : eased(local, blendStart, 1);

  const morphWeight: Record<Morph, number> = {
    chaos: 0,
    structure: 0,
    flow: 0,
    resolve: 0,
  };
  morphWeight[a.morph] += 1 - blend;
  morphWeight[b.morph] += blend;
  let morph: Morph = 'chaos';
  let best = -1;
  (Object.keys(morphWeight) as Morph[]).forEach((k) => {
    if (morphWeight[k] > best) {
      best = morphWeight[k];
      morph = k;
    }
  });

  const focusIds = (blend < 0.5 ? a.focus : b.focus) || [];

  // Map chapter indices → soft peaks (tuned for 9 home sections).
  // statistics ≈ index 5, how ≈ 6, cta ≈ 8
  return {
    side: a.side * (1 - blend) + b.side * blend,
    rise: (a.rise || 0) * (1 - blend) + (b.rise || 0) * blend,
    formationA: a.formation,
    formationB: b.formation,
    blend,
    morph,
    focus: new Set(focusIds),
    orchestration: eased(p, 0.42, 0.58),
    impact: eased(p, 0.52, 0.68),
    finale: eased(p, 0.86, 1),
    chapterIndex: i,
    localProgress: local,
  };
}
