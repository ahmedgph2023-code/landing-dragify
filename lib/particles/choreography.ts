/**
 * Composition + text choreography.
 * Particles alternate left / right / center opposite the copy column.
 */

import { NL3_TUNING, sampleMorphProgress, type Vec3 } from '../../config/newLanding3Scene';
import {
  NL3_SECTIONS,
  sampleSectionTextStages,
  type Nl3SectionId,
  type VisualSlot,
} from './sections/registry';
import { lerp, smoothstep } from './noise';

export const CHOREO = {
  intro: {
    duration: 4.4,
    title: [0.04, 0.38] as [number, number],
    subtitle: [0.28, 0.58] as [number, number],
    cta: [0.48, 0.86] as [number, number],
  },
  mouse: {
    /** Soft attract/repel — never shatter the silhouette */
    mainRepel: 0.045,
    mainRadius: 1.55,
    ambientParallax: 0.32,
    ambientRepel: 0.04,
    textParallax: 6,
  },
  /** Gentle scale breath during center morph */
  morphScaleBoost: 1.06,
  /** Idle yaw swing in degrees (±) — subtle, not a spin */
  yawSwingDeg: 5.5,
  yawPeriodSec: 14,
};

export function slotToOffset(slot: VisualSlot, isMobile: boolean): Vec3 {
  if (isMobile) return [...NL3_TUNING.visualOffsetMobile];
  switch (slot) {
    case 'left':
      return [-2.55, 0.05, 0.02];
    case 'center':
      return [0.2, 0.0, 0.06];
    case 'midRight':
      return [1.95, 0.02, 0.04];
    case 'right':
    default:
      return [2.45, 0.05, 0];
  }
}

/**
 * Hold beside copy → morph drifts toward center → settle on next slot.
 */
export function sampleIconOffset(progress: number, isMobile: boolean): Vec3 {
  if (isMobile) return [...NL3_TUNING.visualOffsetMobile];

  const mid: Vec3 = [0.35, 0.05, 0.1];

  const section =
    NL3_SECTIONS.find((s) => progress >= s.range[0] && progress < s.range[1]) ??
    NL3_SECTIONS[NL3_SECTIONS.length - 1];
  const [a, b] = section.range;
  const local = (progress - a) / Math.max(0.0001, b - a);
  const idx = NL3_SECTIONS.findIndex((s) => s.id === section.id);
  const next = NL3_SECTIONS[Math.min(NL3_SECTIONS.length - 1, idx + 1)];
  const fromOff: Vec3 =
    section.id === 'hero' ? [2.55, 0.12, 0.02] : slotToOffset(section.visualSlot, false);
  const toOff = slotToOffset(next.visualSlot, false);

  if (idx >= NL3_SECTIONS.length - 1 || local <= 0.8) {
    return fromOff;
  }
  if (local < 0.9) {
    const u = smoothstep(0, 1, (local - 0.8) / 0.1);
    return [
      lerp(fromOff[0], mid[0], u),
      lerp(fromOff[1], mid[1], u),
      lerp(fromOff[2], mid[2], u),
    ];
  }
  if (local < 0.94) return mid;
  const u = smoothstep(0, 1, (local - 0.94) / 0.06);
  return [lerp(mid[0], toOff[0], u), lerp(mid[1], toOff[1], u), lerp(mid[2], toOff[2], u)];
}

export function sampleIconScale(progress: number, isMobile: boolean): number {
  const base = isMobile ? NL3_TUNING.iconScaleMobile : NL3_TUNING.iconScale;
  const section =
    NL3_SECTIONS.find((s) => progress >= s.range[0] && progress < s.range[1]) ??
    NL3_SECTIONS[NL3_SECTIONS.length - 1];
  const [a, b] = section.range;
  const local = (progress - a) / Math.max(0.0001, b - a);

  if (section.id === 'hero') {
    // Robot orb (bigger) → settle into workflow graph in the right 45%
    if (local < 0.1) return base * 1.34;
    if (local < 0.2) {
      const u = smoothstep(0, 1, (local - 0.1) / 0.1);
      return base * (1.34 + (1.12 - 1.34) * u);
    }
    if (local < 0.8) return base * 1.12;
    return base * 1.05;
  }

  const sectionBoost =
    section.id === 'stats'
      ? 1.22
      : section.id === 'how'
        ? 1.18
        : section.id === 'agents'
          ? 1.1
          : section.id === 'integrations'
            ? 1.14
            : section.id === 'partners'
              ? 1.05
              : section.id === 'features'
                ? 1.16
                : section.id === 'faq'
                  ? 1.12
                  : 1;
  if (local > 0.8 && local < 0.96) {
    const peak = Math.sin(((local - 0.8) / 0.16) * Math.PI);
    return base * sectionBoost * (1 + (CHOREO.morphScaleBoost - 1) * peak);
  }
  return base * sectionBoost;
}

/**
 * Hero copy stays while the workflow builds, exits near dissolve.
 */
export function sampleHeroExit(progress: number): number {
  // Align with hero section end (0 → 0.5)
  if (progress <= 0.455) return 0;
  if (progress >= 0.485) return 1;
  return smoothstep(0, 1, (progress - 0.455) / 0.03);
}

export function sampleSectionStages(progress: number, sectionId: string) {
  return sampleSectionTextStages(progress, sectionId);
}

export function sampleSecondStages(progress: number) {
  return sampleSectionTextStages(progress, 'partners');
}

export function sampleIntroStages(intro: number) {
  const i = CHOREO.intro;
  const stage = (p: number, [x, y]: [number, number]) => {
    if (p < x) return 0;
    if (p >= y) return 1;
    return smoothstep(0, 1, (p - x) / Math.max(0.0001, y - x));
  };
  return {
    title: stage(intro, i.title),
    subtitle: stage(intro, i.subtitle),
    cta: stage(intro, i.cta),
  };
}

export function sampleMorphPhase(progress: number) {
  return sampleMorphProgress(progress);
}

export { lerp };
