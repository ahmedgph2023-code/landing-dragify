/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: AGENTS — ROBOT ORB + ORBITS (visual QA vs ref)
 * ═══════════════════════════════════════════════════════════
 * Dense cyan volumetric robot · multi-layer halo · 3 tilted orbits
 * · local portal under feet.
 * Full-viewport starfield / digital terrain: AmbientParticles +
 * EnvironmentTerrain — never a clipped floor under the morph group.
 */

import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';
import { pushAgentArt } from './agentIconArt';

export const CONFIG = {
  id: 'agents' as const,
  /** Composition match: fills left ~45%, not oversized */
  scale: 1.72,
  depth: 0.16,
};

export const AGENTS_SECTION = CONFIG;

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
      (hash2(salt + i, 4) * 2 - 1) * 0.035,
    ]);
  }
}

function pushTiltedOrbit(
  out: Pt[],
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  n: number,
  salt: number,
  tilt = 0.35,
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
    const j = (hash2(salt + i, 5) * 2 - 1) * 0.008;
    out.push([
      cx + xr + j,
      cy + y + j * 0.4,
      zr * 0.62 + (hash2(salt + i, 6) * 2 - 1) * 0.015,
    ]);
  }
}

/** Local portal under robot — illustration only, not full-viewport floor */
function pushPortal(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  const rings = [0.22, 0.4, 0.62, 0.88, 1.12];
  const ringBudget = Math.floor(n * 0.62);
  const perRing = Math.floor(ringBudget / rings.length);
  let used = 0;
  rings.forEach((r, ri) => {
    const count = ri === rings.length - 1 ? ringBudget - used : perRing;
    used += count;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + ri * 0.15;
      const rr = r + (hash2(salt + i + ri * 40, 10) * 2 - 1) * 0.014;
      out.push([
        cx + Math.cos(a) * rr,
        cy + Math.sin(a) * rr * 0.3,
        (hash2(salt + i, 11) * 2 - 1) * 0.035 - 0.05,
      ]);
    }
  });
  const swirl = n - (out.length - start);
  for (let i = 0; i < swirl; i++) {
    const u = i / Math.max(1, swirl - 1);
    const a = u * Math.PI * 2 * 2.35;
    const r = 0.1 + u * 1.05;
    const wobble = (hash2(salt + i, 12) * 2 - 1) * 0.03 * (1 - u * 0.45);
    out.push([
      cx + Math.cos(a) * r + wobble,
      cy + Math.sin(a) * r * 0.32 + wobble * 0.3,
      (hash2(salt + i, 13) * 2 - 1) * 0.04 - u * 0.06,
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

/**
 * Multi-layer atmospheric halo around the robot (dense → sparse).
 * Not a viewport floor — stays near the illustration.
 */
function pushHalo(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  const layers = [
    { r0: 0.55, r1: 0.85, w: 0.32 },
    { r0: 0.85, r1: 1.25, w: 0.28 },
    { r0: 1.2, r1: 1.75, w: 0.24 },
    { r0: 1.55, r1: 2.15, w: 0.16 },
  ];
  let assigned = 0;
  layers.forEach((L, li) => {
    const count =
      li === layers.length - 1
        ? n - assigned
        : Math.floor(n * L.w);
    assigned += count;
    for (let i = 0; i < count; i++) {
      const a = hash2(salt + i + li * 90, 20) * Math.PI * 2;
      const t = hash2(salt + i, 21);
      const r = L.r0 + t * (L.r1 - L.r0);
      const squash = 0.78 + li * 0.04;
      out.push([
        cx + Math.cos(a) * r,
        cy + Math.sin(a) * r * squash * 0.92,
        (hash2(salt + i, 22) * 2 - 1) * (0.08 + li * 0.04),
      ]);
    }
  });
  trimTo(out, start, n, [cx, cy, 0]);
}

export async function buildAgentsTarget(count: number): Promise<ParticleTarget> {
  // Prefer crisp procedural silhouette (readable face) over soft photo sample
  const nHalo = Math.floor(count * 0.16);
  const nPortal = Math.floor(count * 0.13);
  const nOrbitA = Math.floor(count * 0.09);
  const nOrbitB = Math.floor(count * 0.08);
  const nOrbitC = Math.floor(count * 0.07);
  const nEscape = Math.floor(count * 0.05);
  const nRobot = count - nHalo - nPortal - nOrbitA - nOrbitB - nOrbitC - nEscape;

  const slots: Pt[] = [];
  const robotY = 0.32;

  {
    const start = slots.length;
    pushHalo(slots, 0, robotY, nHalo, 1);
    trimTo(slots, start, nHalo, [0, robotY, 0]);
  }

  {
    const start = slots.length;
    pushPortal(slots, 0, -0.95, nPortal, 30);
    trimTo(slots, start, nPortal, [0, -0.95, 0]);
  }

  {
    const start = slots.length;
    pushTiltedOrbit(slots, 0, robotY - 0.05, 0.92, 0.7, nOrbitA, 50, 0.4, 0.2);
    trimTo(slots, start, nOrbitA, [0, robotY, 0]);
  }
  {
    const start = slots.length;
    pushTiltedOrbit(slots, 0, robotY - 0.12, 1.22, 0.86, nOrbitB, 70, 0.58, -0.4);
    trimTo(slots, start, nOrbitB, [0, robotY, 0]);
  }
  {
    const start = slots.length;
    pushTiltedOrbit(slots, 0, robotY - 0.18, 1.42, 0.98, nOrbitC, 90, 0.74, 0.55);
    trimTo(slots, start, nOrbitC, [0, robotY, 0]);
  }

  // Escaping / returning edge particles
  {
    const start = slots.length;
    for (let i = 0; i < nEscape; i++) {
      const a = hash2(i, 40) * Math.PI * 2;
      const r = 0.7 + hash2(i, 41) * 0.85;
      slots.push([
        Math.cos(a) * r,
        robotY + Math.sin(a) * r * 0.65,
        (hash2(i, 42) * 2 - 1) * 0.14,
      ]);
    }
    trimTo(slots, start, nEscape, [0, robotY, 0]);
  }

  // Dense readable robot — empty sil → procedural chrome face (eyes/smile/antenna)
  {
    const start = slots.length;
    const nArt = Math.floor(nRobot * 0.82);
    const nVol = nRobot - nArt;
    pushAgentArt(slots, 0, robotY, 2.05, nArt, 100, []);
    // Soft volumetric fill behind the rim for 3D body
    pushDisk(slots, 0, robotY, 0.42, Math.floor(nVol * 0.55), 120);
    pushDisk(slots, 0, robotY - 0.12, 0.28, nVol - Math.floor(nVol * 0.55), 140);
    trimTo(slots, start, nRobot, [0, robotY, 0]);
  }

  while (slots.length < count) slots.push([0, robotY, 0]);
  if (slots.length > count) slots.length = count;
  return pack(slots, count, CONFIG.id);
}

export { buildAgentsTarget as buildTarget };
