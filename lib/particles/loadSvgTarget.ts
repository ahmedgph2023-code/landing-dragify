/**
 * Shared SVG / image → particle target loader (no section dependency).
 */

import { hash2 } from './noise';
import { buildDissolveTarget } from './sections/morphBridgeAnimation';
import type { ParticleTarget } from './types';

function createEmpty(count: number, id: string): ParticleTarget {
  return { positions: new Float32Array(count * 3), count, id };
}

function normalizeAndJitter(
  pts: Array<[number, number, number]>,
  count: number,
  opts: { scale?: number; depth?: number; jitter?: number; id: string },
): ParticleTarget {
  const scale = opts.scale ?? 1;
  const depth = opts.depth ?? 0.4;
  const jitter = opts.jitter ?? 0.03;
  const out = createEmpty(count, opts.id);

  if (pts.length === 0) {
    for (let i = 0; i < count; i++) {
      const u = hash2(i, 10);
      const v = hash2(i, 11);
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 1.2 + hash2(i, 12) * 0.4;
      out.positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r * scale;
      out.positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * scale;
      out.positions[i * 3 + 2] = Math.cos(phi) * r * scale * 0.4;
    }
    return out;
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const span = Math.max(maxX - minX, maxY - minY) || 1;

  for (let i = 0; i < count; i++) {
    const src = pts[Math.floor(hash2(i, 20) * pts.length) % pts.length];
    const nx = ((src[0] - cx) / span) * 2;
    const ny = -((src[1] - cy) / span) * 2;
    const jz = (hash2(i, 21) * 2 - 1) * depth;
    const jx = (hash2(i, 22) * 2 - 1) * jitter;
    const jy = (hash2(i, 23) * 2 - 1) * jitter;
    out.positions[i * 3] = (nx + jx) * scale;
    out.positions[i * 3 + 1] = (ny + jy) * scale;
    out.positions[i * 3 + 2] = (src[2] ?? 0) * depth + jz * scale * 0.15;
  }
  return out;
}

async function sampleCanvasPixels(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  threshold = 40,
): Promise<Array<[number, number, number]>> {
  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  ctx.clearRect(0, 0, w, h);
  draw(ctx, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const pts: Array<[number, number, number]> = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i4 = (y * w + x) * 4;
      const r = data[i4];
      const g = data[i4 + 1];
      const b = data[i4 + 2];
      const a = data[i4 + 3];
      const lum = (r + g + b) / 3;
      if (a > threshold && lum > threshold) pts.push([x, y, 0]);
    }
  }
  return pts;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/** Sample SVG into local unit points ∈ [-1,1]² (y up). Bright pixels only. */
export async function sampleSvgLocal(src: string): Promise<Array<[number, number]>> {
  try {
    const img = await loadImage(src);
    const pts = await sampleCanvasPixels((ctx, w, h) => {
      const pad = 28;
      ctx.drawImage(img, pad, pad, w - pad * 2, h - pad * 2);
    });
    if (!pts.length) return [];
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
    return pts.map(([x, y]) => [((x - cx) / span) * 2, -((y - cy) / span) * 2]);
  } catch {
    return [];
  }
}

/** Sample bright pixels from an SVG into a point cloud. */
export async function createFromSVG(
  src: string,
  count: number,
  opts: { scale?: number; depth?: number; jitter?: number; id?: string } = {},
): Promise<ParticleTarget> {
  try {
    const img = await loadImage(src);
    const pts = await sampleCanvasPixels((ctx, w, h) => {
      const pad = 24;
      ctx.drawImage(img, pad, pad, w - pad * 2, h - pad * 2);
    });
    return normalizeAndJitter(pts, count, {
      scale: opts.scale ?? 3,
      depth: opts.depth ?? 0.5,
      jitter: opts.jitter ?? 0.03,
      id: opts.id ?? 'svg',
    });
  } catch {
    return buildDissolveTarget(count);
  }
}

/** Sample bright pixels from a PNG / image. */
export async function createFromImage(
  src: string,
  count: number,
  opts: {
    scale?: number;
    depth?: number;
    jitter?: number;
    threshold?: number;
    id?: string;
    /** Fraction of image height to discard from the bottom (exclude baked floors). */
    cropBottom?: number;
  } = {},
): Promise<ParticleTarget> {
  try {
    const img = await loadImage(src);
    const crop = Math.max(0, Math.min(0.45, opts.cropBottom ?? 0));
    const pts = await sampleCanvasPixels((ctx, w, h) => {
      const pad = 16;
      const usableH = (h - pad * 2) * (1 - crop);
      ctx.drawImage(img, pad, pad, w - pad * 2, usableH);
    }, opts.threshold ?? 40);
    return normalizeAndJitter(pts, count, {
      scale: opts.scale ?? 3,
      depth: opts.depth ?? 0.45,
      jitter: opts.jitter ?? 0.03,
      id: opts.id ?? 'image',
    });
  } catch {
    return buildDissolveTarget(count);
  }
}
