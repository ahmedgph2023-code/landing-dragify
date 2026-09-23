/**
 * ═══════════════════════════════════════════════════════════
 * SECTION: HERO — Robot icon → workflow flow
 * ═══════════════════════════════════════════════════════════
 * Start: clean particle robot icon (no portal / orbit rings).
 * Scroll: morph into Dragify node cards → chain → full support flow.
 * Parked particles wait in a soft cloud (not stacked on the agent face).
 * Full-viewport terrain lives in EnvironmentTerrain.
 */

import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';
import { getAgentRefSilhouette, pushAgentArt } from './agentIconArt';

export const CONFIG = {
  id: 'hero' as const,
  /** Fits right ~45% with text at 55% — denser volumetric orb */
  scale: 1.72,
  depth: 0.18,
  jitter: 0.001,
};

export type HeroWorkflowStage = 'hero' | 'heroNode' | 'heroChain' | 'heroFlow';

type Pt = [number, number, number];
type XY = [number, number];
type IconKind =
  | 'agent'
  | 'support'
  | 'routing'
  | 'analysis'
  | 'summary'
  | 'database'
  | 'email'
  | 'notify';

const NODE = { w: 0.95, h: 0.56, r: 0.13, badge: 0.34 };
/** Must fit inside NODE.badge with padding — was 0.58 (overflow + bloom hotspot) */
const ICON_IN_BADGE = 0.26;

/**
 * Layout matching the reference flowchart (Y+ up).
 * Top support → agent → right tools / down routing → bottom outputs.
 */
const POS = {
  support: { x: -0.35, y: 1.28 },
  agent: { x: -0.35, y: 0.38 },
  routing: { x: -0.35, y: -0.48 },
  analysis: { x: 1.25, y: 0.72 },
  summary: { x: 1.25, y: -0.05 },
  database: { x: -1.7, y: -1.4 },
  email: { x: -0.35, y: -1.4 },
  notify: { x: 1.05, y: -1.4 },
};

function empty(count: number, id: string): ParticleTarget {
  return { positions: new Float32Array(count * 3), count, id };
}

function packStable(slots: Pt[], count: number, id: string): ParticleTarget {
  const out = empty(count, id);
  const n = Math.max(1, slots.length);
  const span = 3.2;
  const scale = CONFIG.scale;
  for (let i = 0; i < count; i++) {
    const src = slots[Math.min(i, n - 1)];
    out.positions[i * 3] = (src[0] / span) * 2 * scale;
    out.positions[i * 3 + 1] = (src[1] / span) * 2 * scale;
    out.positions[i * 3 + 2] = src[2] * CONFIG.depth;
  }
  return out;
}

/** Robot-orb stage uses agent-style world packing (readable face + orbits). */
function packRobot(slots: Pt[], count: number, id: string): ParticleTarget {
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
  // Thin ring + bright travelers along the path (reference orbital energy)
  const nRing = Math.floor(n * 0.78);
  const nTravel = n - nRing;
  for (let i = 0; i < nRing; i++) {
    const a = (i / nRing) * Math.PI * 2;
    const x0 = Math.cos(a) * rx;
    const y0 = Math.sin(a) * ry;
    const y = y0 * Math.cos(tilt);
    const z = y0 * Math.sin(tilt);
    const xr = x0 * cyaw - z * syaw;
    const zr = x0 * syaw + z * cyaw;
    const j = (hash2(salt + i, 5) * 2 - 1) * 0.006;
    out.push([
      cx + xr + j,
      cy + y + j * 0.35,
      zr * 0.72 + (hash2(salt + i, 6) * 2 - 1) * 0.012,
    ]);
  }
  for (let i = 0; i < nTravel; i++) {
    const a = hash2(salt + i, 7) * Math.PI * 2;
    const pulse = 0.92 + hash2(salt + i, 8) * 0.16;
    const x0 = Math.cos(a) * rx * pulse;
    const y0 = Math.sin(a) * ry * pulse;
    const y = y0 * Math.cos(tilt);
    const z = y0 * Math.sin(tilt);
    const xr = x0 * cyaw - z * syaw;
    const zr = x0 * syaw + z * cyaw;
    out.push([
      cx + xr,
      cy + y,
      zr * 0.78 + (hash2(salt + i, 9) * 2 - 1) * 0.02,
    ]);
  }
}

function pushLocalPortal(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  const rings = [0.14, 0.28, 0.46, 0.68, 0.92, 1.18];
  const ringBudget = Math.floor(n * 0.58);
  const coreBudget = Math.floor(n * 0.16);
  const perRing = Math.floor(ringBudget / rings.length);
  let used = 0;
  // Hot glowing core under the robot
  for (let i = 0; i < coreBudget; i++) {
    const a = hash2(salt + i, 9) * Math.PI * 2;
    const rr = Math.sqrt(hash2(salt + i, 10)) * 0.16;
    out.push([
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr * 0.32,
      (hash2(salt + i, 11) * 2 - 1) * 0.02 - 0.02,
    ]);
  }
  rings.forEach((r, ri) => {
    const count = ri === rings.length - 1 ? ringBudget - used : perRing;
    used += count;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + ri * 0.14;
      const rr = r + (hash2(salt + i + ri * 40, 12) * 2 - 1) * 0.01;
      out.push([
        cx + Math.cos(a) * rr,
        cy + Math.sin(a) * rr * 0.26,
        (hash2(salt + i, 13) * 2 - 1) * 0.025 - 0.05,
      ]);
    }
  });
  const swirl = n - (out.length - start);
  for (let i = 0; i < swirl; i++) {
    const u = i / Math.max(1, swirl - 1);
    const a = u * Math.PI * 2 * 2.6;
    const r = 0.06 + u * 1.15;
    out.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r * 0.28,
      (hash2(salt + i, 14) * 2 - 1) * 0.03 - u * 0.06,
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushHalo(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  // Dense near silhouette → sparse atmospheric dust (gradual falloff)
  for (let i = 0; i < n; i++) {
    const u = hash2(salt + i, 20);
    const a = hash2(salt + i, 21) * Math.PI * 2;
    const r = 0.42 + Math.pow(u, 0.55) * 1.85;
    const flatten = 0.72 + u * 0.22;
    out.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r * flatten,
      (hash2(salt + i, 22) * 2 - 1) * (0.08 + u * 0.16),
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushDisk(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = hash2(salt + i, 4) * Math.PI * 2;
    const rr = r * Math.sqrt(hash2(salt + i, 5));
    out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, (hash2(salt + i, 6) * 2 - 1) * 0.02]);
  }
}

function pushRing(out: Pt[], cx: number, cy: number, r: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const j = (hash2(salt + i, 7) * 2 - 1) * 0.006;
    out.push([cx + Math.cos(a) * r + j, cy + Math.sin(a) * r + j, (hash2(salt + i, 8) * 2 - 1) * 0.02]);
  }
}

function pushSeg(out: Pt[], ax: number, ay: number, bx: number, by: number, n: number, salt: number) {
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    out.push([ax + (bx - ax) * t, ay + (by - ay) * t, (hash2(salt + i, 9) * 2 - 1) * 0.015]);
  }
}

function pushThickSeg(
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
  pushSeg(out, ax + px, ay + py, bx + px, by + py, third, salt + 3);
  pushSeg(out, ax - px, ay - py, bx - px, by - py, n - third * 2, salt + 6);
}

function pushDashed(
  out: Pt[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
  n: number,
  salt: number,
  dashes = 6,
) {
  const dx = bx - ax;
  const dy = by - ay;
  for (let i = 0; i < n; i++) {
    const u = i / Math.max(1, n - 1);
    const dash = Math.floor(u * dashes);
    const local = u * dashes - dash;
    const t = local > 0.55 ? (dash + 0.55) / dashes : (dash + local) / dashes;
    out.push([ax + dx * t, ay + dy * t, (hash2(salt + i, 10) * 2 - 1) * 0.015]);
  }
}

function pushThickDashed(
  out: Pt[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
  n: number,
  salt: number,
  dashes = 5,
  width = 0.02,
) {
  const third = Math.max(4, Math.floor(n / 3));
  pushDashed(out, ax, ay, bx, by, third, salt, dashes);
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const ox = (-dy / len) * width;
  const oy = (dx / len) * width;
  pushDashed(out, ax + ox, ay + oy, bx + ox, by + oy, third, salt + 11, dashes);
  pushDashed(out, ax - ox, ay - oy, bx - ox, by - oy, n - third * 2, salt + 22, dashes);
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
    out.push([x, y, (hash2(salt + i, 11) * 2 - 1) * 0.02]);
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
  stroke = 0.016,
) {
  const bands = 3;
  const per = Math.max(8, Math.floor(n / bands));
  for (let b = 0; b < bands; b++) {
    const t = (b / (bands - 1) - 0.5) * 2;
    const grow = stroke * t;
    const count = b === bands - 1 ? n - per * (bands - 1) : per;
    pushRoundRect(out, cx, cy, w + grow * 2, h + grow * 2, Math.max(0.01, r + grow), count, salt + b * 3);
  }
}

function trimTo(out: Pt[], start: number, n: number, fill: Pt) {
  while (out.length - start < n) out.push([...fill]);
  if (out.length - start > n) out.splice(start + n);
}

function pushAgentIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number, sil: XY[] = []) {
  pushAgentArt(out, cx, cy, s, n, salt, sil);
}

function pushAlongAgent(
  out: Pt[],
  cx: number,
  cy: number,
  s: number,
  n: number,
  salt: number,
  sil: XY[] = [],
) {
  pushAgentIcon(out, cx, cy, s, n, salt, sil);
}

/** Headset / customer support */
function pushSupportIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const nBand = Math.floor(n * 0.35);
  const nCups = Math.floor(n * 0.4);
  const nMic = n - nBand - nCups;
  // Headband arc
  for (let i = 0; i < nBand; i++) {
    const t = i / Math.max(1, nBand - 1);
    const a = Math.PI * 0.15 + t * Math.PI * 0.7;
    const r = 0.12 * s;
    out.push([cx + Math.cos(a) * r, cy + 0.02 * s + Math.sin(a) * r, 0]);
  }
  pushDisk(out, cx - 0.11 * s, cy, 0.055 * s, Math.floor(nCups / 2), salt + 10);
  pushDisk(out, cx + 0.11 * s, cy, 0.055 * s, nCups - Math.floor(nCups / 2), salt + 20);
  pushThickSeg(out, cx + 0.08 * s, cy - 0.02 * s, cx + 0.02 * s, cy - 0.12 * s, nMic, salt + 30, 0.012);
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushRoutingIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const q = Math.max(8, Math.floor(n / 5));
  pushDisk(out, cx - 0.1 * s, cy, 0.04 * s, q, salt);
  pushDisk(out, cx + 0.1 * s, cy + 0.09 * s, 0.04 * s, q, salt + 10);
  pushDisk(out, cx + 0.1 * s, cy - 0.09 * s, 0.04 * s, q, salt + 20);
  pushThickSeg(out, cx - 0.06 * s, cy, cx + 0.06 * s, cy + 0.07 * s, q, salt + 30, 0.016);
  pushThickSeg(out, cx - 0.06 * s, cy, cx + 0.06 * s, cy - 0.07 * s, n - q * 4, salt + 40, 0.016);
  trimTo(out, start, n, [cx, cy, 0]);
}

/** Data analysis swirl */
function pushAnalysisIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  for (let i = 0; i < n; i++) {
    const u = i / Math.max(1, n - 1);
    const a = u * Math.PI * 4.2;
    const r = (0.03 + u * 0.12) * s;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, (hash2(salt + i, 12) * 2 - 1) * 0.01]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

/** Document / task summary */
function pushSummaryIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const nFrame = Math.floor(n * 0.4);
  pushFatRoundRect(out, cx, cy, 0.2 * s, 0.26 * s, 0.03 * s, nFrame, salt, 0.01 * s);
  const rows = Math.floor((n - nFrame) / 3);
  pushThickSeg(out, cx - 0.06 * s, cy + 0.06 * s, cx + 0.06 * s, cy + 0.06 * s, rows, salt + 10, 0.01);
  pushThickSeg(out, cx - 0.06 * s, cy, cx + 0.06 * s, cy, rows, salt + 20, 0.01);
  pushThickSeg(out, cx - 0.06 * s, cy - 0.06 * s, cx + 0.04 * s, cy - 0.06 * s, n - nFrame - rows * 2, salt + 30, 0.01);
  trimTo(out, start, n, [cx, cy, 0]);
}

/** Database cylinders */
function pushDatabaseIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const per = Math.floor(n / 4);
  pushRing(out, cx, cy + 0.08 * s, 0.09 * s, per, salt);
  pushRing(out, cx, cy, 0.09 * s, per, salt + 5);
  pushRing(out, cx, cy - 0.08 * s, 0.09 * s, per, salt + 10);
  pushThickSeg(out, cx - 0.09 * s, cy + 0.08 * s, cx - 0.09 * s, cy - 0.08 * s, Math.floor(per / 2), salt + 15, 0.01);
  pushThickSeg(out, cx + 0.09 * s, cy + 0.08 * s, cx + 0.09 * s, cy - 0.08 * s, n - per * 3 - Math.floor(per / 2), salt + 20, 0.01);
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushMailIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const nFrame = Math.floor(n * 0.45);
  pushFatRoundRect(out, cx, cy, 0.26 * s, 0.18 * s, 0.03 * s, nFrame, salt, 0.01 * s);
  pushThickSeg(out, cx - 0.11 * s, cy + 0.055 * s, cx, cy - 0.02 * s, Math.floor((n - nFrame) / 2), salt + 10, 0.014);
  pushThickSeg(out, cx, cy - 0.02 * s, cx + 0.11 * s, cy + 0.055 * s, n - nFrame - Math.floor((n - nFrame) / 2), salt + 20, 0.014);
  trimTo(out, start, n, [cx, cy, 0]);
}

/** Bell / team notification */
function pushNotifyIcon(out: Pt[], cx: number, cy: number, s: number, n: number, salt: number) {
  const start = out.length;
  const nDome = Math.floor(n * 0.55);
  const nBody = Math.floor(n * 0.3);
  const nClapper = n - nDome - nBody;
  for (let i = 0; i < nDome; i++) {
    const t = i / Math.max(1, nDome - 1);
    const a = Math.PI + t * Math.PI;
    const r = 0.1 * s;
    out.push([cx + Math.cos(a) * r, cy + 0.02 * s + Math.sin(a) * r * 0.95, 0]);
  }
  pushThickSeg(out, cx - 0.1 * s, cy + 0.02 * s, cx + 0.1 * s, cy + 0.02 * s, nBody, salt + 10, 0.012);
  pushDisk(out, cx, cy - 0.1 * s, 0.025 * s, nClapper, salt + 20);
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushIcon(
  out: Pt[],
  kind: IconKind,
  cx: number,
  cy: number,
  s: number,
  n: number,
  salt: number,
  sil: XY[] = [],
) {
  switch (kind) {
    case 'agent':
      pushAgentIcon(out, cx, cy, s, n, salt, sil);
      break;
    case 'support':
      pushSupportIcon(out, cx, cy, s, n, salt);
      break;
    case 'routing':
      pushRoutingIcon(out, cx, cy, s, n, salt);
      break;
    case 'analysis':
      pushAnalysisIcon(out, cx, cy, s, n, salt);
      break;
    case 'summary':
      pushSummaryIcon(out, cx, cy, s, n, salt);
      break;
    case 'database':
      pushDatabaseIcon(out, cx, cy, s, n, salt);
      break;
    case 'email':
      pushMailIcon(out, cx, cy, s, n, salt);
      break;
    case 'notify':
      pushNotifyIcon(out, cx, cy, s, n, salt);
      break;
  }
}

function pushLabelLines(out: Pt[], x: number, cy: number, wMax: number, n: number, salt: number) {
  if (n <= 0) return;
  const rows = 3;
  const per = Math.max(4, Math.floor(n / rows));
  for (let r = 0; r < rows; r++) {
    const count = r === rows - 1 ? n - per * (rows - 1) : per;
    const y = cy + 0.08 - r * 0.08;
    const len = wMax * (r === 0 ? 0.9 : r === 1 ? 0.7 : 0.52);
    pushThickSeg(out, x, y, x + len, y, count, salt + r * 7, 0.007);
  }
}

/**
 * Soft holding cloud around a node — used while later workflow parts
 * are still parked. Avoids dumping thousands of particles onto the agent face.
 */
function pushParkCloud(out: Pt[], cx: number, cy: number, n: number, salt: number) {
  const start = out.length;
  for (let i = 0; i < n; i++) {
    const a = hash2(salt + i, 50) * Math.PI * 2;
    const r = 0.55 + Math.pow(hash2(salt + i, 51), 0.65) * 0.95;
    out.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r * 0.72,
      (hash2(salt + i, 52) * 2 - 1) * 0.08,
    ]);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

function pushDragifyNode(
  out: Pt[],
  cx: number,
  cy: number,
  kind: IconKind,
  n: number,
  salt: number,
  opts: { dualOut?: boolean; sil?: XY[] } = {},
) {
  const start = out.length;
  const w = NODE.w;
  const h = NODE.h;
  // Clear frame + readable icon — avoid dense hotspot bloom in the badge
  const nCard = Math.floor(n * 0.32);
  const nBadge = Math.floor(n * 0.1);
  const nIcon = Math.floor(n * 0.22);
  const nDiv = Math.floor(n * 0.05);
  const nLabels = Math.floor(n * 0.16);
  const nPorts = Math.max(0, n - nCard - nBadge - nIcon - nDiv - nLabels);

  pushRoundRect(out, cx, cy, w, h, NODE.r, Math.floor(nCard * 0.6), salt);
  pushRoundRect(out, cx, cy, w * 0.94, h * 0.9, NODE.r * 0.9, nCard - Math.floor(nCard * 0.6), salt + 3);

  // Badge inset with padding so the agent sits centered, not cramped
  const bx = cx - w * 0.5 + NODE.badge * 0.55 + 0.08;
  pushRoundRect(out, bx, cy, NODE.badge * 0.92, NODE.badge * 0.92, 0.075, nBadge, salt + 20);
  // Procedural icon for small badge (silhouette PNG bloom causes the white flare)
  if (kind === 'agent') {
    pushAgentArt(out, bx, cy, ICON_IN_BADGE, nIcon, salt + 40, []);
  } else {
    pushIcon(out, kind, bx, cy, ICON_IN_BADGE, nIcon, salt + 40, opts.sil);
  }

  const dx = bx + NODE.badge * 0.55 + 0.05;
  pushThickSeg(out, dx, cy - h * 0.26, dx, cy + h * 0.26, nDiv, salt + 60, 0.009);
  pushLabelLines(out, dx + 0.05, cy, w * 0.3, nLabels, salt + 70);

  // Small edge ports — keep subtle so they don't read as hot flares
  const portN = Math.max(4, Math.floor(nPorts / (opts.dualOut ? 3 : 2)));
  pushDisk(out, cx - w * 0.5, cy, 0.022, portN, salt + 80);
  if (opts.dualOut) {
    pushDisk(out, cx + w * 0.5, cy + 0.13, 0.02, portN, salt + 90);
    pushDisk(out, cx + w * 0.5, cy - 0.13, 0.02, Math.max(0, nPorts - portN * 2), salt + 100);
  } else {
    pushDisk(out, cx + w * 0.5, cy, 0.022, Math.max(0, nPorts - portN), salt + 90);
  }
  trimTo(out, start, n, [cx, cy, 0]);
}

function linkGap(out: Pt[], ax: number, ay: number, bx: number, by: number, n: number, salt: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const inset = 0.08;
  pushThickDashed(
    out,
    ax + (dx / len) * inset,
    ay + (dy / len) * inset,
    bx - (dx / len) * inset,
    by - (dy / len) * inset,
    n,
    salt,
    4,
    0.02,
  );
}

async function buildStage(count: number, stage: HeroWorkflowStage): Promise<ParticleTarget> {
  const sil = await getAgentRefSilhouette();
  const isHero = stage === 'hero';
  const hasNode = stage !== 'hero';
  const hasChain = stage === 'heroChain' || stage === 'heroFlow';
  const hasFlow = stage === 'heroFlow';

  // Beat 1 — robot icon only (no portal rings under, no orbital rings around)
  if (isHero) {
    const nEscape = Math.floor(count * 0.04);
    const nRobot = count - nEscape;
    const slots: Pt[] = [];
    const robotY = 0.28;

    {
      const start = slots.length;
      for (let i = 0; i < nEscape; i++) {
        const a = hash2(i, 40) * Math.PI * 2;
        const r = 0.48 + Math.pow(hash2(i, 41), 0.7) * 0.55;
        slots.push([
          Math.cos(a) * r,
          robotY + Math.sin(a) * r * 0.72,
          (hash2(i, 42) * 2 - 1) * 0.1,
        ]);
      }
      trimTo(slots, start, nEscape, [0, robotY, 0]);
    }
    {
      const start = slots.length;
      const nArt = Math.floor(nRobot * 0.86);
      const nVol = nRobot - nArt;
      pushAgentArt(slots, 0, robotY, 2.05, nArt, 100, sil);
      pushDisk(slots, 0, robotY + 0.02, 0.34, Math.floor(nVol * 0.55), 120);
      pushDisk(slots, 0, robotY - 0.06, 0.24, nVol - Math.floor(nVol * 0.55), 140);
      trimTo(slots, start, nRobot, [0, robotY, 0]);
    }

    while (slots.length < count) slots.push([0, robotY, 0]);
    if (slots.length > count) slots.length = count;
    return packRobot(slots, count, stage);
  }

  const q = hasFlow
    ? {
        support: Math.floor(count * 0.09),
        agentNode: Math.floor(count * 0.13),
        link1: Math.floor(count * 0.05),
        link2: Math.floor(count * 0.05),
        routing: Math.floor(count * 0.09),
        toolLinks: Math.floor(count * 0.055),
        analysis: Math.floor(count * 0.07),
        summary: Math.floor(count * 0.07),
        fork: Math.floor(count * 0.07),
        branch: Math.floor(count * 0.085),
      }
    : {
        support: Math.floor(count * 0.1),
        agentNode: Math.floor(count * 0.26),
        link1: Math.floor(count * 0.07),
        link2: Math.floor(count * 0.07),
        routing: Math.floor(count * 0.12),
        toolLinks: Math.floor(count * 0.04),
        analysis: Math.floor(count * 0.05),
        summary: Math.floor(count * 0.05),
        fork: Math.floor(count * 0.04),
        branch: Math.floor(count * 0.04),
      };

  const used =
    q.support +
    q.agentNode +
    q.link1 +
    q.link2 +
    q.routing +
    q.toolLinks +
    q.analysis +
    q.summary +
    q.fork +
    q.branch * 3;
  const rest = Math.max(0, count - used);

  const slots: Pt[] = [];
  const park = POS.agent;

  // Customer Support (top)
  {
    const start = slots.length;
    if (hasChain) pushDragifyNode(slots, POS.support.x, POS.support.y, 'support', q.support, 200);
    else pushParkCloud(slots, park.x, park.y, q.support, 200);
    trimTo(slots, start, q.support, [POS.support.x, POS.support.y, 0]);
  }

  // AI Agent — fixed budget (never dump leftover rest into the badge — that caused the white flare)
  {
    const start = slots.length;
    const n = q.agentNode;
    if (hasNode) pushDragifyNode(slots, POS.agent.x, POS.agent.y, 'agent', n, 300, { dualOut: hasFlow });
    else pushParkCloud(slots, park.x, park.y, n, 300);
    trimTo(slots, start, n, [POS.agent.x, POS.agent.y, 0]);
  }

  // Spine links
  {
    const start = slots.length;
    if (hasChain) {
      linkGap(
        slots,
        POS.support.x,
        POS.support.y - NODE.h * 0.5,
        POS.agent.x,
        POS.agent.y + NODE.h * 0.5,
        q.link1,
        400,
      );
    } else pushParkCloud(slots, park.x, park.y, q.link1, 400);
    trimTo(slots, start, q.link1, [POS.agent.x, POS.agent.y, 0]);
  }
  {
    const start = slots.length;
    if (hasChain) {
      linkGap(
        slots,
        POS.agent.x,
        POS.agent.y - NODE.h * 0.5,
        POS.routing.x,
        POS.routing.y + NODE.h * 0.5,
        q.link2,
        450,
      );
    } else pushParkCloud(slots, park.x, park.y, q.link2, 450);
    trimTo(slots, start, q.link2, [POS.routing.x, POS.routing.y, 0]);
  }

  // Smart Routing
  {
    const start = slots.length;
    if (hasChain) pushDragifyNode(slots, POS.routing.x, POS.routing.y, 'routing', q.routing, 500, { dualOut: true });
    else pushParkCloud(slots, park.x, park.y, q.routing, 500);
    trimTo(slots, start, q.routing, [POS.routing.x, POS.routing.y, 0]);
  }

  // Tool links (agent → analysis / summary)
  {
    const start = slots.length;
    if (hasFlow) {
      const half = Math.floor(q.toolLinks / 2);
      linkGap(
        slots,
        POS.agent.x + NODE.w * 0.5,
        POS.agent.y + 0.12,
        POS.analysis.x - NODE.w * 0.5,
        POS.analysis.y,
        half,
        550,
      );
      linkGap(
        slots,
        POS.agent.x + NODE.w * 0.5,
        POS.agent.y - 0.12,
        POS.summary.x - NODE.w * 0.5,
        POS.summary.y,
        q.toolLinks - half,
        560,
      );
    } else pushParkCloud(slots, park.x, park.y, q.toolLinks, 550);
    trimTo(slots, start, q.toolLinks, [POS.analysis.x, POS.analysis.y, 0]);
  }

  {
    const start = slots.length;
    if (hasFlow) pushDragifyNode(slots, POS.analysis.x, POS.analysis.y, 'analysis', q.analysis, 600);
    else pushParkCloud(slots, park.x, park.y, q.analysis, 600);
    trimTo(slots, start, q.analysis, [POS.analysis.x, POS.analysis.y, 0]);
  }
  {
    const start = slots.length;
    if (hasFlow) pushDragifyNode(slots, POS.summary.x, POS.summary.y, 'summary', q.summary, 650);
    else pushParkCloud(slots, park.x, park.y, q.summary, 650);
    trimTo(slots, start, q.summary, [POS.summary.x, POS.summary.y, 0]);
  }

  // Bottom fork
  {
    const start = slots.length;
    if (hasFlow) {
      const y0 = POS.routing.y - NODE.h * 0.5 - 0.04;
      const yBar = POS.email.y + NODE.h * 0.5 + 0.14;
      const dropTop = POS.email.y + NODE.h * 0.5 + 0.03;
      const a = Math.floor(q.fork / 5);
      pushThickDashed(slots, POS.routing.x, y0, POS.routing.x, yBar, a, 700, 4);
      pushThickDashed(slots, POS.database.x, yBar, POS.notify.x, yBar, a, 710, 7);
      pushThickDashed(slots, POS.database.x, yBar, POS.database.x, dropTop, a, 720, 3);
      pushThickDashed(slots, POS.email.x, yBar, POS.email.x, dropTop, a, 730, 3);
      pushThickDashed(slots, POS.notify.x, yBar, POS.notify.x, dropTop, q.fork - a * 4, 740, 3);
    } else pushParkCloud(slots, park.x, park.y, q.fork, 700);
    trimTo(slots, start, q.fork, [POS.routing.x, POS.routing.y, 0]);
  }

  // Bottom outputs
  const branches: Array<{ p: { x: number; y: number }; kind: IconKind }> = [
    { p: POS.database, kind: 'database' },
    { p: POS.email, kind: 'email' },
    { p: POS.notify, kind: 'notify' },
  ];
  // Spread leftover into the park cloud (not into the agent badge)
  const branchExtra = hasFlow ? Math.floor(rest / 3) : 0;
  const branchTail = hasFlow ? rest - branchExtra * 3 : 0;
  const parkRest = hasFlow ? 0 : rest;
  branches.forEach((b, i) => {
    const start = slots.length;
    const n = q.branch + (hasFlow ? branchExtra + (i === branches.length - 1 ? branchTail : 0) : 0);
    if (hasFlow) pushDragifyNode(slots, b.p.x, b.p.y, b.kind, n, 800 + i * 40);
    else pushParkCloud(slots, park.x, park.y, q.branch, 800 + i * 40);
    trimTo(slots, start, hasFlow ? n : q.branch, [b.p.x, b.p.y, 0]);
  });
  if (parkRest > 0) {
    const start = slots.length;
    pushParkCloud(slots, park.x, park.y, parkRest, 900);
    trimTo(slots, start, parkRest, [park.x, park.y, 0]);
  }

  // Floor/terrain lives in EnvironmentTerrain (full viewport) — not in morph target

  while (slots.length < count) slots.push([park.x, park.y, 0]);
  if (slots.length > count) slots.length = count;
  return packStable(slots, count, stage);
}

export async function buildHeroTarget(count: number): Promise<ParticleTarget> {
  return buildStage(count, 'hero');
}
export async function buildHeroNodeTarget(count: number): Promise<ParticleTarget> {
  return buildStage(count, 'heroNode');
}
export async function buildHeroChainTarget(count: number): Promise<ParticleTarget> {
  return buildStage(count, 'heroChain');
}
export async function buildHeroFlowTarget(count: number): Promise<ParticleTarget> {
  return buildStage(count, 'heroFlow');
}

export const HERO_SECTION = CONFIG;
export { buildHeroTarget as buildTarget };
