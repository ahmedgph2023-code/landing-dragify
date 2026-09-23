/** Tiny shared helpers for section particle shapes (optional import). */
import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';

export function emptyTarget(count: number, id: string): ParticleTarget {
  return { positions: new Float32Array(count * 3), count, id };
}

export function fillDisk(
  pts: Array<[number, number, number]>,
  x: number,
  y: number,
  z: number,
  r: number,
  n: number,
  salt: number,
) {
  for (let i = 0; i < n; i++) {
    const u = hash2(i + salt, 1);
    const v = hash2(i + salt, 2);
    const theta = u * Math.PI * 2;
    const rr = r * Math.sqrt(v);
    pts.push([x + Math.cos(theta) * rr, y + Math.sin(theta) * rr, z + (hash2(i + salt, 3) * 2 - 1) * 0.08]);
  }
}

export function fillRing(
  pts: Array<[number, number, number]>,
  cx: number,
  cy: number,
  r: number,
  n: number,
  salt: number,
  depth = 0.2,
) {
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const j = (hash2(i + salt, 4) * 2 - 1) * 0.02;
    pts.push([
      cx + Math.cos(ang) * r + j,
      cy + Math.sin(ang) * r + j,
      (hash2(i + salt, 5) * 2 - 1) * depth,
    ]);
  }
}

export function fillSegment(
  pts: Array<[number, number, number]>,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  n: number,
  salt: number,
) {
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    pts.push([
      ax + (bx - ax) * t + (hash2(i + salt, 6) * 2 - 1) * 0.015,
      ay + (by - ay) * t + (hash2(i + salt, 7) * 2 - 1) * 0.015,
      az + (bz - az) * t + (hash2(i + salt, 8) * 2 - 1) * 0.015,
    ]);
  }
}

export function normalizePts(
  pts: Array<[number, number, number]>,
  count: number,
  scale: number,
  depth: number,
  jitter: number,
  id: string,
): ParticleTarget {
  const out = emptyTarget(count, id);
  if (!pts.length) return out;
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const [x, y] of pts) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  for (let i = 0; i < count; i++) {
    const src = pts[Math.floor(hash2(i, 20) * pts.length) % pts.length];
    const nx = ((src[0] - cx) / span) * 2;
    const ny = -((src[1] - cy) / span) * 2;
    out.positions[i * 3] = (nx + (hash2(i, 22) * 2 - 1) * jitter) * scale;
    out.positions[i * 3 + 1] = (ny + (hash2(i, 23) * 2 - 1) * jitter) * scale;
    out.positions[i * 3 + 2] = (src[2] ?? 0) * depth + (hash2(i, 21) * 2 - 1) * depth * 0.5;
  }
  return out;
}
