/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: SECURITY (Enterprise ready)
 * ═══════════════════════════════════════════════════════════
 *
 * ABOUT / عن السكشن
 * -----------------
 * EN: Enterprise trust — RBAC, encryption, audit logs, on-prem option.
 * AR: ثقة المؤسسات — صلاحيات، تشفير، سجلات تدقيق، استضافة ذاتية.
 *
 * CONTENT SOURCE
 * --------------
 * locales: landing.security.*
 *
 * AI ICON GENERATION PROMPT
 * -------------------------
 * "Minimal flat white silhouette of a protective shield with a lock keyhole
 * in the center and a thin outer guard ring. Transparent background, no
 * text, high contrast, centered, 512x512 SVG for particles."
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
  id: 'security',
  mode: 'procedural',
  svg: '/icons/nl3/security.svg',
  scale: 2.4,
  depth: 0.28,
  jitter: 0.014,
};

function buildProcedural(count: number): ParticleTarget {
  const pts: Array<[number, number, number]> = [];
  // Shield outline (polygon)
  const shield = [
    [0, 1.05],
    [0.75, 0.7],
    [0.7, -0.15],
    [0, -1.0],
    [-0.7, -0.15],
    [-0.75, 0.7],
  ];
  for (let i = 0; i < shield.length; i++) {
    const a = shield[i];
    const b = shield[(i + 1) % shield.length];
    fillSegment(pts, a[0], a[1], 0, b[0], b[1], 0, 160, 10 + i * 20);
  }
  fillRing(pts, 0, 0.05, 0.22, 260, 200, CONFIG.depth);
  fillDisk(pts, 0, -0.02, 0, 0.08, 180, 250);
  fillSegment(pts, 0, -0.08, 0, 0, -0.32, 0, 80, 300);
  return normalizePts(pts, count, CONFIG.scale, CONFIG.depth, CONFIG.jitter, CONFIG.id);
}

export async function buildSecurityTarget(count: number): Promise<ParticleTarget> {
  return resolveSectionTarget(CONFIG, count, buildProcedural);
}

export const SECURITY_SECTION = CONFIG;
