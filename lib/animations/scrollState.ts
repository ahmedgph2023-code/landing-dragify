/**
 * Central scroll state bus.
 * DOM ScrollTrigger / Lenis write progress; the WebGL scene reads it each frame.
 */

export type ScrollState = {
  /** Smoothed 0..1 progress across the whole experience. */
  progress: number;
  /** Active chapter index (0-based). */
  chapterIndex: number;
  /** Section id string for UI indicators. */
  sectionId: string;
};

export function createScrollState(): ScrollState {
  return {
    progress: 0,
    chapterIndex: 0,
    sectionId: 'hero',
  };
}

/** Live scene values published by one component and read by others. */
export type SceneBus = {
  /** The core's actual (damped) position, so tethers track it exactly. */
  corePos: { x: number; y: number; z: number; copy: (v: { x: number; y: number; z: number }) => void };
};
