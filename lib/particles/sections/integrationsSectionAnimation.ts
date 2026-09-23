/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: INTEGRATIONS — ECOSYSTEM TREE
 * ═══════════════════════════════════════════════════════════
 * Portal base · central trunk · 5 logo orbs on energy branches.
 * Full-viewport digital terrain / starfield live in
 * EnvironmentTerrain + AmbientParticles — NEVER in this morph.
 */

import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';

export const CONFIG = {
  id: 'integrations' as const,
  scale: 1.78,
  depth: 0.11,
};

export const INTEGRATIONS_SECTION = CONFIG;

/** Logos inside the five tree orbs (ref: Google, Slack, Salesforce, Drive, AWS) */
const TREE_LOGOS = [
  { src: '/google.png', alt: 'Google' },
  { src: '/slack.png', alt: 'Slack' },
  { src: '/salesforce.png', alt: 'Salesforce' },
  { src: '/onedrive.png', alt: 'Drive' },
  { src: '/amazon.png', alt: 'AWS' },
] as const;

type Pt = [number, number, number];
type XY = [number, number];

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
      (hash2(salt + i, 4) * 2 - 1) * 0.02,
    ]);
  }
}

function pushRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r,
      (hash2(salt + i, 5) * 2 - 1) * 0.012,
    ]);
  }
}

function pushFatRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number, fat = 0.022) {
  const bands = 5;
  const per = Math.max(8, Math.floor(n / bands));
  for (let b = 0; b < bands; b++) {
    const t = (b / (bands - 1) - 0.5) * 2;
    const count = b === bands - 1 ? n - per * (bands - 1) : per;
    pushRing(out, cx, cy, r + t * fat, count, salt + b);
  }
}

/** Volumetric energy branch — denser near trunk, thinner toward orb */
function pushBranch(
  out: Pt[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
  n: number,
  salt: number,
) {
  const start = out.length;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    const width = 0.062 * (1 - t * 0.7) + 0.014;
    const bend = Math.sin(t * Math.PI) * 0.1;
    const j = (hash2(salt + i, 10) * 2 - 1) * width;
    const swirl = Math.sin(t * Math.PI * 3.2 + salt) * 0.012;
    out.push([
      ax + dx * t + px * (j + swirl) - uy * bend,
      ay + dy * t + py * (j + swirl) + ux * bend,
      (hash2(salt + i, 11) * 2 - 1) * 0.05,
    ]);
  }
  trimTo(out, start, n, [(ax + bx) * 0.5, (ay + by) * 0.5, 0]);
}

/** Local portal under trunk — illustration only, not full-viewport floor */
function pushBasePlatform(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  const nRings = Math.floor(n * 0.58);
  const nCore = Math.floor(n * 0.18);
  const nBeams = n - nRings - nCore;

  const rings = [0.2, 0.32, 0.46, 0.6, 0.74];
  const per = Math.floor(nRings / rings.length);
  rings.forEach((r, i) => {
    const count = i === rings.length - 1 ? nRings - per * (rings.length - 1) : per;
    pushFatRing(out, cx, cy, r, count, salt + i * 7, 0.014);
  });

  pushDisk(out, cx, cy, 0.15, nCore, salt + 40);

  for (let i = 0; i < nBeams; i++) {
    const a = hash2(salt + i, 20) * Math.PI * 2;
    const rr = 0.1 + hash2(salt + i, 21) * 0.45;
    const x = cx + Math.cos(a) * rr;
    const drop = hash2(salt + i, 22) * 0.5;
    out.push([x, cy - drop, (hash2(salt + i, 23) * 2 - 1) * 0.04]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

/** Soft mist around the tree only */
function pushLocalMist(out: Pt[], n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = hash2(salt + i, 40) * Math.PI * 2;
    const r = 0.35 + hash2(salt + i, 41) * 1.35;
    out.push([
      Math.cos(a) * r,
      0.15 + Math.sin(a) * r * 0.75,
      (hash2(salt + i, 42) * 2 - 1) * 0.12,
    ]);
  }
}

async function sampleLogoInk(src: string): Promise<XY[]> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(src));
      el.src = src;
    });
    const w = 200;
    const h = 200;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    ctx.clearRect(0, 0, w, h);
    ctx.filter = 'grayscale(1) invert(1) contrast(1.25) brightness(1.08)';
    const pad = 30;
    ctx.drawImage(img, pad, pad, w - pad * 2, h - pad * 2);
    ctx.filter = 'none';
    const { data } = ctx.getImageData(0, 0, w, h);
    const raw: Array<[number, number]> = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (data[i + 3] > 50 && lum > 75) raw.push([x, y]);
      }
    }
    if (raw.length < 20) return [];
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const [x, y] of raw) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const cx = (minX + maxX) * 0.5;
    const cy = (minY + maxY) * 0.5;
    const span = Math.max(maxX - minX, maxY - minY) || 1;
    return raw.map(([x, y]) => [((x - cx) / span) * 2, -((y - cy) / span) * 2]);
  } catch {
    return [];
  }
}

function placeLogo(out: Pt[], sil: XY[], cx: number, cy: number, size: number, n: number, salt: number) {
  const start = out.length;
  if (sil.length < 15) {
    pushDisk(out, cx, cy, size * 0.22, n, salt);
    trimTo(out, start, n, [cx, cy, 0]);
    return;
  }
  const m = size * 0.44;
  for (let i = 0; i < n; i++) {
    const src = sil[Math.floor(hash2(salt + i, 50) * sil.length) % sil.length];
    out.push([cx + src[0] * m, cy + src[1] * m, (hash2(salt + i, 51) * 2 - 1) * 0.01]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

async function buildProcedural(count: number): Promise<ParticleTarget> {
  const logos = await Promise.all(TREE_LOGOS.map((l) => sampleLogoInk(l.src)));

  // Fan matching ref: Google · Slack (apex) · Salesforce · Drive · AWS
  const nodes: Array<{ x: number; y: number }> = [
    { x: -0.98, y: 0.62 },
    { x: 0.02, y: 1.18 },
    { x: 1.0, y: 0.58 },
    { x: -0.72, y: 0.08 },
    { x: 0.78, y: 0.05 },
  ];
  const trunkBase = { x: 0.0, y: -0.02 };
  const trunkTop = { x: 0.0, y: 0.52 };
  const platformY = -0.32;
  const orbR = 0.3;

  const nMist = Math.floor(count * 0.07);
  const nBase = Math.floor(count * 0.17);
  const nTrunk = Math.floor(count * 0.11);
  const nBranches = Math.floor(count * 0.18);
  const rest = count - nMist - nBase - nTrunk - nBranches;
  const perOrb = Math.floor(rest / nodes.length);
  const leftover = rest - perOrb * nodes.length;

  const slots: Pt[] = [];

  {
    const start = slots.length;
    pushLocalMist(slots, nMist, 1);
    trimTo(slots, start, nMist, [0, 0.3, 0]);
  }

  {
    const start = slots.length;
    pushBasePlatform(slots, 0, platformY, nBase, 40);
    trimTo(slots, start, nBase, [0, platformY, 0]);
  }

  {
    const start = slots.length;
    pushBranch(slots, trunkBase.x, trunkBase.y, trunkTop.x, trunkTop.y, Math.floor(nTrunk * 0.85), 60);
    pushDisk(slots, trunkBase.x, trunkBase.y, 0.1, nTrunk - Math.floor(nTrunk * 0.85), 70);
    trimTo(slots, start, nTrunk, [0, 0.2, 0]);
  }

  {
    const start = slots.length;
    const perB = Math.floor(nBranches / nodes.length);
    nodes.forEach((node, i) => {
      const nb = i === nodes.length - 1 ? nBranches - perB * (nodes.length - 1) : perB;
      const joinY = trunkTop.y - 0.12 + (i % 3) * 0.03;
      pushBranch(slots, 0.02 * (i - 2), joinY, node.x * 0.8, node.y - orbR * 0.5, nb, 80 + i * 11);
    });
    trimTo(slots, start, nBranches, [0, 0.6, 0]);
  }

  nodes.forEach((node, i) => {
    const start = slots.length;
    const nc = perOrb + (i === nodes.length - 1 ? leftover : 0);
    const nShell = Math.floor(nc * 0.52);
    const nLogo = nc - nShell;
    pushFatRing(slots, node.x, node.y, orbR, Math.floor(nShell * 0.72), 100 + i * 13, 0.03);
    for (let k = 0; k < nShell - Math.floor(nShell * 0.72); k++) {
      const a = hash2(200 + i * 50 + k, 55) * Math.PI * 2;
      const rr = orbR * (1.05 + hash2(200 + i * 50 + k, 56) * 0.28);
      slots.push([node.x + Math.cos(a) * rr, node.y + Math.sin(a) * rr, 0]);
    }
    placeLogo(slots, logos[i] || [], node.x, node.y, orbR * 1.4, nLogo, 300 + i * 17);
    trimTo(slots, start, nc, [node.x, node.y, 0]);
  });

  while (slots.length < count) slots.push([0, 0.3, 0]);
  if (slots.length > count) slots.length = count;
  return pack(slots, count, CONFIG.id);
}

export async function buildIntegrationsTarget(count: number): Promise<ParticleTarget> {
  return buildProcedural(count);
}

export { buildIntegrationsTarget as buildTarget };
