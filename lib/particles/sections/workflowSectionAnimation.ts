/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: WORKFLOW (See it run)
 * ═══════════════════════════════════════════════════════════
 *
 * ABOUT / عن السكشن
 * -----------------
 * EN: Live pipeline — one WhatsApp trigger → AI agent → multi-channel actions.
 * AR: البايبلاين الحي — رسالة واتساب واحدة وكيل ذكي → أكشنز على الستاك كله.
 *
 * CONTENT SOURCE
 * --------------
 * locales: landing.workflow.*
 *
 * AI ICON GENERATION PROMPT
 * -------------------------
 * "Minimal flat white silhouette of a workflow pipeline: left trigger node,
 * center AI diamond, four output nodes on the right connected by flowing
 * bezier lines. Transparent bg, no text, high contrast, 512x512 SVG."
 */

import type { ParticleTarget } from '../types';
import {
  fillDisk,
  fillSegment,
  normalizePts,
  resolveSectionTarget,
  type SectionConfig,
} from './sectionBase';

export const CONFIG: SectionConfig = {
  id: 'workflow',
  mode: 'procedural',
  svg: '/icons/nl3/workflow.svg',
  scale: 2.4,
  depth: 0.3,
  jitter: 0.015,
};

function buildProcedural(count: number): ParticleTarget {
  const pts: Array<[number, number, number]> = [];
  // Trigger → Agent → Outputs
  fillDisk(pts, -0.9, 0, 0, 0.16, 320, 10);
  fillDisk(pts, 0, 0, 0, 0.22, 480, 50);
  const outs = [
    [0.85, 0.55],
    [0.95, 0.18],
    [0.95, -0.18],
    [0.85, -0.55],
  ];
  outs.forEach(([x, y], i) => {
    fillDisk(pts, x, y, 0, 0.1, 160, 100 + i * 20);
    fillSegment(pts, 0.15, 0, 0, x * 0.85, y * 0.9, 0, 140, 200 + i);
  });
  fillSegment(pts, -0.72, 0, 0, -0.22, 0, 0, 180, 300);
  return normalizePts(pts, count, CONFIG.scale, CONFIG.depth, CONFIG.jitter, CONFIG.id);
}

export async function buildWorkflowTarget(count: number): Promise<ParticleTarget> {
  return resolveSectionTarget(CONFIG, count, buildProcedural);
}

export const WORKFLOW_SECTION = CONFIG;
