/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: CTA (Final call to action)
 * ═══════════════════════════════════════════════════════════
 *
 * ABOUT / عن السكشن
 * -----------------
 * EN: Closing invite — start building free / talk to us.
 * AR: الدعوة النهائية — ابدأ مجاناً أو اتكلم معانا.
 *
 * CONTENT SOURCE
 * --------------
 * locales: landing.cta.*
 *
 * AI ICON GENERATION PROMPT
 * -------------------------
 * "Minimal flat white silhouette of a rocket / launch arrow bursting from
 * a circular launch pad with trailing particle streak. Transparent
 * background, no text, high contrast, centered, 512x512 SVG."
 */

import type { ParticleTarget } from '../types';
import {
  fillDisk,
  fillRing,
  fillSegment,
  normalizePts,
  resolveSectionTarget,
  type SectionConfig,
} from './sectionBase';

export const CONFIG: SectionConfig = {
  id: 'cta',
  mode: 'procedural',
  svg: '/icons/nl3/cta.svg',
  scale: 1.85,
  depth: 0.3,
  jitter: 0.016,
};

function buildProcedural(count: number): ParticleTarget {
  const pts: Array<[number, number, number]> = [];
  fillRing(pts, 0, -0.55, 0.45, 360, 10, CONFIG.depth);
  fillDisk(pts, 0, -0.55, 0, 0.16, 220, 40);
  // Rocket body
  fillSegment(pts, 0, -0.35, 0, 0, 0.55, 0, 280, 100);
  fillDisk(pts, 0, 0.7, 0, 0.14, 200, 150);
  // Fins
  fillSegment(pts, 0, -0.15, 0, -0.35, -0.45, 0, 120, 200);
  fillSegment(pts, 0, -0.15, 0, 0.35, -0.45, 0, 120, 220);
  // Trail
  for (let i = 0; i < 8; i++) {
    const y = -0.7 - i * 0.12;
    fillDisk(pts, (i % 2 === 0 ? -0.08 : 0.08) * (i * 0.15), y, 0, 0.05, 60, 300 + i);
  }
  return normalizePts(pts, count, CONFIG.scale, CONFIG.depth, CONFIG.jitter, CONFIG.id);
}

export async function buildCtaTarget(count: number): Promise<ParticleTarget> {
  return resolveSectionTarget(CONFIG, count, buildProcedural);
}

export const CTA_SECTION = CONFIG;
