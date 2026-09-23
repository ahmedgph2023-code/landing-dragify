/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: FAQ — QUESTION MARK ORB
 * ═══════════════════════════════════════════════════════════
 * Luminous particle "?" · multi-orbit rings · local portal base.
 * Full-viewport digital terrain / starfield live in
 * EnvironmentTerrain + AmbientParticles — NEVER a clipped floor here.
 */

import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';

export const CONFIG = {
  id: 'faq' as const,
  scale: 1.92,
  depth: 0.13,
};

export const FAQ_SECTION = CONFIG;

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

function pushDisk(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = hash2(salt + i, 2) * Math.PI * 2;
    const rr = r * Math.sqrt(hash2(salt + i, 3));
    out.push([
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr,
      (hash2(salt + i, 4) * 2 - 1) * 0.025,
    ]);
  }
}

function pushRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r,
      (hash2(salt + i, 5) * 2 - 1) * 0.015,
    ]);
  }
}

function pushFatRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number, fat = 0.02) {
  const bands = 4;
  const per = Math.max(8, Math.floor(n / bands));
  for (let b = 0; b < bands; b++) {
    const t = (b / (bands - 1) - 0.5) * 2;
    const count = b === bands - 1 ? n - per * (bands - 1) : per;
    pushRing(out, cx, cy, r + t * fat, count, salt + b);
  }
}

function pushSeg(out: Pt[], ax: number, ay: number, bx: number, by: number, n: number, salt: number, w = 0.03) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * w;
  const py = (dx / len) * w;
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    const j = hash2(salt + i, 6) * 2 - 1;
    out.push([
      ax + dx * t + px * j,
      ay + dy * t + py * j,
      (hash2(salt + i, 7) * 2 - 1) * 0.02,
    ]);
  }
}

function pushArc(
  out: Pt[],
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
  n: number,
  salt: number,
  thick = 0.045,
) {
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    const a = a0 + (a1 - a0) * t;
    const j = (hash2(salt + i, 8) * 2 - 1) * thick;
    out.push([
      cx + Math.cos(a) * (r + j),
      cy + Math.sin(a) * (r + j),
      (hash2(salt + i, 9) * 2 - 1) * 0.025,
    ]);
  }
}

function pushOrbit(
  out: Pt[],
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  n: number,
  salt: number,
  tilt = 0.4,
  yaw = 0,
) {
  const cyaw = Math.cos(yaw);
  const syaw = Math.sin(yaw);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x0 = Math.cos(a) * rx;
    const y0 = Math.sin(a) * ry;
    const y = y0 * Math.cos(tilt);
    const z = y0 * Math.sin(tilt);
    const xr = x0 * cyaw - z * syaw;
    const zr = x0 * syaw + z * cyaw;
    out.push([
      cx + xr,
      cy + y,
      zr * 0.55 + (hash2(salt + i, 10) * 2 - 1) * 0.018,
    ]);
  }
}

/** Local portal under the ? tip — illustration only */
function pushPortalFloor(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  const nCore = Math.floor(n * 0.28);
  const nRings = Math.floor(n * 0.55);
  const nMist = n - nCore - nRings;

  pushDisk(out, cx, cy, 0.16, nCore, salt);
  pushDisk(out, cx, cy, 0.08, Math.floor(nCore * 0.45), salt + 5);
  const rings = [0.22, 0.36, 0.52, 0.7, 0.9, 1.08];
  const per = Math.floor(nRings / rings.length);
  rings.forEach((r, i) => {
    const count = i === rings.length - 1 ? nRings - per * (rings.length - 1) : per;
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2;
      out.push([
        cx + Math.cos(a) * r,
        cy + Math.sin(a) * r * 0.28,
        (hash2(salt + i * 40 + k, 11) * 2 - 1) * 0.025 - 0.04,
      ]);
    }
  });
  for (let i = 0; i < nMist; i++) {
    const a = hash2(salt + i, 12) * Math.PI * 2;
    const r = 0.4 + hash2(salt + i, 13) * 0.8;
    out.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r * 0.3,
      (hash2(salt + i, 14) * 2 - 1) * 0.05 - 0.07,
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushHalo(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = hash2(salt + i, 20) * Math.PI * 2;
    const r = 0.45 + hash2(salt + i, 21) * 1.35;
    out.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r * 0.85,
      (hash2(salt + i, 22) * 2 - 1) * 0.14,
    ]);
  }
}

/** Dense readable particle question mark */
function pushQuestionMark(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const nHook = Math.floor(n * 0.5);
  const nStem = Math.floor(n * 0.2);
  const nNeck = Math.floor(n * 0.12);
  const nDot = Math.floor(n * 0.1);
  const nTip = n - nHook - nStem - nNeck - nDot;

  pushArc(out, cx + 0.02 * s, cy + 0.34 * s, 0.36 * s, Math.PI * 1.08, Math.PI * 2.08, Math.floor(nHook * 0.55), salt, 0.055 * s);
  pushArc(out, cx + 0.02 * s, cy + 0.34 * s, 0.28 * s, Math.PI * 1.1, Math.PI * 2.02, nHook - Math.floor(nHook * 0.55), salt + 20, 0.04 * s);

  pushSeg(out, cx + 0.24 * s, cy + 0.3 * s, cx + 0.02 * s, cy - 0.02 * s, Math.floor(nStem * 0.55), salt + 40, 0.045 * s);
  pushSeg(out, cx + 0.15 * s, cy + 0.26 * s, cx - 0.02 * s, cy - 0.05 * s, nStem - Math.floor(nStem * 0.55), salt + 60, 0.035 * s);

  pushSeg(out, cx - 0.01 * s, cy - 0.05 * s, cx - 0.01 * s, cy - 0.3 * s, nNeck, salt + 80, 0.042 * s);

  pushDisk(out, cx, cy - 0.4 * s, 0.095 * s, nDot, salt + 100);
  pushSeg(out, cx, cy - 0.44 * s, cx, cy - 0.74 * s, nTip, salt + 120, 0.03 * s);
  pushDisk(out, cx, cy - 0.76 * s, 0.05 * s, Math.max(24, Math.floor(nTip * 0.25)), salt + 140);

  trimTo(out, start, n, [cx, cy, 0]);
}

export async function buildFaqTarget(count: number): Promise<ParticleTarget> {
  // Dense mark first — orbits/halo/portal support readability of "?"
  const nHalo = Math.floor(count * 0.1);
  const nFloor = Math.floor(count * 0.12);
  const nOrbit = Math.floor(count * 0.22);
  const nMark = count - nHalo - nFloor - nOrbit;

  const slots: Pt[] = [];
  const markY = 0.22;

  {
    const start = slots.length;
    pushHalo(slots, 0, markY, nHalo, 1);
    trimTo(slots, start, nHalo, [0, markY, 0]);
  }

  {
    const start = slots.length;
    pushPortalFloor(slots, 0, -0.92, nFloor, 30);
    trimTo(slots, start, nFloor, [0, -0.92, 0]);
  }

  {
    const start = slots.length;
    const a = Math.floor(nOrbit * 0.36);
    const b = Math.floor(nOrbit * 0.3);
    const c = Math.floor(nOrbit * 0.2);
    const d = nOrbit - a - b - c;
    pushOrbit(slots, 0, markY - 0.02, 1.05, 0.86, a, 50, 0.5, 0.18);
    pushOrbit(slots, 0, markY + 0.02, 1.36, 1.05, b, 70, 0.66, -0.38);
    pushOrbit(slots, 0, markY - 0.08, 1.58, 1.18, c, 85, 0.78, 0.55);
    pushFatRing(slots, 0, markY, 0.78, d, 90, 0.014);
    trimTo(slots, start, nOrbit, [0, markY, 0]);
  }

  {
    const start = slots.length;
    pushQuestionMark(slots, 0, markY, 1.22, nMark, 100);
    trimTo(slots, start, nMark, [0, markY, 0]);
  }

  while (slots.length < count) slots.push([0, markY, 0]);
  if (slots.length > count) slots.length = count;
  return pack(slots, count, CONFIG.id);
}

export { buildFaqTarget as buildTarget };
