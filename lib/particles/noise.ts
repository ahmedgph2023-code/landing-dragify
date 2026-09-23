/**
 * Deterministic noise helpers for particle morph offsets.
 * Never use Math.random() per frame — only seeded lookups.
 */

export function hash2(i: number, salt = 0): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function hash3(i: number, salt = 1): number {
  const x = Math.sin(i * 269.5 + salt * 183.3) * 43758.5453;
  return x - Math.floor(x);
}

/** Smoothstep */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Arc-like mid-point offset so particles don't travel in boring straight lines.
 * Offset peaks at t=0.5 and returns to 0 at endpoints.
 */
export function morphArcOffset(
  i: number,
  t: number,
  strength: number,
): [number, number, number] {
  const arc = Math.sin(Math.PI * t);
  const nx = hash2(i, 1) * 2 - 1;
  const ny = hash2(i, 2) * 2 - 1;
  const nz = hash2(i, 3) * 2 - 1;
  const s = strength * arc;
  return [nx * s, ny * s, nz * s * 0.7];
}
