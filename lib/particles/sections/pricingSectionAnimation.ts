/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: PRICING
 * ═══════════════════════════════════════════════════════════
 *
 * ABOUT / عن السكشن
 * -----------------
 * EN: Plans — Starter / Growth / Professional for smarter automation.
 * AR: خطط الأسعار — Starter / Growth / Professional.
 *
 * CONTENT SOURCE
 * --------------
 * locales: landing.pricing.*
 *
 * AI ICON GENERATION PROMPT
 * -------------------------
 * "Minimal flat white silhouette of three vertical pricing columns / bars
 * with the middle bar tallest (most popular), small crown spark on top of
 * center. Transparent background, no text, high contrast, 512x512 SVG."
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
  id: 'pricing',
  mode: 'procedural',
  svg: '/icons/nl3/pricing.svg',
  scale: 2.4,
  depth: 0.28,
  jitter: 0.015,
};

function buildProcedural(count: number): ParticleTarget {
  const pts: Array<[number, number, number]> = [];
  const bars = [
    { x: -0.7, h: 0.7 },
    { x: 0, h: 1.05 },
    { x: 0.7, h: 0.85 },
  ];
  bars.forEach((b, i) => {
    fillSegment(pts, b.x, -0.7, 0, b.x, -0.7 + b.h, 0, 220, 10 + i * 40);
    fillRing(pts, b.x, -0.7 + b.h * 0.5, 0.18, 160, 50 + i * 40, CONFIG.depth);
    fillDisk(pts, b.x, -0.7 + b.h, 0, 0.1, 120, 100 + i * 40);
  });
  fillDisk(pts, 0, 0.55, 0, 0.08, 100, 300);
  return normalizePts(pts, count, CONFIG.scale, CONFIG.depth, CONFIG.jitter, CONFIG.id);
}

export async function buildPricingTarget(count: number): Promise<ParticleTarget> {
  return resolveSectionTarget(CONFIG, count, buildProcedural);
}

export const PRICING_SECTION = CONFIG;
