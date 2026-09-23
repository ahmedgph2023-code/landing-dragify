/**
 * ═══════════════════════════════════════════════════════════
 * MORPH BRIDGE — scattered cloud (not a shaped starburst)
 * ═══════════════════════════════════════════════════════════
 * Mid-morph: particles look randomly dispersed, then reassemble.
 */

import { hash2 } from '../noise';
import type { ParticleTarget } from '../types';

export const MORPH_BRIDGE = {
  dissolve: {
    id: 'dissolve' as const,
    scale: 2.35,
    radius: 1.35,
  },
  transition: {
    id: 'transition' as const,
    scale: 2.2,
  },
};

function createEmpty(count: number, id: string): ParticleTarget {
  return { positions: new Float32Array(count * 3), count, id };
}

/** Soft random scatter — no spokes / rings / readable silhouette. */
export function buildDissolveTarget(count: number): ParticleTarget {
  const { scale, radius, id } = MORPH_BRIDGE.dissolve;
  const out = createEmpty(count, id);
  for (let i = 0; i < count; i++) {
    // Gaussian-ish via Box-Muller
    const u1 = Math.max(1e-6, hash2(i, 40));
    const u2 = hash2(i, 41);
    const mag = Math.sqrt(-2 * Math.log(u1)) * 0.55;
    const ang = u2 * Math.PI * 2;
    const r = mag * radius * (0.55 + hash2(i, 42) * 0.9);
    const z = (hash2(i, 43) * 2 - 1) * radius * 0.55;
    out.positions[i * 3] = Math.cos(ang) * r * scale;
    out.positions[i * 3 + 1] = Math.sin(ang) * r * 0.92 * scale;
    out.positions[i * 3 + 2] = z * scale;
  }
  return out;
}

/** Loose volumetric mist — still unstructured. */
export function buildTransitionTarget(count: number): ParticleTarget {
  const { scale, id } = MORPH_BRIDGE.transition;
  const out = createEmpty(count, id);
  for (let i = 0; i < count; i++) {
    const u1 = Math.max(1e-6, hash2(i, 50));
    const u2 = hash2(i, 51);
    const mag = Math.sqrt(-2 * Math.log(u1)) * 0.7;
    const ang = u2 * Math.PI * 2;
    const elev = (hash2(i, 52) * 2 - 1) * Math.PI * 0.35;
    const r = (0.4 + mag) * scale * 0.85;
    out.positions[i * 3] = Math.cos(ang) * Math.cos(elev) * r;
    out.positions[i * 3 + 1] = Math.sin(elev) * r * 0.85 + (hash2(i, 53) * 2 - 1) * 0.25;
    out.positions[i * 3 + 2] = Math.sin(ang) * Math.cos(elev) * r * 0.75;
  }
  return out;
}
