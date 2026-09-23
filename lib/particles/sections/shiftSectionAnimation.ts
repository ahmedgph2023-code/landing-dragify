/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: SHIFT (Problem / The Shift)
 * ═══════════════════════════════════════════════════════════
 *
 * ABOUT / عن السكشن
 * -----------------
 * EN: The fragmentation problem — stop gluing tools, start shipping outcomes.
 * AR: مشكلة التجزئة — وقف لصق الأدوات، ابدأ تشحن نتائج.
 *
 * CONTENT SOURCE
 * --------------
 * locales: landing.problem.*
 *
 * AI ICON GENERATION PROMPT
 * -------------------------
 * "Minimal flat white silhouette of a connected network graph: one bright
 * central node with six radiating branches and tip nodes. Transparent
 * background, no text, high contrast, centered, 512x512 SVG."
 *
 * HOW TO EDIT
 * -----------
 * Procedural network below, or set CONFIG.mode = 'svg'.
 */

import { hash2, hash3 } from '../noise';
import { createFromSVG } from '../loadSvgTarget';
import type { ParticleTarget } from '../types';

export const CONFIG = {
  id: 'shift' as const,
  mode: 'procedural' as 'procedural' | 'svg',
  svg: '/icons/nl3/network.svg',
  scale: 2.5,
  depth: 0.32,
  jitter: 0.014,
  nodeCount: 7,
  particlesPerNode: 0.28,
};

/** @deprecated alias */
export const SHIFT_SECTION = CONFIG;

function createEmpty(count: number, id: string): ParticleTarget {
  return { positions: new Float32Array(count * 3), count, id };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type NetworkNode = { x: number; y: number; z: number; r: number };

function buildProcedural(count: number): ParticleTarget {
  const { scale, depth, jitter, nodeCount, particlesPerNode } = CONFIG;
  const nodes: NetworkNode[] = [];

  nodes.push({ x: 0, y: 0, z: 0, r: 0.28 });
  const tips = Math.max(3, nodeCount - 1);
  for (let i = 0; i < tips; i++) {
    const ang = (i / tips) * Math.PI * 2 - Math.PI / 2;
    const rad = 0.95 + (i % 2) * 0.18;
    const z = (hash2(i, 60) * 2 - 1) * depth * 0.6;
    nodes.push({
      x: Math.cos(ang) * rad,
      y: Math.sin(ang) * rad * 0.92,
      z,
      r: 0.14 + (i === 0 ? 0.04 : 0),
    });
  }

  const edges: Array<[number, number]> = [];
  for (let i = 1; i < nodes.length; i++) edges.push([0, i]);
  if (nodes.length > 4) {
    edges.push([1, 2]);
    edges.push([3, 4]);
  }

  const out = createEmpty(count, CONFIG.id);
  const nodeBudget = Math.floor(count * particlesPerNode);
  const edgeBudget = count - nodeBudget;

  const weights = nodes.map((n) => n.r * n.r);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  let filled = 0;
  for (let n = 0; n < nodes.length; n++) {
    const share =
      n === nodes.length - 1
        ? nodeBudget - filled
        : Math.max(1, Math.floor((weights[n] / weightSum) * nodeBudget));
    for (let k = 0; k < share && filled < nodeBudget; k++, filled++) {
      const i = filled;
      const u = hash2(i, 70);
      const v = hash2(i, 71);
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const rr = nodes[n].r * Math.pow(hash2(i, 72), 0.45);
      out.positions[i * 3] = (nodes[n].x + Math.sin(phi) * Math.cos(theta) * rr) * scale;
      out.positions[i * 3 + 1] = (nodes[n].y + Math.sin(phi) * Math.sin(theta) * rr) * scale;
      out.positions[i * 3 + 2] = (nodes[n].z + Math.cos(phi) * rr) * scale;
    }
  }

  for (let e = 0; e < edgeBudget; e++) {
    const i = nodeBudget + e;
    const edge = edges[Math.floor(hash2(i, 80) * edges.length) % edges.length];
    const a = nodes[edge[0]];
    const b = nodes[edge[1]];
    const t = hash2(i, 81);
    const midZ =
      ((a.z + b.z) * 0.5 + (hash2(i, 82) * 2 - 1) * 0.08) * (1 - Math.abs(t - 0.5) * 0.3);
    const x = lerp(a.x, b.x, t);
    const y = lerp(a.y, b.y, t);
    const jx = (hash2(i, 83) * 2 - 1) * jitter;
    const jy = (hash2(i, 84) * 2 - 1) * jitter;
    const jz = (hash2(i, 85) * 2 - 1) * jitter * 1.5;
    const thicken = Math.pow(Math.abs(t - 0.5) * 2, 2) * 0.04;
    const ox = (hash3(i, 1) * 2 - 1) * thicken;
    const oy = (hash3(i, 2) * 2 - 1) * thicken;
    out.positions[i * 3] = (x + jx + ox) * scale;
    out.positions[i * 3 + 1] = (y + jy + oy) * scale;
    out.positions[i * 3 + 2] = (lerp(a.z, b.z, t) + midZ * 0.15 + jz) * scale;
  }

  return out;
}

export async function buildShiftTarget(count: number): Promise<ParticleTarget> {
  if (CONFIG.mode === 'svg') {
    return createFromSVG(CONFIG.svg, count, {
      scale: CONFIG.scale,
      depth: CONFIG.depth,
      jitter: CONFIG.jitter,
      id: CONFIG.id,
    });
  }
  return buildProcedural(count);
}
