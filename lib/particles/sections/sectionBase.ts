/**
 * Shared section config + target builder helpers.
 * Each *SectionAnimation.ts owns its ABOUT block + AI prompt + shape.
 */

import { createFromSVG } from '../loadSvgTarget';
import type { ParticleTarget } from '../types';
import { fillDisk, fillRing, fillSegment, normalizePts } from './shapeKit';

export type SectionMode = 'procedural' | 'svg';

export type SectionConfig = {
  id: string;
  mode: SectionMode;
  svg: string;
  scale: number;
  depth: number;
  jitter: number;
};

export async function resolveSectionTarget(
  config: SectionConfig,
  count: number,
  buildProcedural: (count: number) => ParticleTarget,
): Promise<ParticleTarget> {
  if (config.mode === 'svg') {
    return createFromSVG(config.svg, count, {
      scale: config.scale,
      depth: config.depth,
      jitter: config.jitter,
      id: config.id,
    });
  }
  return buildProcedural(count);
}

export { fillDisk, fillRing, fillSegment, normalizePts };
