/**
 * Particle target utilities + morph builder.
 *
 * ★ أشكال السكاشن لم تعد هنا — عدّلها من:
 *   lib/particles/sections/heroSectionAnimation.ts
 *   lib/particles/sections/shiftSectionAnimation.ts
 *   lib/particles/sections/morphBridgeAnimation.ts
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { hash2 } from './noise';
import { createFromImage, createFromSVG } from './loadSvgTarget';
import { buildAllSectionTargets } from './sections';
import { buildDissolveTarget } from './sections/morphBridgeAnimation';
import { buildHeroTarget } from './sections/heroSectionAnimation';
import { buildShiftTarget } from './sections/shiftSectionAnimation';
import type { ParticleTarget, TargetSource } from './types';

export { createFromSVG, createFromImage } from './loadSvgTarget';
export { buildAllSectionTargets } from './sections';

function createEmpty(count: number, id: string): ParticleTarget {
  return { positions: new Float32Array(count * 3), count, id };
}

/** Resample an existing BufferGeometry into N points. */
export function createFromGeometry(
  geometry: THREE.BufferGeometry,
  count: number,
  opts: { scale?: number; id?: string } = {},
): ParticleTarget {
  const scale = opts.scale ?? 1;
  const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
  const out = createEmpty(count, opts.id ?? 'geometry');
  if (!posAttr || posAttr.count === 0) return out;

  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const cx = box ? (box.min.x + box.max.x) * 0.5 : 0;
  const cy = box ? (box.min.y + box.max.y) * 0.5 : 0;
  const cz = box ? (box.min.z + box.max.z) * 0.5 : 0;
  const size = box ? box.getSize(new THREE.Vector3()) : new THREE.Vector3(1, 1, 1);
  const span = Math.max(size.x, size.y, size.z) || 1;

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(hash2(i, 30) * posAttr.count) % posAttr.count;
    const x = (posAttr.getX(idx) - cx) / span;
    const y = (posAttr.getY(idx) - cy) / span;
    const z = (posAttr.getZ(idx) - cz) / span;
    out.positions[i * 3] = x * 2 * scale;
    out.positions[i * 3 + 1] = y * 2 * scale;
    out.positions[i * 3 + 2] = z * 2 * scale;
  }
  return out;
}

export async function createFromGLB(
  src: string,
  count: number,
  opts: { scale?: number; id?: string } = {},
): Promise<ParticleTarget> {
  const loader = new GLTFLoader();
  try {
    const gltf = await loader.loadAsync(src);
    const positions: number[] = [];
    gltf.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        const attr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
        if (!attr) return;
        mesh.updateWorldMatrix(true, false);
        const v = new THREE.Vector3();
        for (let i = 0; i < attr.count; i++) {
          v.fromBufferAttribute(attr, i).applyMatrix4(mesh.matrixWorld);
          positions.push(v.x, v.y, v.z);
        }
      }
    });
    if (positions.length < 3) {
      return buildDissolveTarget(count);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return createFromGeometry(geo, count, { scale: opts.scale ?? 3, id: opts.id ?? 'glb' });
  } catch {
    return buildDissolveTarget(count);
  }
}

/** @deprecated استخدم buildHeroTarget من sections/heroSectionAnimation */
export async function createAutomationCoreTarget(
  count: number,
  _opts?: { scale?: number; depth?: number; jitter?: number; id?: string },
): Promise<ParticleTarget> {
  return buildHeroTarget(count);
}

/** @deprecated استخدم buildShiftTarget من sections/shiftSectionAnimation */
export async function createNetworkTarget(
  count: number,
  _opts?: {
    nodeCount?: number;
    scale?: number;
    depth?: number;
    jitter?: number;
    particlesPerNode?: number;
    particlesPerEdge?: number;
    id?: string;
  },
): Promise<ParticleTarget> {
  return buildShiftTarget(count);
}

/** @deprecated استخدم buildDissolveTarget من morphBridgeAnimation */
export function createDissolveCloud(
  count: number,
  _opts?: { scale?: number; id?: string; radius?: number },
): ParticleTarget {
  return buildDissolveTarget(count);
}

export async function createParticleTarget(
  source: TargetSource,
  count: number,
  id: string,
): Promise<ParticleTarget> {
  switch (source.kind) {
    case 'core':
      return buildHeroTarget(count);
    case 'svg':
      return createFromSVG(source.src, count, {
        scale: source.scale,
        depth: source.depth,
        jitter: source.jitter,
        id,
      });
    case 'image':
      return createFromImage(source.src, count, {
        scale: source.scale,
        depth: source.depth,
        jitter: source.jitter,
        threshold: source.threshold,
        id,
      });
    case 'geometry':
      return createFromGeometry(
        (() => {
          const g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.BufferAttribute(source.positions, 3));
          return g;
        })(),
        count,
        { scale: source.scale, id },
      );
    case 'network':
      return buildShiftTarget(count);
    case 'points':
      return { positions: source.positions, count: source.positions.length / 3, id };
    default:
      return buildDissolveTarget(count);
  }
}

/** يبني كل targets السكاشن — المصدر الحقيقي: sections/* */
export async function buildMorphTargets(count: number) {
  return buildAllSectionTargets(count);
}
