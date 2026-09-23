/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: HOW — PERSON → AGENT → PLAY
 * ═══════════════════════════════════════════════════════════
 * Matches layout ref: left diagonal particle orbs + energy bridges.
 *
 * Image sampling uses a high-res pass (createFromImage’s 256² is too
 * soft for three readable icons). Procedural fallback mirrors the same
 * composition with crisp fat rings + plasma streams.
 */

import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';
import { pushAgentArt } from './agentIconArt';

export const CONFIG = {
  id: 'how' as const,
  /**
   * Procedural = crisp readable orbs (person → agent → play).
   * Set to 'image' to high-res-sample `/icons/nl3/how-flow-ref.png`.
   */
  mode: 'procedural' as 'procedural' | 'image',
  image: '/icons/nl3/how-flow-ref.png',
  scale: 2.05,
  depth: 0.1,
  jitter: 0.006,
};

export const HOW_SECTION = CONFIG;

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

function pushRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, (hash2(salt + i, 5) * 2 - 1) * 0.008]);
  }
}

/** Thick luminous shell — dense rim + soft outer spray (ref glow) */
function pushGlowShell(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  const start = out.length;
  const nRim = Math.floor(n * 0.42);
  const nVol = Math.floor(n * 0.38);
  const nSpray = n - nRim - nVol;

  // Multi-band fat rim
  const bands = 6;
  const per = Math.max(8, Math.floor(nRim / bands));
  for (let b = 0; b < bands; b++) {
    const t = (b / (bands - 1) - 0.5) * 2;
    const rr = r + t * 0.045;
    const count = b === bands - 1 ? nRim - per * (bands - 1) : per;
    pushRing(out, cx, cy, rr, count, salt + b);
  }

  // Volume biased to the rim (holographic dust shell)
  for (let i = 0; i < nVol; i++) {
    const a = hash2(salt + i, 10) * Math.PI * 2;
    const u = Math.pow(hash2(salt + i, 11), 0.45);
    const rr = r * (0.62 + u * 0.48);
    out.push([
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr,
      (hash2(salt + i, 12) * 2 - 1) * 0.035,
    ]);
  }

  // Breakaway mist
  for (let i = 0; i < nSpray; i++) {
    const a = hash2(salt + i, 13) * Math.PI * 2;
    const rr = r * (1.05 + hash2(salt + i, 14) * 0.38);
    out.push([
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr,
      (hash2(salt + i, 15) * 2 - 1) * 0.06,
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

/**
 * Plasma bridge that flares into each orb (waist in the middle).
 */
function pushPlasmaBridge(
  out: Pt[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
  n: number,
  salt: number,
  nodeR: number,
) {
  const start = out.length;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  const x0 = ax + ux * (nodeR * 0.88);
  const y0 = ay + uy * (nodeR * 0.88);
  const x1 = bx - ux * (nodeR * 0.88);
  const y1 = by - uy * (nodeR * 0.88);

  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    // Wide near nodes, narrow waist — matches the ref “umbilical”
    const flare = 0.028 + Math.pow(Math.sin(t * Math.PI), 0.65) * 0.09;
    const edgeBoost = Math.pow(Math.min(t, 1 - t) * 2, 0.5); // wider at ends
    const width = flare * (0.55 + edgeBoost * 0.9);
    const swirl = Math.sin(t * Math.PI * 4 + salt * 0.1) * 0.012;
    const j = (hash2(salt + i, 20) * 2 - 1) * width;
    const along = (hash2(salt + i, 21) * 2 - 1) * 0.01;
    const bend = Math.sin(t * Math.PI) * 0.045;
    out.push([
      x0 + (x1 - x0) * t + px * (j + swirl) + ux * along - uy * bend,
      y0 + (y1 - y0) * t + py * (j + swirl) + uy * along + ux * bend,
      (hash2(salt + i, 22) * 2 - 1) * 0.04,
    ]);
  }
  trimTo(out, start, n, [(ax + bx) * 0.5, (ay + by) * 0.5, 0]);
}

/** Outline person icon (head + shoulders) — particle line art */
function pushUserIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const nHead = Math.floor(n * 0.4);
  const nBody = n - nHead;

  // Head ring (outline, not solid fill)
  pushRing(out, cx, cy + 0.07 * s, 0.085 * s, Math.floor(nHead * 0.7), salt);
  pushRing(out, cx, cy + 0.07 * s, 0.07 * s, nHead - Math.floor(nHead * 0.7), salt + 2);

  // Shoulders arc
  for (let i = 0; i < nBody; i++) {
    const t = i / Math.max(1, nBody - 1);
    const a = Math.PI * 1.12 + t * Math.PI * 0.76;
    const r = 0.155 * s;
    const j = (hash2(salt + i, 30) * 2 - 1) * 0.006 * s;
    out.push([
      cx + Math.cos(a) * r + j,
      cy - 0.05 * s + Math.sin(a) * r * 0.55,
      0,
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

/** Outline play triangle */
function pushPlayIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const ox = cx - 0.015 * s;
  const a: [number, number] = [ox - 0.07 * s, cy + 0.11 * s];
  const b: [number, number] = [ox - 0.07 * s, cy - 0.11 * s];
  const c: [number, number] = [ox + 0.13 * s, cy];
  const nEdge = Math.floor(n * 0.55);
  const nFill = n - nEdge;
  const per = Math.max(6, Math.floor(nEdge / 3));

  for (let i = 0; i < per; i++) {
    const t = i / Math.max(1, per - 1);
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0]);
  }
  for (let i = 0; i < per; i++) {
    const t = i / Math.max(1, per - 1);
    out.push([b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t, 0]);
  }
  for (let i = 0; i < nEdge - per * 2; i++) {
    const t = i / Math.max(1, nEdge - per * 2 - 1);
    out.push([c[0] + (a[0] - c[0]) * t, c[1] + (a[1] - c[1]) * t, 0]);
  }

  // Light inner fill so it reads at distance
  for (let i = 0; i < nFill; i++) {
    let u = hash2(salt + i, 40);
    let v = hash2(salt + i, 41);
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    // Pull toward edges (outline bias)
    const edge = Math.pow(Math.min(u, v, w) * 3, 0.35);
    const uu = u + (0.33 - u) * (1 - edge) * 0.35;
    const vv = v + (0.33 - v) * (1 - edge) * 0.35;
    const ww = 1 - uu - vv;
    out.push([
      a[0] * ww + b[0] * uu + c[0] * vv,
      a[1] * ww + b[1] * uu + c[1] * vv,
      0,
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushAtmosphere(out: Pt[], n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    out.push([
      (hash2(salt + i, 50) * 2 - 1) * 1.6,
      (hash2(salt + i, 51) * 2 - 1) * 1.45,
      (hash2(salt + i, 52) * 2 - 1) * 0.1,
    ]);
  }
}

/**
 * High-res sample of the particle-only ref so the silhouette matches
 * the screenshot (256² createFromImage blurs icons into mush).
 */
async function sampleHowImage(count: number): Promise<ParticleTarget | null> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(CONFIG.image));
      el.src = CONFIG.image;
    });

    const w = 640;
    const h = 640;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.clearRect(0, 0, w, h);
    const pad = 24;
    ctx.drawImage(img, pad, pad, w - pad * 2, h - pad * 2);
    const { data } = ctx.getImageData(0, 0, w, h);

    const raw: Array<[number, number]> = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        const lum = (r + g + b) / 3;
        // Keep bright neon cores; drop dim bloom haze that softens icons
        if (a > 40 && lum > 55 && (g > 70 || b > 90 || r > 80)) {
          raw.push([x, y]);
        }
      }
    }
    if (raw.length < 400) return null;

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

    const out = empty(count, CONFIG.id);
    const scale = CONFIG.scale;
    for (let i = 0; i < count; i++) {
      const src = raw[Math.floor(hash2(i, 60) * raw.length) % raw.length];
      const nx = ((src[0] - cx) / span) * 2;
      const ny = -((src[1] - cy) / span) * 2;
      const jx = (hash2(i, 61) * 2 - 1) * CONFIG.jitter;
      const jy = (hash2(i, 62) * 2 - 1) * CONFIG.jitter;
      out.positions[i * 3] = (nx + jx) * scale;
      out.positions[i * 3 + 1] = (ny + jy) * scale;
      out.positions[i * 3 + 2] = (hash2(i, 63) * 2 - 1) * CONFIG.depth;
    }
    return out;
  } catch {
    return null;
  }
}

async function buildProcedural(count: number): Promise<ParticleTarget> {
  // Crisp procedural agent (same lesson as Agents section) — avoid soft photo mush
  const nodeR = 0.42;
  const nodes = [
    { x: -0.95, y: 0.82, kind: 'user' as const },
    { x: 0.0, y: 0.04, kind: 'agent' as const },
    { x: 0.98, y: -0.8, kind: 'play' as const },
  ];

  const nMist = Math.floor(count * 0.06);
  const nBridges = Math.floor(count * 0.24);
  const rest = count - nMist - nBridges;
  const per = Math.floor(rest / 3);
  const leftover = rest - per * 3;

  const slots: Pt[] = [];

  {
    const start = slots.length;
    pushAtmosphere(slots, nMist, 1);
    trimTo(slots, start, nMist, [0, 0, 0]);
  }

  {
    const start = slots.length;
    const half = Math.floor(nBridges / 2);
    pushPlasmaBridge(slots, nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y, half, 100, nodeR);
    pushPlasmaBridge(
      slots,
      nodes[1].x,
      nodes[1].y,
      nodes[2].x,
      nodes[2].y,
      nBridges - half,
      200,
      nodeR,
    );
    trimTo(slots, start, nBridges, [0, 0, 0]);
  }

  nodes.forEach((node, i) => {
    const start = slots.length;
    const nc = per + (i === 2 ? leftover : 0);
    const nShell = Math.floor(nc * 0.58);
    const nIcon = nc - nShell;

    pushGlowShell(slots, node.x, node.y, nodeR, nShell, 300 + i * 37);

    if (node.kind === 'user') {
      pushUserIcon(slots, node.x, node.y, 1.2, nIcon, 400 + i);
    } else if (node.kind === 'agent') {
      pushAgentArt(slots, node.x, node.y, 0.92, nIcon, 500 + i, []);
    } else {
      pushPlayIcon(slots, node.x, node.y, 1.2, nIcon, 600 + i);
    }
    trimTo(slots, start, nc, [node.x, node.y, 0]);
  });

  while (slots.length < count) slots.push([0, 0, 0]);
  if (slots.length > count) slots.length = count;
  return pack(slots, count, CONFIG.id);
}

export async function buildHowTarget(count: number): Promise<ParticleTarget> {
  if (CONFIG.mode === 'image') {
    const sampled = await sampleHowImage(count);
    if (sampled) return sampled;
  }
  return buildProcedural(count);
}

export { buildHowTarget as buildTarget };
