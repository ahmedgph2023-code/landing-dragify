/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: FEATURES — PLATFORM CAPABILITY HUB
 * ═══════════════════════════════════════════════════════════
 * Center agent hub · 4 satellite nodes · thick spokes · dual orbits.
 * Digital floor / starfield live in EnvironmentTerrain + AmbientParticles
 * (full viewport) — never packed into this morph target.
 */

import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';
import { pushAgentArt } from './agentIconArt';

export const CONFIG = {
  id: 'features' as const,
  scale: 1.72,
  depth: 0.055,
};

export const FEATURES_SECTION = CONFIG;

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

function pushDisk(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = hash2(salt + i, 2) * Math.PI * 2;
    const rr = r * Math.sqrt(hash2(salt + i, 3));
    out.push([
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr,
      (hash2(salt + i, 4) * 2 - 1) * 0.015,
    ]);
  }
}

function pushRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r,
      (hash2(salt + i, 6) * 2 - 1) * 0.008,
    ]);
  }
}

/** Sparse dashed orbit — readable ring without solid mush */
function pushDashedRing(
  out: Pt[],
  cx: number,
  cy: number,
  r: number,
  n: number,
  salt: number,
  dashes = 48,
) {
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const dash = Math.floor(u * dashes);
    if (dash % 2 === 1) continue;
    const a = u * Math.PI * 2;
    const rr = r + (hash2(salt + i, 7) * 2 - 1) * 0.01;
    out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, (hash2(salt + i, 8) * 2 - 1) * 0.012]);
  }
}

function pushFatRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number, fat = 0.018) {
  const bands = 4;
  const per = Math.max(10, Math.floor(n / bands));
  for (let b = 0; b < bands; b++) {
    const t = (b / (bands - 1) - 0.5) * 2;
    const rr = r + t * fat;
    const count = b === bands - 1 ? n - per * (bands - 1) : per;
    pushRing(out, cx, cy, rr, count, salt + b * 3);
  }
}

function pushSeg(out: Pt[], ax: number, ay: number, bx: number, by: number, n: number) {
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    const j = (hash2(i, 12) * 2 - 1) * 0.004;
    out.push([ax + (bx - ax) * t + j, ay + (by - ay) * t + j * 0.5, 0]);
  }
}

function pushThick(
  out: Pt[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
  n: number,
  w = 0.022,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * w;
  const py = (dx / len) * w;
  const third = Math.max(4, Math.floor(n / 3));
  pushSeg(out, ax, ay, bx, by, third);
  pushSeg(out, ax + px, ay + py, bx + px, by + py, third);
  pushSeg(out, ax - px, ay - py, bx - px, by - py, n - third * 2);
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
    out.push([x, y, 0]);
  }
}

function trimTo(out: Pt[], start: number, n: number, fill: Pt) {
  while (out.length - start < n) out.push([...fill]);
  if (out.length - start > n) out.splice(start + n);
}

/** Cross / orchestration — 4-way hub */
function iconCross(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  const q = Math.max(10, Math.floor(n / 5));
  pushDisk(out, cx, cy, 0.038, q, salt);
  pushThick(out, cx - 0.15, cy, cx + 0.15, cy, q, 0.014);
  pushThick(out, cx, cy - 0.15, cx, cy + 0.15, q, 0.014);
  pushDisk(out, cx - 0.15, cy, 0.03, q, salt + 10);
  pushDisk(out, cx + 0.15, cy, 0.03, q, salt + 20);
  pushDisk(out, cx, cy - 0.15, 0.03, q, salt + 30);
  pushDisk(out, cx, cy + 0.15, 0.03, n - (out.length - start), salt + 40);
  trimTo(out, start, n, [cx, cy, 0]);
}

/** Rocket — deploy silhouette */
function iconRocket(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  pushRoundRect(out, cx, cy + 0.02, 0.1, 0.22, 0.04, Math.floor(n * 0.4), salt);
  pushDisk(out, cx, cy + 0.16, 0.04, Math.floor(n * 0.15), salt + 10);
  pushThick(out, cx - 0.03, cy - 0.05, cx - 0.11, cy - 0.14, Math.floor(n * 0.15), 0.014);
  pushThick(out, cx + 0.03, cy - 0.05, cx + 0.11, cy - 0.14, Math.floor(n * 0.15), 0.014);
  pushDisk(out, cx, cy - 0.16, 0.036, n - (out.length - start), salt + 40);
  trimTo(out, start, n, [cx, cy, 0]);
}

/** API / data docs — square + lines + arrow tips (ref bottom-right) */
function iconDocs(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  const nFrame = Math.floor(n * 0.4);
  pushRoundRect(out, cx, cy, 0.26, 0.26, 0.04, nFrame, salt);
  const row = Math.max(6, Math.floor((n - nFrame) / 5));
  pushDisk(out, cx - 0.07, cy + 0.06, 0.022, row, salt + 10);
  pushDisk(out, cx - 0.07, cy - 0.04, 0.022, row, salt + 20);
  pushThick(out, cx - 0.02, cy + 0.08, cx + 0.09, cy + 0.08, row, 0.01);
  pushThick(out, cx - 0.02, cy, cx + 0.09, cy, row, 0.01);
  pushThick(out, cx - 0.02, cy - 0.08, cx + 0.09, cy - 0.08, n - (out.length - start), 0.01);
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushNode(
  out: Pt[],
  cx: number,
  cy: number,
  nRing: number,
  nIcon: number,
  salt: number,
  drawIcon: (o: Pt[], x: number, y: number, n: number, salt: number) => void,
) {
  const start = out.length;
  pushFatRing(out, cx, cy, 0.38, Math.floor(nRing * 0.72), salt, 0.018);
  pushRing(out, cx, cy, 0.44, nRing - Math.floor(nRing * 0.72), salt + 8);
  trimTo(out, start, nRing, [cx, cy, 0]);

  const iStart = out.length;
  drawIcon(out, cx, cy, nIcon, salt + 40);
  trimTo(out, iStart, nIcon, [cx, cy, 0]);
}

export async function buildFeaturesTarget(count: number): Promise<ParticleTarget> {
  // Square corners matching features-hub-ref + section layout
  const nodes = [
    { x: -0.95, y: 0.95, icon: 'agent' as const },
    { x: 0.95, y: 0.95, icon: 'cross' as const },
    { x: -0.95, y: -0.95, icon: 'rocket' as const },
    { x: 0.95, y: -0.95, icon: 'docs' as const },
  ];

  const hub = Math.floor(count * 0.22);
  const orbits = Math.floor(count * 0.1);
  const links = Math.floor(count * 0.15);
  const mist = Math.floor(count * 0.05);
  const rem = Math.max(0, count - hub - orbits - links - mist);
  const per = Math.floor(rem / 4);
  const nRing = Math.floor(per * 0.48);
  const nIcon = per - nRing;
  const leftover = rem - per * 4;

  const slots: Pt[] = [];

  // Center hub — fat ring + crisp agent (no floor)
  {
    const start = slots.length;
    const n = hub + leftover;
    const nR = Math.floor(n * 0.36);
    const nBloom = Math.floor(n * 0.12);
    const nA = n - nR - nBloom;
    pushFatRing(slots, 0, 0, 0.54, Math.floor(nR * 0.72), 1, 0.022);
    pushRing(slots, 0, 0, 0.6, nR - Math.floor(nR * 0.72), 2);
    pushDisk(slots, 0, 0, 0.42, nBloom, 3);
    pushAgentArt(slots, 0, 0, 0.88, nA, 10, []);
    trimTo(slots, start, n, [0, 0, 0]);
  }

  // Dual outer guide orbits (dashed + soft)
  {
    const start = slots.length;
    const a = Math.floor(orbits * 0.55);
    const b = orbits - a;
    pushDashedRing(slots, 0, 0, 1.28, a, 20, 52);
    pushRing(slots, 0, 0, 1.42, b, 21);
    trimTo(slots, start, orbits, [0, 0, 0]);
  }

  // Thick spokes hub → satellites
  {
    const start = slots.length;
    const perLink = Math.floor(links / 4);
    nodes.forEach((node, i) => {
      const n = i === 3 ? links - perLink * 3 : perLink;
      const len = Math.hypot(node.x, node.y) || 1;
      const x0 = (node.x / len) * 0.58;
      const y0 = (node.y / len) * 0.58;
      const x1 = (node.x / len) * (len - 0.44);
      const y1 = (node.y / len) * (len - 0.44);
      pushThick(slots, x0, y0, x1, y1, n, 0.026);
    });
    trimTo(slots, start, links, [0, 0, 0]);
  }

  // Four equal satellite nodes
  nodes.forEach((node, i) => {
    if (node.icon === 'agent') {
      pushNode(slots, node.x, node.y, nRing, nIcon, 100 + i * 30, (o, x, y, n, s) => {
        pushAgentArt(o, x, y, 0.6, n, s, []);
      });
    } else if (node.icon === 'cross') {
      pushNode(slots, node.x, node.y, nRing, nIcon, 100 + i * 30, iconCross);
    } else if (node.icon === 'rocket') {
      pushNode(slots, node.x, node.y, nRing, nIcon, 100 + i * 30, iconRocket);
    } else {
      pushNode(slots, node.x, node.y, nRing, nIcon, 100 + i * 30, iconDocs);
    }
  });

  // Local atmospheric mist around the graph only (NOT a floor)
  {
    const start = slots.length;
    for (let i = 0; i < mist; i++) {
      const a = hash2(i, 50) * Math.PI * 2;
      const r = 0.3 + hash2(i, 51) * 1.2;
      slots.push([
        Math.cos(a) * r,
        Math.sin(a) * r * 0.92,
        (hash2(i, 52) * 2 - 1) * 0.05,
      ]);
    }
    trimTo(slots, start, mist, [0, 0, 0]);
  }

  while (slots.length < count) slots.push([0, 0, 0]);
  if (slots.length > count) slots.length = count;
  return pack(slots, count, CONFIG.id);
}

export { buildFeaturesTarget as buildTarget };
