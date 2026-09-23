/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: PARTNERS — TRUST HUB
 * ═══════════════════════════════════════════════════════════
 * Central glowing hub · curved particle tendrils · logo nodes.
 * Digital floor / starfield live in EnvironmentTerrain + AmbientParticles
 * (full viewport) — never packed into this morph target.
 */

import { createFromImage } from '../loadSvgTarget';
import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';
import { HERO_IMAGES, PARTNER_LOGOS } from './homeAssets';

export const CONFIG = {
  id: 'partners' as const,
  /**
   * Same MainParticles cloud as every section — sample Studio section-2 art
   * so hero dissolve → partners reassemble stays one continuous morph (no second canvas/box).
   */
  mode: 'image' as 'procedural' | 'image',
  image: '/icons/nl3/particle/section-2/assets/form-a.png',
  scale: 1.72,
  depth: 0.12,
  jitter: 0.004,
};

export const PARTNERS_SECTION = CONFIG;

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

function pushDisk(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = hash2(salt + i, 2) * Math.PI * 2;
    const rr = r * Math.sqrt(hash2(salt + i, 3));
    out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, (hash2(salt + i, 4) * 2 - 1) * 0.02]);
  }
}

function pushRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number, jitter = 0.01) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + hash2(salt + i, 5) * 0.04;
    const rr = r + (hash2(salt + i, 6) * 2 - 1) * jitter;
    out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, (hash2(salt + i, 7) * 2 - 1) * 0.015]);
  }
}

/** Multi-band quadratic tendril (fiber-optic particle stream) */
function pushTendril(
  out: Pt[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
  n: number,
  salt: number,
  bend = 0.28,
) {
  const mx = (ax + bx) * 0.5 - (by - ay) * bend;
  const my = (ay + by) * 0.5 + (bx - ax) * bend;
  const bands = 3;
  const per = Math.max(6, Math.floor(n / bands));
  for (let b = 0; b < bands; b++) {
    const count = b === bands - 1 ? n - per * (bands - 1) : per;
    const spread = (b - 1) * 0.012;
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(1, count - 1);
      const u = 1 - t;
      const x = u * u * ax + 2 * u * t * mx + t * t * bx;
      const y = u * u * ay + 2 * u * t * my + t * t * by;
      // Density peaks mid-tendril + soft fizz at edges
      const j =
        (hash2(salt + i + b * 40, 8) * 2 - 1) * (0.004 + t * 0.01) +
        Math.sin(t * Math.PI * 3 + b) * spread;
      const z = (hash2(salt + i, 9) * 2 - 1) * 0.03 * (1 - Math.abs(t - 0.5) * 0.6);
      out.push([x + j, y + j * 0.7, z]);
    }
  }
}

function pushRoundRect(
  out: Pt[],
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number,
  n: number,
  salt: number,
) {
  const hw = w * 0.5;
  const hh = h * 0.5;
  const rr = Math.min(r, hw, hh);
  const peri = (w - 2 * rr) * 2 + (h - 2 * rr) * 2 + Math.PI * 2 * rr;
  for (let i = 0; i < n; i++) {
    let d = (i / n) * peri;
    let x = 0;
    let y = 0;
    if (d < w - 2 * rr) {
      x = cx - hw + rr + d;
      y = cy + hh;
    } else {
      d -= w - 2 * rr;
      if (d < (Math.PI * rr) / 2) {
        const a = d / rr;
        x = cx + hw - rr + Math.sin(a) * rr;
        y = cy + hh - rr + Math.cos(a) * rr;
      } else {
        d -= (Math.PI * rr) / 2;
        if (d < h - 2 * rr) {
          x = cx + hw;
          y = cy + hh - rr - d;
        } else {
          d -= h - 2 * rr;
          if (d < (Math.PI * rr) / 2) {
            const a = d / rr;
            x = cx + hw - rr + Math.cos(a) * rr;
            y = cy - hh + rr - Math.sin(a) * rr;
          } else {
            d -= (Math.PI * rr) / 2;
            if (d < w - 2 * rr) {
              x = cx + hw - rr - d;
              y = cy - hh;
            } else {
              d -= w - 2 * rr;
              if (d < (Math.PI * rr) / 2) {
                const a = d / rr;
                x = cx - hw + rr - Math.sin(a) * rr;
                y = cy - hh + rr - Math.cos(a) * rr;
              } else {
                d -= (Math.PI * rr) / 2;
                if (d < h - 2 * rr) {
                  x = cx - hw;
                  y = cy - hh + rr + d;
                } else {
                  d -= h - 2 * rr;
                  const a = Math.min(d, (Math.PI * rr) / 2) / rr;
                  x = cx - hw + rr - Math.cos(a) * rr;
                  y = cy + hh - rr + Math.sin(a) * rr;
                }
              }
            }
          }
        }
      }
    }
    const jz = (hash2(salt + i, 11) * 2 - 1) * 0.012;
    out.push([x, y, jz]);
  }
}

function pushFatRoundRect(
  out: Pt[],
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number,
  n: number,
  salt: number,
  fat = 0.018,
) {
  const bands = 4;
  const per = Math.max(10, Math.floor(n / bands));
  for (let b = 0; b < bands; b++) {
    const t = (b / (bands - 1) - 0.5) * 2;
    const g = fat * t;
    const count = b === bands - 1 ? n - per * (bands - 1) : per;
    pushRoundRect(out, cx, cy, w + g * 2, h + g * 2, Math.max(0.02, r + g), count, salt + b * 7);
  }
}

function trimTo(out: Pt[], start: number, n: number, fill: Pt) {
  while (out.length - start < n) out.push([...fill]);
  if (out.length - start > n) out.splice(start + n);
}

function collectBrightInk(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  lumMin: number,
): Array<[number, number]> {
  const raw: Array<[number, number]> = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (data[i + 3] > 40 && lum > lumMin) raw.push([x, y]);
    }
  }
  return raw;
}

function normalizeInk(raw: Array<[number, number]>): XY[] {
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
    const w = 280;
    const h = 280;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];

    const isSvg = /\.svg(\?|$)/i.test(src);
    const padX = isSvg ? 36 : 18;
    const padY = isSvg ? 36 : 48;
    const lumMin = isSvg ? 55 : 70;

    const draw = (filter: string) => {
      ctx.clearRect(0, 0, w, h);
      ctx.filter = filter;
      ctx.drawImage(img, padX, padY, w - padX * 2, h - padY * 2);
      ctx.filter = 'none';
      return ctx.getImageData(0, 0, w, h).data;
    };

    // Dark marks / currentColor SVGs → invert to bright ink
    let raw = collectBrightInk(
      draw('grayscale(1) invert(1) contrast(1.35) brightness(1.12)'),
      w,
      h,
      lumMin,
    );
    // White-on-black PNGs (e.g. Qatar MCIT) → sample bright ink as-is
    if (raw.length < 25) {
      raw = collectBrightInk(draw('none'), w, h, 90);
    }
    if (raw.length < 25) return [];
    return normalizeInk(raw);
  } catch {
    return [];
  }
}

function placeLogo(out: Pt[], sil: XY[], cx: number, cy: number, boxW: number, boxH: number, n: number, salt: number) {
  const start = out.length;
  if (sil.length < 20) {
    pushDisk(out, cx, cy, Math.min(boxW, boxH) * 0.22, n, salt);
    trimTo(out, start, n, [cx, cy, 0]);
    return;
  }
  const sx = boxW * 0.42;
  const sy = boxH * 0.42;
  for (let i = 0; i < n; i++) {
    const src = sil[Math.floor(hash2(salt + i, 31) * sil.length) % sil.length];
    out.push([cx + src[0] * sx, cy + src[1] * sy, (hash2(salt + i, 32) * 2 - 1) * 0.01]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

/**
 * Hand-tuned orbit matching the section reference (left visual):
 * Flat6 · ITIDA · AWS · Ministry/Qatar · Google · TIEC · NVIDIA
 */
function partnerCardLayout(n: number): Array<{ x: number; y: number; w: number; h: number }> {
  // Reference orbit: wider spread so hub + cards read clearly on the left visual half
  const layout = [
    { x: -1.05, y: 0.95, w: 0.78, h: 0.36 }, // Flat6Labs
    { x: 1.05, y: 0.98, w: 0.66, h: 0.32 }, // ITIDA
    { x: -1.28, y: 0.14, w: 0.6, h: 0.3 }, // AWS
    { x: 1.22, y: 0.2, w: 0.92, h: 0.4 }, // Ministry / Qatar (wider)
    { x: -1.1, y: -0.62, w: 0.76, h: 0.32 }, // Google
    { x: 1.16, y: -0.56, w: 0.62, h: 0.3 }, // TIEC
    { x: 0.02, y: -1.12, w: 0.82, h: 0.36 }, // NVIDIA
  ];
  return layout.slice(0, n).map((c, i) => {
    if (i < layout.length) return c;
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { x: Math.cos(a) * 1.2, y: Math.sin(a) * 1.0, w: 0.7, h: 0.34 };
  });
}

async function buildProcedural(count: number): Promise<ParticleTarget> {
  const [logos, hubSil] = await Promise.all([
    Promise.all(PARTNER_LOGOS.map((l) => sampleLogoInk(l.src))),
    sampleLogoInk(HERO_IMAGES.logo),
  ]);
  const n = PARTNER_LOGOS.length;
  const cards = partnerCardLayout(n);

  // Budget — denser hub + tendrils + cards (floor stays in EnvironmentTerrain)
  const hub = Math.floor(count * 0.18);
  const orbits = Math.floor(count * 0.08);
  const bonds = Math.floor(count * 0.22);
  const mist = Math.floor(count * 0.05);
  const cardBudget = count - hub - orbits - bonds - mist;
  const per = Math.floor(cardBudget / n);
  const leftover = cardBudget - per * n;

  const slots: Pt[] = [];

  // Glowing hub: pill frame + logo ink + bright core bloom
  {
    const start = slots.length;
    const nH = hub;
    const nFrame = Math.floor(nH * 0.3);
    const nCore = Math.floor(nH * 0.24);
    const nLogo = Math.floor(nH * 0.3);
    pushFatRoundRect(slots, 0, 0, 0.38, 0.18, 0.09, nFrame, 1, 0.018);
    pushDisk(slots, 0, 0, 0.14, nCore, 2);
    placeLogo(slots, hubSil, 0, 0, 0.3, 0.14, nLogo, 3);
    // Soft nebula shell around hub
    pushDisk(slots, 0, 0, 0.32, nH - (slots.length - start), 4);
    trimTo(slots, start, nH, [0, 0, 0]);
  }

  // Concentric orbital rings (radar / trust field)
  {
    const start = slots.length;
    pushRing(slots, 0, 0, 0.52, Math.floor(orbits * 0.4), 10, 0.01);
    pushRing(slots, 0, 0, 0.78, Math.floor(orbits * 0.32), 11, 0.012);
    pushRing(slots, 0, 0, 1.12, orbits - (slots.length - start), 12, 0.015);
    trimTo(slots, start, orbits, [0, 0, 0]);
  }

  // Curved particle tendrils hub → each card
  {
    const start = slots.length;
    const perB = Math.floor(bonds / n);
    cards.forEach((c, i) => {
      const nb = i === n - 1 ? bonds - perB * (n - 1) : perB;
      const len = Math.hypot(c.x, c.y) || 1;
      const x0 = (c.x / len) * 0.26;
      const y0 = (c.y / len) * 0.26;
      const x1 = c.x * 0.72;
      const y1 = c.y * 0.72;
      const bend = (i % 2 === 0 ? 1 : -1) * (0.24 + (i % 3) * 0.045);
      pushTendril(slots, x0, y0, x1, y1, nb, 50 + i * 11, bend);
    });
    trimTo(slots, start, bonds, [0, 0, 0]);
  }

  // Partner logo cards — fat glowing frames + ink logos
  cards.forEach((c, i) => {
    const start = slots.length;
    const nc = per + (i === n - 1 ? leftover : 0);
    const nFrame = Math.floor(nc * 0.44);
    const nLogo = nc - nFrame;
    pushFatRoundRect(slots, c.x, c.y, c.w, c.h, 0.1, nFrame, 100 + i * 13, 0.016);
    placeLogo(slots, logos[i] || [], c.x, c.y, c.w * 0.8, c.h * 0.7, nLogo, 200 + i * 17);
    trimTo(slots, start, nc, [c.x, c.y, 0]);
  });

  // Local atmospheric mist around the graph (NOT a floor — stays near structure)
  {
    const start = slots.length;
    for (let i = 0; i < mist; i++) {
      const a = hash2(i, 40) * Math.PI * 2;
      const r = 0.35 + hash2(i, 41) * 1.35;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.88;
      slots.push([x, y, (hash2(i, 42) * 2 - 1) * 0.06]);
    }
    trimTo(slots, start, mist, [0, 0, 0]);
  }

  while (slots.length < count) slots.push([0, 0, 0]);
  if (slots.length > count) slots.length = count;
  return pack(slots, count, CONFIG.id);
}

export async function buildPartnersTarget(count: number): Promise<ParticleTarget> {
  if (CONFIG.mode === 'image') {
    try {
      // Studio section-2 art sampled into the shared morph buffer (continuous with hero/features)
      return await createFromImage(CONFIG.image, count, {
        scale: CONFIG.scale,
        depth: CONFIG.depth,
        jitter: CONFIG.jitter,
        id: CONFIG.id,
        threshold: 28,
        cropBottom: 0,
      });
    } catch {
      /* fall through */
    }
  }
  return buildProcedural(count);
}

export { buildPartnersTarget as buildTarget };
