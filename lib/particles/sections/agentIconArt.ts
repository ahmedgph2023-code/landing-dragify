/**
 * Shared AI-agent silhouette matching the neon robot reference art
 * (`/icons/nl3/ai-agent-ref.png`): thick chrome squircle, solid eyes,
 * thin smile, pill ears, antenna + ring — ONE icon, no nested twin.
 */

import { hash2 } from '../noise';

export type Pt = [number, number, number];
type XY = [number, number];

export const AGENT_REF = '/icons/nl3/ai-agent-ref.png';

let cachedSil: XY[] | null = null;

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });
}

/** Sample bright cyan glow from the reference — tight threshold avoids soft bloom ghosting */
export async function getAgentRefSilhouette(): Promise<XY[]> {
  if (cachedSil && cachedSil.length > 80) return cachedSil;
  try {
    const img = await loadImage(AGENT_REF);
    const w = 320;
    const h = 320;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    ctx.clearRect(0, 0, w, h);
    // Slight pad so glow isn't clipped
    const pad = 28;
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
        // Keep the neon core (eyes/rim/mouth) — skip soft dim bloom halo
        if (a > 60 && lum > 120 && (b > 100 || g > 140)) raw.push([x, y]);
      }
    }
    if (raw.length < 80) {
      cachedSil = [];
      return cachedSil;
    }
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
    cachedSil = raw.map(([x, y]) => [((x - cx) / span) * 2, -((y - cy) / span) * 2]);
    return cachedSil;
  } catch {
    cachedSil = [];
    return cachedSil;
  }
}

function pushDisk(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = hash2(salt + i, 4) * Math.PI * 2;
    const rr = r * Math.sqrt(hash2(salt + i, 5));
    out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, (hash2(salt + i, 6) * 2 - 1) * 0.015]);
  }
}

function pushRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, (hash2(salt + i, 7) * 2 - 1) * 0.015]);
  }
}

function pushSeg(out: Pt[], ax: number, ay: number, bx: number, by: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    out.push([ax + (bx - ax) * t, ay + (by - ay) * t, (hash2(salt + i, 8) * 2 - 1) * 0.01]);
  }
}

function pushThick(
  out: Pt[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
  n: number,
  salt: number,
  width = 0.014,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * width;
  const py = (dx / len) * width;
  const third = Math.max(3, Math.floor(n / 3));
  pushSeg(out, ax, ay, bx, by, third, salt);
  pushSeg(out, ax + px, ay + py, bx + px, by + py, third, salt + 2);
  pushSeg(out, ax - px, ay - py, bx - px, by - py, n - third * 2, salt + 4);
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
    out.push([x, y, (hash2(salt + i, 9) * 2 - 1) * 0.015]);
  }
}

function trimTo(out: Pt[], start: number, n: number, fill: Pt) {
  while (out.length - start < n) out.push([...fill]);
  if (out.length - start > n) out.splice(start + n);
}

/** Thick chrome rim = several very-close bands (reads as one fat frame) */
function pushChromeRim(
  out: Pt[],
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number,
  n: number,
  salt: number,
  fat: number,
) {
  const bands = 5;
  const per = Math.max(6, Math.floor(n / bands));
  for (let b = 0; b < bands; b++) {
    const u = b / (bands - 1); // 0..1
    const grow = (u - 0.5) * 2 * fat;
    const count = b === bands - 1 ? n - per * (bands - 1) : per;
    pushRoundRect(out, cx, cy, w + grow * 2, h + grow * 2, Math.max(0.02, r + grow), count, salt + b);
  }
}

function pushFilledPill(out: Pt[], cx: number, cy: number, w: number, h: number, n: number, salt: number) {
  // Solid ear muffs like the reference
  for (let i = 0; i < n; i++) {
    const u = hash2(salt + i, 20);
    const v = hash2(salt + i, 21);
    const x = cx + (u - 0.5) * w;
    const y = cy + (v - 0.5) * h;
    // keep roughly capsule
    const nx = (x - cx) / (w * 0.5 || 1);
    const ny = (y - cy) / (h * 0.5 || 1);
    if (nx * nx + ny * ny * 0.55 > 1.05) continue;
    out.push([x, y, (hash2(salt + i, 22) * 2 - 1) * 0.01]);
  }
}

function pushFromSil(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number, sil: XY[]) {
  const start = out.length;
  const m = 0.48 * s; // unit [-1,1] → visual size
  for (let i = 0; i < n; i++) {
    const src = sil[Math.floor(hash2(salt + i, 31) * sil.length) % sil.length];
    const jx = (hash2(salt + i, 32) * 2 - 1) * 0.003 * s;
    const jy = (hash2(salt + i, 33) * 2 - 1) * 0.003 * s;
    out.push([cx + src[0] * m + jx, cy + src[1] * m + jy, (hash2(salt + i, 34) * 2 - 1) * 0.012]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

/**
 * Procedural match of the neon robot reference (fallback if image fails).
 */
function pushProceduralAgent(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const nRim = Math.floor(n * 0.34);
  const nFill = Math.floor(n * 0.18);
  const nEyes = Math.floor(n * 0.22);
  const nMouth = Math.floor(n * 0.09);
  const nEars = Math.floor(n * 0.1);
  const nAnt = n - nRim - nFill - nEyes - nMouth - nEars;

  const headW = 0.46 * s;
  const headH = 0.44 * s;
  const headR = 0.145 * s;
  pushChromeRim(out, cx, cy, headW, headH, headR, nRim, salt, 0.034 * s);

  // Soft interior volume — denser near center, keeps silhouette readable
  for (let i = 0; i < nFill; i++) {
    const u = hash2(salt + i, 15);
    const v = hash2(salt + i, 16);
    const x = cx + (u - 0.5) * headW * 0.78;
    const y = cy + (v - 0.5) * headH * 0.74;
    out.push([x, y, (hash2(salt + i, 17) * 2 - 1) * 0.05 * s]);
  }

  const eye = Math.floor(nEyes / 2);
  const eyeY = cy + 0.045 * s;
  const ex = 0.095 * s;
  pushDisk(out, cx - ex, eyeY, 0.055 * s, Math.floor(eye * 0.65), salt + 20);
  pushRing(out, cx - ex, eyeY, 0.062 * s, eye - Math.floor(eye * 0.65), salt + 25);
  pushDisk(out, cx + ex, eyeY, 0.055 * s, Math.floor((nEyes - eye) * 0.65), salt + 30);
  pushRing(out, cx + ex, eyeY, 0.062 * s, nEyes - eye - Math.floor((nEyes - eye) * 0.65), salt + 35);

  pushThick(
    out,
    cx - 0.09 * s,
    cy - 0.055 * s,
    cx,
    cy - 0.095 * s,
    Math.floor(nMouth / 2),
    salt + 40,
    0.014 * Math.min(1.2, s),
  );
  pushThick(
    out,
    cx,
    cy - 0.095 * s,
    cx + 0.09 * s,
    cy - 0.055 * s,
    nMouth - Math.floor(nMouth / 2),
    salt + 50,
    0.014 * Math.min(1.2, s),
  );

  const ear = Math.floor(nEars / 2);
  const earX = headW * 0.5 + 0.012 * s;
  pushFilledPill(out, cx - earX, cy, 0.075 * s, 0.15 * s, ear, salt + 60);
  pushFilledPill(out, cx + earX, cy, 0.075 * s, 0.15 * s, nEars - ear, salt + 70);

  const stem = Math.floor(nAnt * 0.4);
  const tip = Math.max(10, nAnt - stem);
  pushThick(out, cx, cy + headH * 0.5, cx, cy + headH * 0.5 + 0.11 * s, Math.max(6, stem), salt + 80, 0.015 * Math.min(1, s));
  pushRing(out, cx, cy + headH * 0.5 + 0.14 * s, 0.034 * s, Math.floor(tip * 0.55), salt + 90);
  pushRing(out, cx, cy + headH * 0.5 + 0.14 * s, 0.044 * s, tip - Math.floor(tip * 0.55), salt + 100);

  trimTo(out, start, n, [cx, cy, 0]);
}

/** Place the reference agent (sampled) or procedural twin at (cx,cy). */
export function pushAgentArt(
  out: Pt[],
  cx: number,
  cy: number,
  s: number,
  n: number,
  salt: number,
  sil: XY[] = [],
) {
  if (sil.length > 80) {
    pushFromSil(out, cx, cy, s, n, salt, sil);
    return;
  }
  pushProceduralAgent(out, cx, cy, s, n, salt);
}
