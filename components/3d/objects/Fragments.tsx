import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENE_TUNING, type Formation } from '../../../config/landingScene';
import { mulberry32, sampleStage } from '../../../lib/animations/math';
import { WORKFLOW_NODES, type WorkflowNodeDef } from '../workflowNodes';
import type { SceneProps } from '../types';

const COLOR_ELECTRIC = new THREE.Color(SCENE_TUNING.colors.electric);

type FragmentSeed = {
  id: string;
  scatter: THREE.Vector3;
  network: THREE.Vector3;
  pipeline: THREE.Vector3;
  stack: THREE.Vector3;
  orbitR: number;
  orbitSpeed: number;
  drift: number;
  scale: number;
};

type CornerRadii = number | { tl: number; tr: number; br: number; bl: number };

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: CornerRadii,
) {
  const r =
    typeof radius === 'number'
      ? { tl: radius, tr: radius, br: radius, bl: radius }
      : radius;
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}

function drawNodeIcon(
  ctx: CanvasRenderingContext2D,
  path: string,
  cx: number,
  cy: number,
  size: number,
) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 24, size / 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill(new Path2D(path));
  ctx.restore();
}

function makeNodeTexture(def: WorkflowNodeDef): THREE.CanvasTexture {
  const w = 288;
  const h = 168;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const r = 28;
  const pad = 10;
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(29, 20, 70, 0.18)';
  roundRect(ctx, pad + 2, pad + 6, w - pad * 2, h - pad * 2, r);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#e6e2f6';
  ctx.lineWidth = 3;
  roundRect(ctx, pad, pad, w - pad * 2, h - pad * 2, r);
  ctx.fill();
  ctx.stroke();

  const grad = ctx.createLinearGradient(pad, 0, w - pad, 0);
  grad.addColorStop(0, '#3b82f6');
  grad.addColorStop(0.55, '#8b5cf6');
  grad.addColorStop(1, def.color);
  ctx.fillStyle = grad;
  roundRect(ctx, pad, pad, w - pad * 2, 8, { tl: r, tr: r, br: 0, bl: 0 });
  ctx.fill();

  const tileX = pad + 18;
  const tileY = pad + 28;
  const tile = 72;
  ctx.fillStyle = def.color;
  roundRect(ctx, tileX, tileY, tile, tile, 18);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  roundRect(ctx, tileX + 4, tileY + 4, tile - 8, tile * 0.36, 12);
  ctx.fill();
  drawNodeIcon(ctx, def.icon, tileX + tile / 2, tileY + tile / 2 + 2, 34);

  const textX = tileX + tile + 16;
  ctx.fillStyle = '#868fa6';
  ctx.font = '700 16px Outfit, Cairo, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(def.kind.toUpperCase(), textX, pad + 58);

  ctx.fillStyle = '#0b0d16';
  ctx.font = '700 26px Outfit, Cairo, system-ui, sans-serif';
  const label = def.label.length > 14 ? `${def.label.slice(0, 13)}…` : def.label;
  ctx.fillText(label, textX, pad + 96);

  ctx.fillStyle = def.color;
  ctx.beginPath();
  ctx.arc(pad, h / 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w - pad, h / 2, 7, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function formationPoint(
  seed: FragmentSeed,
  formation: Formation,
  origin: THREE.Vector3,
  t: number,
  out: THREE.Vector3,
) {
  switch (formation) {
    case 'scatter':
      out.copy(seed.scatter);
      out.x += Math.sin(t * 0.5 + seed.drift) * 0.45;
      out.y += Math.cos(t * 0.42 + seed.drift * 1.7) * 0.45;
      out.z += Math.sin(t * 0.33 + seed.drift * 0.6) * 0.35;
      break;
    case 'network':
      out.copy(seed.network).add(origin);
      break;
    case 'pipeline':
      out.copy(seed.pipeline).add(origin);
      break;
    case 'stack':
      out.copy(seed.stack).add(origin);
      break;
    case 'orbit': {
      const a = seed.drift + t * seed.orbitSpeed;
      out.set(
        origin.x + Math.cos(a) * seed.orbitR,
        origin.y + Math.sin(a * 0.85) * seed.orbitR * 0.55,
        origin.z + Math.sin(a) * seed.orbitR * 0.35,
      );
      break;
    }
    case 'converge':
    default:
      out.copy(origin);
      break;
  }
  return out;
}

export function Fragments({ scroll, bus, quality, isMobile }: SceneProps) {
  const defs = useMemo(
    () => WORKFLOW_NODES.slice(0, quality.nodeCount),
    [quality.nodeCount],
  );
  const total = defs.length;

  const seeds = useMemo<FragmentSeed[]>(() => {
    const rng = mulberry32(20260808);
    const cols = 4;
    return Array.from({ length: total }, (_, i) => {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const radius = 4.2 + rng() * 3.4;
      const scatter = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.cos(phi) * radius * 0.7,
        Math.sin(phi) * Math.sin(theta) * radius * 0.6,
      );

      const golden = Math.PI * (3 - Math.sqrt(5));
      const y = 1 - (i / Math.max(1, total - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = golden * i;
      const nodeRadius = 2.15;
      const network = new THREE.Vector3(
        Math.cos(a) * r * nodeRadius,
        y * nodeRadius * 0.85,
        Math.sin(a) * r * nodeRadius,
      );

      const pipeline = new THREE.Vector3(
        ((i % 2) - 0.5) * 0.35,
        1.7 - (i / Math.max(1, total - 1)) * 3.4,
        (i % 3) * 0.12,
      );

      const col = i % cols;
      const row = Math.floor(i / cols);
      const stack = new THREE.Vector3(
        (col - (cols - 1) / 2) * 0.95,
        1.15 - row * 0.78,
        row * 0.08,
      );

      return {
        id: defs[i]?.id || String(i),
        scatter,
        network,
        pipeline,
        stack,
        orbitR: 1.55 + rng() * 1.1,
        orbitSpeed: 0.18 + rng() * 0.22,
        drift: rng() * Math.PI * 2,
        scale: 0.52 + rng() * 0.16,
      };
    });
  }, [total, defs]);

  const cards = useMemo(() => {
    if (typeof document === 'undefined') {
      return { meshes: [] as THREE.Mesh[], geometry: null as THREE.PlaneGeometry | null };
    }
    const geometry = new THREE.PlaneGeometry(1.35, 0.84);
    const meshes = defs.map((def) => {
      const texture = makeNodeTexture(def);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      return mesh;
    });
    return { meshes, geometry };
  }, [defs]);

  useEffect(
    () => () => {
      cards.meshes.forEach((m) => {
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.map?.dispose();
        mat.dispose();
      });
      cards.geometry?.dispose();
    },
    [cards],
  );

  const livePositions = useMemo(() => seeds.map((s) => s.scatter.clone()), [seeds]);
  const linesRef = useRef<THREE.LineSegments>(null);
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(total * 2 * 3), 3),
    );
    return geo;
  }, [total]);

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: COLOR_ELECTRIC,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      lineGeometry.dispose();
      lineMaterial.dispose();
    },
    [lineGeometry, lineMaterial],
  );

  const vA = useMemo(() => new THREE.Vector3(), []);
  const vB = useMemo(() => new THREE.Vector3(), []);
  const vTarget = useMemo(() => new THREE.Vector3(), []);
  const stageOrigin = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!SCENE_TUNING.enableSceneAnimation) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const stage = sampleStage(scroll.current.progress);

    const sideAmp = isMobile ? SCENE_TUNING.sideAmpMobile : SCENE_TUNING.sideAmpDesktop;
    stageOrigin.set(stage.side * sideAmp, stage.rise, 0);

    const converge = stage.finale;
    const linePos = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
    const lineArray = linePos.array as Float32Array;
    const hasFocus = stage.focus.size > 0;
    const edgeStrength =
      (stage.formationA === 'scatter' && stage.blend < 0.2 ? 0 : 0.5) *
      (1 - converge * 0.85);

    for (let i = 0; i < total; i++) {
      const seed = seeds[i];
      const live = livePositions[i];
      const mesh = cards.meshes[i];
      if (!mesh) continue;

      formationPoint(seed, stage.formationA, stageOrigin, t, vA);
      formationPoint(seed, stage.formationB, stageOrigin, t, vB);
      vTarget.copy(vA).lerp(vB, stage.blend);
      vTarget.lerp(bus.corePos, converge);
      live.lerp(vTarget, 1 - Math.exp(-5.5 * dt));

      mesh.position.copy(live);
      mesh.lookAt(state.camera.position);
      const arranged =
        stage.formationA !== 'scatter' || stage.formationB !== 'scatter';
      mesh.rotateZ(Math.sin(t * 0.7 + seed.drift) * 0.12 * (arranged ? 0.25 : 1));

      const focused = !hasFocus || stage.focus.has(seed.id);
      const s =
        seed.scale *
        (focused ? 1.08 : 0.78) *
        (1 - converge * 0.85) *
        (1 + Math.sin(t * 0.9 + seed.drift) * 0.03);
      mesh.scale.setScalar(Math.max(0.0001, s));
      (mesh.material as THREE.MeshBasicMaterial).opacity =
        (focused ? 0.98 : 0.38) * (1 - converge * 0.9);

      const o = i * 6;
      lineArray[o] = live.x;
      lineArray[o + 1] = live.y;
      lineArray[o + 2] = live.z;
      lineArray[o + 3] = bus.corePos.x;
      lineArray[o + 4] = bus.corePos.y;
      lineArray[o + 5] = bus.corePos.z;
    }

    linePos.needsUpdate = true;
    lineMaterial.opacity = edgeStrength * (hasFocus ? 0.45 : 0.35);
    if (linesRef.current) linesRef.current.visible = lineMaterial.opacity > 0.02;
  });

  if (!cards.meshes.length) return null;

  return (
    <group>
      {cards.meshes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
      <lineSegments
        ref={linesRef}
        geometry={lineGeometry}
        material={lineMaterial}
        frustumCulled={false}
      />
    </group>
  );
}
