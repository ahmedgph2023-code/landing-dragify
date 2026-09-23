import {
  NL2_TUNING,
  SCENE_STATES,
  type FormationId,
  type SceneState,
  type Vec3,
} from '../../config/newLanding2Scene';

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export function smoothstep(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export type SampledWorld = {
  stateA: SceneState;
  stateB: SceneState;
  blend: number;
  formationA: FormationId;
  formationB: FormationId;
  cameraPos: Vec3;
  cameraLook: Vec3;
  fov: number;
  hubScale: number;
  lineOpacity: number;
  particleBurst: number;
  bgTint: number;
  activeId: string;
  progress: number;
};

/** Sample the continuous world from global scroll progress 0..1 */
export function sampleWorld(p: number): SampledWorld {
  const progress = clamp01(p);
  const states = SCENE_STATES;

  // Find surrounding states by range midpoints for continuous blend
  let i = 0;
  for (let s = 0; s < states.length; s++) {
    if (progress >= states[s].range[0]) i = s;
  }
  const a = states[i];
  const b = states[Math.min(i + 1, states.length - 1)];

  const aEnd = a.range[1];
  const bStart = b.range[0];
  // Crossfade across the shared boundary zone
  const zoneStart = Math.min(aEnd, bStart) - 0.02;
  const zoneEnd = Math.max(aEnd, bStart) + 0.02;
  let blend = 0;
  if (a !== b) {
    blend = smoothstep((progress - zoneStart) / Math.max(0.001, zoneEnd - zoneStart));
  }

  return {
    stateA: a,
    stateB: b,
    blend,
    formationA: a.formation,
    formationB: b.formation,
    cameraPos: lerp3(a.camera.position, b.camera.position, blend),
    cameraLook: lerp3(a.camera.lookAt, b.camera.lookAt, blend),
    fov: lerp(a.camera.fov, b.camera.fov, blend),
    hubScale: lerp(a.hubScale, b.hubScale, blend),
    lineOpacity: lerp(a.lineOpacity, b.lineOpacity, blend),
    particleBurst: lerp(a.particleBurst, b.particleBurst, blend),
    bgTint: lerp(a.bgTint, b.bgTint, blend),
    activeId: blend < 0.5 ? a.id : b.id,
    progress,
  };
}

export type NodeTarget = { x: number; y: number; z: number; s: number };

/** Formation recipes — continuous morph targets for each node index. */
export function formationTarget(
  formation: FormationId,
  index: number,
  total: number,
  time: number,
  out: NodeTarget,
) {
  const t = index / Math.max(1, total - 1);
  const golden = Math.PI * (3 - Math.sqrt(5));

  switch (formation) {
    case 'core':
    case 'converge':
      out.x = Math.sin(index * 1.7) * 0.08;
      out.y = Math.cos(index * 2.1) * 0.08;
      out.z = Math.sin(index * 0.9) * 0.08;
      out.s = formation === 'converge' ? 0.15 : 0.2;
      break;

    case 'orbit': {
      const a = time * 0.25 + index * ((Math.PI * 2) / total);
      const r = 2.1 + (index % 3) * 0.35;
      out.x = Math.cos(a) * r;
      out.y = Math.sin(a * 0.7) * r * 0.45;
      out.z = Math.sin(a) * r * 0.55;
      out.s = 0.55;
      break;
    }

    case 'fracture': {
      const a = index * golden;
      const r = 1.4 + (index % 5) * 0.55 + Math.sin(time * 0.6 + index) * 0.25;
      out.x = Math.cos(a) * r;
      out.y = Math.sin(a * 1.3) * r * 0.85;
      out.z = Math.sin(a) * r * 0.7;
      out.s = 0.45 + (index % 3) * 0.08;
      break;
    }

    case 'pipeline': {
      // Vertical story: trigger → agent → actions
      out.x = ((index % 2) - 0.5) * 0.55;
      out.y = 2.2 - t * 4.4;
      out.z = (index % 3) * 0.15;
      out.s = 0.62;
      break;
    }

    case 'modules': {
      // Four feature modules in a diamond / cross
      const slots = [
        [0, 1.6, 0],
        [1.7, 0, 0],
        [0, -1.6, 0],
        [-1.7, 0, 0],
      ];
      const slot = slots[index % 4];
      const ring = Math.floor(index / 4);
      out.x = slot[0] * (1 + ring * 0.35);
      out.y = slot[1] * (1 + ring * 0.35);
      out.z = slot[2] + ring * 0.2;
      out.s = index < 4 ? 0.85 : 0.4;
      break;
    }

    case 'satellites': {
      const a = time * 0.35 + index * ((Math.PI * 2) / total);
      const r = 2.4;
      out.x = Math.cos(a) * r;
      out.y = Math.sin(a * 1.1) * 1.1;
      out.z = Math.sin(a) * r * 0.4;
      out.s = 0.7;
      break;
    }

    case 'network': {
      const y = 1 - t * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = golden * index;
      const radius = 2.6;
      out.x = Math.cos(a) * r * radius;
      out.y = y * radius * 0.9;
      out.z = Math.sin(a) * r * radius;
      out.s = 0.72;
      break;
    }

    case 'shield': {
      // Dome / protective hemisphere
      const a = (index / total) * Math.PI * 2;
      const lat = (index % 4) / 4;
      const r = 2.0 + lat * 0.4;
      out.x = Math.cos(a) * r * Math.cos(lat * 1.1);
      out.y = Math.sin(lat * Math.PI * 0.55) * 1.8 - 0.2;
      out.z = Math.sin(a) * r * Math.cos(lat * 1.1);
      out.s = 0.5;
      break;
    }

    case 'orbs': {
      const a = index * golden;
      const r = 1.6 + (index % 4) * 0.5;
      out.x = Math.cos(a + time * 0.15) * r;
      out.y = Math.sin(a * 0.8) * 1.4;
      out.z = Math.sin(a + time * 0.15) * r * 0.6;
      out.s = 0.9;
      break;
    }

    case 'tiers': {
      // Three pricing columns
      const col = index % 3;
      const row = Math.floor(index / 3);
      out.x = (col - 1) * 2.1;
      out.y = 0.9 - row * 0.7;
      out.z = col === 1 ? 0.35 : 0;
      out.s = col === 1 ? 0.95 : 0.7;
      break;
    }

    default:
      out.x = 0;
      out.y = 0;
      out.z = 0;
      out.s = 0.4;
  }

  // Desktop side staging is handled by camera, not node offset
  void NL2_TUNING;
  return out;
}
