/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: VOICES (Testimonials / Customer stories)
 * ═══════════════════════════════════════════════════════════
 *
 * ABOUT / عن السكشن
 * -----------------
 * EN: Social proof — real teams shipping faster with Dragify.
 * AR: شهادات العملاء — فرق حقيقية بتبني أسرع مع Dragify.
 *
 * CONTENT SOURCE
 * --------------
 * locales: landing.testimonials.*
 *
 * AI ICON GENERATION PROMPT
 * -------------------------
 * "Minimal flat white silhouette of overlapping speech bubbles / quote marks
 * with three small avatar dots underneath. Transparent background, no text,
 * high contrast, centered, 512x512 SVG for particle sampling."
 */

import type { ParticleTarget } from '../types';
import {
  fillDisk,
  fillRing,
  normalizePts,
  resolveSectionTarget,
  type SectionConfig,
} from './sectionBase';

export const CONFIG: SectionConfig = {
  id: 'voices',
  mode: 'procedural',
  svg: '/icons/nl3/voices.svg',
  scale: 1.85,
  depth: 0.28,
  jitter: 0.016,
};

function buildProcedural(count: number): ParticleTarget {
  const pts: Array<[number, number, number]> = [];
  fillRing(pts, -0.25, 0.15, 0.55, 420, 10, CONFIG.depth);
  fillRing(pts, 0.35, -0.1, 0.42, 320, 50, CONFIG.depth);
  fillDisk(pts, -0.25, 0.15, 0, 0.18, 220, 100);
  fillDisk(pts, 0.35, -0.1, 0, 0.14, 180, 140);
  // Quote marks as twin arcs
  fillDisk(pts, -0.45, 0.35, 0, 0.07, 90, 200);
  fillDisk(pts, -0.28, 0.35, 0, 0.07, 90, 220);
  const avatars = [
    [-0.4, -0.75],
    [0, -0.8],
    [0.4, -0.75],
  ];
  avatars.forEach(([x, y], i) => fillDisk(pts, x, y, 0, 0.09, 110, 300 + i * 20));
  return normalizePts(pts, count, CONFIG.scale, CONFIG.depth, CONFIG.jitter, CONFIG.id);
}

export async function buildVoicesTarget(count: number): Promise<ParticleTarget> {
  return resolveSectionTarget(CONFIG, count, buildProcedural);
}

export const VOICES_SECTION = CONFIG;
