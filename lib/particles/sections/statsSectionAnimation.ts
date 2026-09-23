/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: STATS — IMPACT RINGS
 * ═══════════════════════════════════════════════════════════
 * Three luminous particle rings framing neon DOM percentages.
 * Full-viewport digital terrain / starfield live in
 * EnvironmentTerrain + AmbientParticles — NEVER in this morph.
 */

import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';

export const CONFIG = {
  id: 'stats' as const,
  scale: 1.62,
  depth: 0.07,
};

export const STATS_SECTION = CONFIG;

/** Match homepage statistics.items (first three) */
export const STAT_BLOCKS = [{ value: '57%' }, { value: '68%' }, { value: '93%' }];

type Pt = [number, number, number];

function empty(count: number, id: string): ParticleTarget {
  return { positions: new Float32Array(count * 3), count, id };
}

function pack(slots: Pt[], count: number, id: string): ParticleTarget {
  const out = empty(count, id);
  const n = Math.max(1, slots.length);
  const scale = CONFIG.scale;
  for (let i = 0; i < count; i++) {
    const s = slots[Math.min(i, n - 1)];
    out.positions[i * 3] = s[0] * scale;
    out.positions[i * 3 + 1] = s[1] * scale;
    out.positions[i * 3 + 2] = s[2] * CONFIG.depth;
  }
  return out;
}

function trimTo(out: Pt[], start: number, n: number, fill: Pt) {
  while (out.length - start < n) out.push([...fill]);
  if (out.length - start > n) out.splice(start + n);
}

/**
 * Nebula ring — denser along the lower arc, thinning toward the top (ref look).
 */
function pushStatRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  const start = out.length;
  const nRim = Math.floor(n * 0.5);
  const nVol = Math.floor(n * 0.3);
  const nSpray = n - nRim - nVol;

  // Weighted rim samples (more particles in bottom hemisphere)
  for (let i = 0; i < nRim; i++) {
    let a = hash2(salt + i, 2) * Math.PI * 2;
    // Bias toward bottom: fold more samples into [π, 2π]
    if (hash2(salt + i, 3) > 0.35) {
      a = Math.PI + hash2(salt + i, 4) * Math.PI;
    }
    const band = (hash2(salt + i, 5) - 0.5) * 0.045;
    const rr = r + band;
    out.push([
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr,
      (hash2(salt + i, 6) * 2 - 1) * 0.02,
    ]);
  }

  // Soft volume inside the shell
  for (let i = 0; i < nVol; i++) {
    const a = hash2(salt + i, 10) * Math.PI * 2;
    const u = Math.pow(hash2(salt + i, 11), 0.45);
    // Prefer outer band so center stays clear for the % numeral
    const rr = r * (0.72 + u * 0.32);
    const bottomBias = Math.sin(a) < 0 ? 1.15 : 0.75;
    out.push([
      cx + Math.cos(a) * rr * bottomBias,
      cy + Math.sin(a) * rr,
      (hash2(salt + i, 12) * 2 - 1) * 0.035,
    ]);
  }

  // Outer glitter / escaping particles
  for (let i = 0; i < nSpray; i++) {
    const a = hash2(salt + i, 13) * Math.PI * 2;
    const rr = r * (1.05 + hash2(salt + i, 14) * 0.38);
    out.push([
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr,
      (hash2(salt + i, 15) * 2 - 1) * 0.055,
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

/** Soft mist near the three rings only — not a viewport floor */
function pushLocalMist(out: Pt[], n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const x = (hash2(salt + i, 30) * 2 - 1) * 1.85;
    const y = (hash2(salt + i, 31) * 2 - 1) * 0.95 + 0.05;
    out.push([x, y, (hash2(salt + i, 32) * 2 - 1) * 0.12]);
  }
}

export async function buildStatsTarget(count: number): Promise<ParticleTarget> {
  // Three rings behind the neon % row (DOM overlays center)
  const centers: Array<[number, number]> = [
    [-1.18, 0.05],
    [0.0, 0.05],
    [1.18, 0.05],
  ];
  const ringR = 0.54;

  const nMist = Math.floor(count * 0.08);
  const rest = count - nMist;
  const per = Math.floor(rest / 3);
  const leftover = rest - per * 3;

  const slots: Pt[] = [];

  {
    const start = slots.length;
    pushLocalMist(slots, nMist, 1);
    trimTo(slots, start, nMist, [0, 0.1, 0]);
  }

  centers.forEach(([cx, cy], i) => {
    const start = slots.length;
    const n = per + (i === 2 ? leftover : 0);
    pushStatRing(slots, cx, cy, ringR, n, 100 + i * 40);
    trimTo(slots, start, n, [cx, cy, 0]);
  });

  while (slots.length < count) slots.push([0, 0, 0]);
  if (slots.length > count) slots.length = count;
  return pack(slots, count, CONFIG.id);
}

export { buildStatsTarget as buildTarget };
