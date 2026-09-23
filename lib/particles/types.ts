/** Shared particle types for the NL3 morph engine. */

export type Vec3Tuple = [number, number, number];

export type ParticleTarget = {
  /** Flat xyz xyz … length = count * 3 */
  positions: Float32Array;
  count: number;
  id: string;
};

export type TargetSource =
  | {
      kind: 'core';
      scale?: number;
      depth?: number;
      jitter?: number;
    }
  | {
      kind: 'svg';
      src: string;
      scale?: number;
      depth?: number;
      jitter?: number;
    }
  | {
      kind: 'image';
      src: string;
      scale?: number;
      depth?: number;
      jitter?: number;
      threshold?: number;
    }
  | {
      kind: 'geometry';
      /** Prebuilt THREE.BufferGeometry positions or a generator callback result */
      positions: Float32Array;
      scale?: number;
    }
  | {
      kind: 'network';
      nodeCount?: number;
      scale?: number;
      depth?: number;
      jitter?: number;
      particlesPerNode?: number;
      particlesPerEdge?: number;
    }
  | {
      kind: 'points';
      /** Raw precomputed positions (already count*3) */
      positions: Float32Array;
    };

export type ProgressBus = {
  /** Scrubbed scroll 0..1 */
  progress: number;
  /** Load intro assemble 0..1 */
  intro: number;
  /** Normalized pointer −1..1 (x right, y up) */
  mouse: { x: number; y: number };
};
