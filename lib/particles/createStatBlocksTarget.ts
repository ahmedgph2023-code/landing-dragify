/**
 * Stats particle target — thick procedural 7-segment digits.
 * Canvas fonts + erosion produced mushy “humps”; geometry stays readable.
 */

import { hash2 } from './noise';
import { buildDissolveTarget } from './sections/morphBridgeAnimation';
import type { ParticleTarget } from './types';

function createEmpty(count: number, id: string): ParticleTarget {
  return { positions: new Float32Array(count * 3), count, id };
}

type Seg = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

const DIGIT_SEGS: Record<string, Seg[]> = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '4': ['f', 'g', 'b', 'c'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'g', 'e', 'c', 'd'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
};

/** Filled axis-aligned bar in local glyph space */
function fillBar(
  out: Array<[number, number]>,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  n: number,
  seed: number,
) {
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);
  for (let i = 0; i < n; i++) {
    const u = hash2(seed + i, 1);
    const v = hash2(seed + i, 2);
    out.push([minX + (maxX - minX) * u, minY + (maxY - minY) * v]);
  }
}

function fillDiskLocal(
  out: Array<[number, number]>,
  cx: number,
  cy: number,
  r: number,
  n: number,
  seed: number,
) {
  for (let i = 0; i < n; i++) {
    const a = hash2(seed + i, 3) * Math.PI * 2;
    const rr = Math.sqrt(hash2(seed + i, 4)) * r;
    out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
}

/**
 * One digit in local box roughly [-0.38..0.38] x [-0.55..0.55]
 */
function sampleDigit(ch: string, seed: number): Array<[number, number]> {
  const segs = DIGIT_SEGS[ch];
  if (!segs) return [];
  const pts: Array<[number, number]> = [];
  const t = 0.14; // bar thickness — chunky so particles read as strokes
  const L = -0.32;
  const R = 0.32;
  const T = 0.5;
  const M = 0;
  const B = -0.5;

  const add = (seg: Seg, n: number, s: number) => {
    switch (seg) {
      case 'a':
        fillBar(pts, L, T - t, R, T, n, s);
        break;
      case 'g':
        fillBar(pts, L, M - t * 0.5, R, M + t * 0.5, n, s);
        break;
      case 'd':
        fillBar(pts, L, B, R, B + t, n, s);
        break;
      case 'f':
        fillBar(pts, L, M, L + t, T, n, s);
        break;
      case 'b':
        fillBar(pts, R - t, M, R, T, n, s);
        break;
      case 'e':
        fillBar(pts, L, B, L + t, M, n, s);
        break;
      case 'c':
        fillBar(pts, R - t, B, R, M, n, s);
        break;
    }
  };

  segs.forEach((seg, i) => add(seg, 90, seed + i * 97));
  return pts;
}

/** % as two disks + thick diagonal */
function samplePercent(seed: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  fillDiskLocal(pts, -0.22, 0.28, 0.16, 70, seed);
  fillDiskLocal(pts, 0.22, -0.28, 0.16, 70, seed + 50);
  // diagonal stroke
  for (let i = 0; i < 90; i++) {
    const u = i / 89;
    const x = 0.28 - u * 0.56;
    const y = -0.42 + u * 0.84;
    const jx = (hash2(seed + i, 5) * 2 - 1) * 0.05;
    const jy = (hash2(seed + i, 6) * 2 - 1) * 0.05;
    pts.push([x + jx, y + jy]);
  }
  return pts;
}

/** Build one "57%" block centered at origin */
function sampleStatValue(value: string, seed: number): Array<[number, number]> {
  const chars = value.split('');
  const pts: Array<[number, number]> = [];
  // Digit pitch + % after last digit
  const pitch = 0.78;
  const digitChars = chars.filter((c) => c !== '%');
  const hasPct = chars.includes('%');
  const units = digitChars.length + (hasPct ? 0.85 : 0);
  const startX = -((units - 1) * pitch) / 2;

  digitChars.forEach((ch, i) => {
    const local = sampleDigit(ch, seed + i * 200);
    const ox = startX + i * pitch;
    local.forEach(([x, y]) => pts.push([x + ox, y]));
  });

  if (hasPct) {
    const ox = startX + digitChars.length * pitch;
    samplePercent(seed + 900).forEach(([x, y]) => pts.push([x * 0.85 + ox, y * 0.85]));
  }

  return pts;
}

/**
 * Vertical stack of large clear percentages:
 *   57%
 *   68%
 *   93%
 */
export async function createFromStatBlocks(
  blocks: Array<{ value: string; label?: string }>,
  count: number,
  opts: { scale?: number; depth?: number; jitter?: number; id?: string } = {},
): Promise<ParticleTarget> {
  const n = Math.max(1, Math.min(3, blocks.length));
  const scale = opts.scale ?? 1.25;
  const depth = opts.depth ?? 0.03;
  const jitter = opts.jitter ?? 0.003;
  const out = createEmpty(count, opts.id ?? 'stats');

  // Tall spacing so rows never collide
  const gapY = 1.2;
  const startY = ((n - 1) * gapY) / 2;
  const rows: Array<Array<[number, number]>> = [];

  for (let i = 0; i < n; i++) {
    rows.push(sampleStatValue(blocks[i].value, 1000 + i * 333));
  }

  const totalPts = rows.reduce((s, c) => s + c.length, 0);
  if (totalPts < 100) return buildDissolveTarget(count);

  const perRow = Math.floor(count / n);
  let filled = 0;
  for (let r = 0; r < n; r++) {
    const src = rows[r];
    const share = r === n - 1 ? count - filled : perRow;
    const cy = startY - r * gapY;
    for (let k = 0; k < share; k++, filled++) {
      const i = filled;
      const p = src[k % src.length];
      out.positions[i * 3] = (p[0] + (hash2(i, 22) * 2 - 1) * jitter) * scale;
      out.positions[i * 3 + 1] = (p[1] + cy + (hash2(i, 23) * 2 - 1) * jitter) * scale;
      out.positions[i * 3 + 2] = (hash2(i, 21) * 2 - 1) * depth;
    }
  }

  return out;
}
