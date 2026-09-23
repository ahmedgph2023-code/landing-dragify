/**
 * Dragify — "new-landing"
 * Scroll-driven 3D narrative with per-chapter staging:
 *   text on one side · hub + workflow nodes on the other · formations that
 *   match the section (scatter → pipeline → stack → orbit → converge).
 *
 * Nodes are builder-style cards with real brand icons. The scene keeps
 * animating through the finale (no early freeze).
 *
 * Deps: three, @react-three/fiber, @react-three/postprocessing, gsap
 * Tailwind scoped to #nl-root (see tailwind.config.js).
 */

import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocalization } from '../context/LocalizationContext';
import { NLThemeStyle } from '../components/new-landing/theme';
import NLNav from '../components/new-landing/NLNav';
import NLFooter from '../components/new-landing/NLFooter';
import { useContent } from '../components/new-landing/shared';

/* ------------------------------------------------------------------ */
/*  Shared scroll state                                                */
/* ------------------------------------------------------------------ */

type ScrollState = {
  /** Smoothed 0..1 progress across the whole experience. */
  progress: number;
};

/** Live scene values published by one component and read by others. */
type SceneBus = {
  /** The core's actual (damped) position, so tethers track it exactly. */
  corePos: THREE.Vector3;
};

/** Scene tuning that changes between mobile and desktop. */
type Quality = {
  particles: number;
  nodeCount: number;
  coreDetail: number;
  dpr: [number, number];
  bloom: boolean;
};

const DESKTOP_QUALITY: Quality = {
  particles: 3600,
  nodeCount: 16,
  coreDetail: 48,
  dpr: [1, 1.75],
  bloom: true,
};

const MOBILE_QUALITY: Quality = {
  particles: 1100,
  nodeCount: 8,
  coreDetail: 24,
  dpr: [1, 1.25],
  bloom: true,
};

/* ------------------------------------------------------------------ */
/*  Math helpers                                                       */
/* ------------------------------------------------------------------ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Normalised 0..1 progress of a sub-range of the global scroll. */
const range = (p: number, start: number, end: number) =>
  clamp01((p - start) / (end - start));

/** Smoothstep-eased sub-range. */
const eased = (p: number, start: number, end: number) => {
  const t = range(p, start, end);
  return t * t * (3 - 2 * t);
};

/** Frame-rate independent lerp. */
const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

/** Keeps the object around a quarter of the viewport height so copy stays legible. */
const CORE_BASE_SCALE = 0.62;

/** Brand tokens aligned with /landing dark theme (--nl-blue / --nl-violet). */
const COLOR_ELECTRIC = new THREE.Color('#3b82f6');
const COLOR_MAGENTA = new THREE.Color('#8b5cf6');
const BG_DARK = new THREE.Color('#0b1220');
const BG_CLEAR = new THREE.Color('#111827');

/* ------------------------------------------------------------------ */
/*  Chapter staging — text on one side, scene on the other             */
/*  side: -1 = 3D left (copy right) · 0 = center · 1 = 3D right        */
/* ------------------------------------------------------------------ */

type Formation = 'scatter' | 'network' | 'pipeline' | 'stack' | 'orbit' | 'converge';
type Morph = 'chaos' | 'structure' | 'flow' | 'resolve';

type Chapter = {
  id: string;
  side: -1 | 0 | 1;
  formation: Formation;
  morph: Morph;
  /** Nodes emphasized for this chapter's story. */
  focus?: string[];
  /** Vertical lift of the hub (clears bottom copy). */
  rise?: number;
};

/** One chapter per scroll panel, in DOM order. */
const CHAPTERS: Chapter[] = [
  { id: 'hero', side: 0, formation: 'scatter', morph: 'chaos' },
  { id: 'partners', side: 0, formation: 'orbit', morph: 'chaos' },
  { id: 'shift', side: -1, formation: 'scatter', morph: 'chaos', rise: 0.15 },
  {
    id: 'workflow',
    side: -1,
    formation: 'pipeline',
    morph: 'structure',
    focus: ['whatsapp', 'aiAgent', 'routing', 'slack', 'crm'],
    rise: 0.1,
  },
  {
    id: 'platform',
    side: 1,
    formation: 'network',
    morph: 'structure',
    focus: ['aiAgent', 'openai', 'webhook', 'filter'],
  },
  {
    id: 'agents',
    side: -1,
    formation: 'orbit',
    morph: 'structure',
    focus: ['aiAgent', 'openai', 'routing'],
  },
  {
    id: 'integrations',
    side: 1,
    formation: 'stack',
    morph: 'structure',
    focus: ['whatsapp', 'gmail', 'slack', 'shopify', 'outlook', 'drive', 'instagram'],
  },
  { id: 'orchestration', side: 0, formation: 'network', morph: 'flow', rise: 0.85 },
  { id: 'impact', side: 0, formation: 'orbit', morph: 'flow', rise: 1.0 },
  { id: 'security', side: 1, formation: 'network', morph: 'structure', rise: 0.2 },
  {
    id: 'how',
    side: -1,
    formation: 'pipeline',
    morph: 'structure',
    focus: ['webhook', 'aiAgent', 'whatsapp'],
  },
  { id: 'faq', side: 1, formation: 'orbit', morph: 'structure' },
  { id: 'cta', side: 0, formation: 'converge', morph: 'resolve', rise: 0.35 },
];

type StageSample = {
  side: number;
  rise: number;
  formationA: Formation;
  formationB: Formation;
  blend: number;
  morph: Morph;
  focus: Set<string>;
  orchestration: number;
  impact: number;
  finale: number;
};

function sampleStage(p: number): StageSample {
  const n = CHAPTERS.length;
  const x = clamp01(p) * (n - 0.0001);
  const i = Math.floor(x);
  const local = x - i;
  const a = CHAPTERS[i];
  const b = CHAPTERS[Math.min(i + 1, n - 1)];
  // Cross-fade only in the last third of a chapter so mid-section staging holds.
  const blend = local < 0.62 ? 0 : eased(local, 0.62, 1);

  const morphWeight = {
    chaos: 0,
    structure: 0,
    flow: 0,
    resolve: 0,
  };
  morphWeight[a.morph] += 1 - blend;
  morphWeight[b.morph] += blend;
  let morph: Morph = 'chaos';
  let best = -1;
  (Object.keys(morphWeight) as Morph[]).forEach((k) => {
    if (morphWeight[k] > best) {
      best = morphWeight[k];
      morph = k;
    }
  });

  const focusIds = (blend < 0.5 ? a.focus : b.focus) || [];
  return {
    side: a.side * (1 - blend) + b.side * blend,
    rise: (a.rise || 0) * (1 - blend) + (b.rise || 0) * blend,
    formationA: a.formation,
    formationB: b.formation,
    blend,
    morph,
    focus: new Set(focusIds),
    orchestration: eased(p, 0.52, 0.64),
    impact: eased(p, 0.6, 0.72),
    finale: eased(p, 0.9, 1),
  };
}

/* ------------------------------------------------------------------ */
/*  Real workflow nodes (builder palette + brand icons)                */
/* ------------------------------------------------------------------ */

type WorkflowNodeDef = {
  id: string;
  label: string;
  kind: string;
  color: string;
  /** SVG path in 24×24 viewBox — drawn into the icon tile. */
  icon: string;
};

/** Paths aligned with WorkflowBrandIcon / builder chrome. */
const WORKFLOW_NODES: WorkflowNodeDef[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    kind: 'Trigger',
    color: '#25D366',
    icon: 'M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.99.58 3.84 1.6 5.4L2 22l4.92-1.61a9.86 9.86 0 0 0 5.12 1.41h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.73 13.98c-.24.67-1.4 1.24-1.93 1.32-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.93-4.36-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.14.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.28.37-.23.62-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.32.07.12.07.67-.17 1.34z',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    kind: 'Apps',
    color: '#EA4335',
    icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.25L12 13.5 4 8.25V6.5l8 5.25L20 6.5v1.75z',
  },
  {
    id: 'slack',
    label: 'Slack',
    kind: 'Apps',
    color: '#E01E5A',
    icon: 'M9.1 11.4a1.55 1.55 0 1 1-1.55-1.55h1.55v1.55zm.8 0A1.55 1.55 0 1 1 12.45 14.5v4.1a1.55 1.55 0 1 1-3.1 0v-4.1a1.55 1.55 0 0 1 .55-3.1zM11.4 9.1A1.55 1.55 0 1 1 12.95 7.55V9.1H11.4zm0 .8A1.55 1.55 0 1 1 8.3 12.45H4.2a1.55 1.55 0 1 1 0-3.1h4.1a1.55 1.55 0 0 1 3.1.55zm3.5 1.5a1.55 1.55 0 1 1 1.55 1.55H14.9v-1.55zm-.8 0A1.55 1.55 0 1 1 11.55 9.5V5.4a1.55 1.55 0 1 1 3.1 0v4.1a1.55 1.55 0 0 1-.55 3.1zM12.6 14.9a1.55 1.55 0 1 1 1.55 1.55V14.9H12.6zm0-.8A1.55 1.55 0 1 1 15.7 11.55h4.1a1.55 1.55 0 1 1 0 3.1h-4.1a1.55 1.55 0 0 1-3.1-.55z',
  },
  {
    id: 'shopify',
    label: 'Shopify',
    kind: 'Commerce',
    color: '#95BF47',
    icon: 'M15.337 3.034a.55.55 0 0 0-.345.134l-1.05.314a3.2 3.2 0 0 0-.58-.98C12.8 1.86 12.05 1.5 11.2 1.55c-.2.01-.39.06-.56.14L9.9 3.9l-1.75.4c-.35.08-.55.14-.55.14l.08.42s.38-.1.72-.18l2.95-.7.78-.2c.14.5.34 1.02.62 1.45.22.34.46.58.7.72L9.2 19.3a.2.2 0 0 0 .19.26h2.85a.2.2 0 0 0 .2-.14l3.15-9.55.95-.25-2.8 8.65a.2.2 0 0 0 .19.26h2.9a.2.2 0 0 0 .2-.14l3.35-10.5a.2.2 0 0 0-.1-.24l-1.4-.35v-.2c0-1.65-.9-3.05-2.35-3.7a2.4 2.4 0 0 0-1.15-.35zm-.85 1.5.95-.25c.85.45 1.4 1.35 1.4 2.35v.15l-1.65.4c-.2-.7-.55-1.45-1-2 .1-.2.2-.4.3-.65zM11.35 4c.35.02.65.22.9.55.25.35.4.8.5 1.25l-1.75.4c.1-.9.25-1.75.35-2.2z',
  },
  {
    id: 'aiAgent',
    label: 'AI Agent',
    kind: 'Process',
    color: '#06b6d4',
    icon: 'M12 2a1 1 0 0 1 1 1v1.05A7.5 7.5 0 0 1 19.5 11.5V13a1.5 1.5 0 0 1-1.5 1.5h-1v1.75A2.75 2.75 0 0 1 14.25 19H13.5v1.25a.75.75 0 0 1-1.5 0V19h-1v1.25a.75.75 0 0 1-1.5 0V19H9.75A2.75 2.75 0 0 1 7 16.25V14.5H6A1.5 1.5 0 0 1 4.5 13v-1.5A7.5 7.5 0 0 1 11 4.05V3a1 1 0 0 1 1-1zM9.25 11a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm5.5 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5z',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    kind: 'AI',
    color: '#10A37F',
    icon: 'M12 2 8.5 4.5v3L12 10l3.5-2.5v-3L12 2Zm-5.5 6L3 10.5v3L6.5 16l3.5-2.5v-3L6.5 8Zm11 0L14 10.5v3l3.5 2.5L21 13.5v-3L17.5 8ZM8.5 16.5 12 19l3.5-2.5v-3L12 11l-3.5 2.5v3Z',
  },
  {
    id: 'routing',
    label: 'Routing',
    kind: 'Flow',
    color: '#B453E6',
    icon: 'M4 6h6v2H7.4l3.3 3.3-1.4 1.4L6 9.4V12H4V6Zm16 0v6h-2V9.4l-3.3 3.3-1.4-1.4L14.6 8H12V6h8ZM9.3 13.3 6 16.6V14H4v6h6v-2H7.4l3.3-3.3-1.4-1.4Zm5.4 0 1.4 1.4L13.8 18H16v2h-6v-6h2v2.6l3.3-3.3Z',
  },
  {
    id: 'filter',
    label: 'Filter',
    kind: 'Flow',
    color: '#54B8C9',
    icon: 'M3 5h18l-7 8v5l-4 2v-7L3 5Z',
  },
  {
    id: 'sql',
    label: 'SQL',
    kind: 'Data',
    color: '#0a6fa0',
    icon: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6Zm2 0c0 .5 2.4 1.5 6 1.5s6-1 6-1.5S15.6 4.5 12 4.5 6 5.5 6 6Zm0 4.2V12c0 .5 2.4 1.5 6 1.5s6-1 6-1.5v-1.8c-1.5.7-3.7 1.1-6 1.1s-4.5-.4-6-1.1Zm0 5V17c0 .5 2.4 1.5 6 1.5s6-1 6-1.5v-1.8c-1.5.7-3.7 1.1-6 1.1s-4.5-.4-6-1.1Z',
  },
  {
    id: 'sheets',
    label: 'Sheets',
    kind: 'Data',
    color: '#22c55e',
    icon: 'M5 3h10l4 4v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm9 1.5V8h3.5L14 4.5ZM7 11h3v3H7v-3Zm4 0h3v3h-3v-3Zm4 0h3v3h-3v-3ZM7 15h3v3H7v-3Zm4 0h3v3h-3v-3Zm4 0h3v3h-3v-3Z',
  },
  {
    id: 'outlook',
    label: 'Outlook',
    kind: 'Apps',
    color: '#0078D4',
    icon: 'M3 6.5A2.5 2.5 0 0 1 5.5 4H14a2 2 0 0 1 2 2v1.2l5 2.5V18a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 17.5v-11ZM14 7H5.5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H14V7Zm2 3.1V18h3a.5.5 0 0 0 .5-.5v-5.7L16 10.1ZM8.5 9.5A2.5 2.5 0 1 1 8.5 14a2.5 2.5 0 0 1 0-4.5Z',
  },
  {
    id: 'drive',
    label: 'Drive',
    kind: 'Files',
    color: '#4285F4',
    icon: 'M8.5 3h7l5.5 9.5H14L8.5 3Zm-1.2 2L1 14.5h6.7L13 5H7.3Zm.9 11.5L4.5 21h15l3.5-6H15.2l-2.2 3.8-2.2-3.8H8.2Z',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    kind: 'Social',
    color: '#D62976',
    icon: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5ZM17.8 6.2a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z',
  },
  {
    id: 'webhook',
    label: 'Webhook',
    kind: 'I/O',
    color: '#669999',
    icon: 'M10.2 4.5a3.5 3.5 0 0 1 5.9 2.6h2.1a1 1 0 1 1 0 2h-2.15a3.5 3.5 0 0 1-6.7.7l-4.2 2.43a3.5 3.5 0 1 1-.95-1.65l4.15-2.4a3.5 3.5 0 0 1 1.85-3.68Zm1.3 2.1a1.5 1.5 0 1 0 1.3.05 1.5 1.5 0 0 0-1.3-.05ZM5.5 14a1.5 1.5 0 1 0 1.4.75A1.5 1.5 0 0 0 5.5 14Zm9.7 1.2 2.3 1.33a3.5 3.5 0 1 1-.95 1.65l-2.35-1.35a3.5 3.5 0 0 1-5.7-.9h-2.1a1 1 0 1 1 0-2h2.15a3.5 3.5 0 0 1 6.65.27Zm.8 2.3a1.5 1.5 0 1 0 1.1.4 1.5 1.5 0 0 0-1.1-.4Z',
  },
  {
    id: 'notion',
    label: 'Notion',
    kind: 'CRM',
    color: '#5b5b5b',
    icon: 'M5 4h11l3 3v13H8L5 17V4Zm3 2v11h8V8.5L14.5 6H8Zm2 3h5v1.5h-5V9Zm0 3h5v1.5h-5V12Z',
  },
  {
    id: 'crm',
    label: 'CRM Sync',
    kind: 'Action',
    color: '#f59e0b',
    icon: 'M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c-4.2 0-7.5 2.1-7.5 4.7V19a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-1.3c0-2.6-3.3-4.7-7.5-4.7Z',
  },
];

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

/** Builder-style node card: white chrome + colored icon tile + real glyph. */
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

/* ------------------------------------------------------------------ */
/*  GLSL                                                               */
/* ------------------------------------------------------------------ */

/** Ashima / Stefan Gustavson 3D simplex noise. */
const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/**
 * Faceted automation hub: an icosahedron nudged by layered noise so it stays
 * crystalline (not a soft blob) while still morphing with the scroll story.
 */
const CORE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uChaos;
uniform float uStructure;
uniform float uFlow;
uniform float uPulse;

varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

${SIMPLEX_3D}

void main() {
  vec3 p = position;
  vec3 n = normalize(normal);

  // Keep displacement modest so facets still read as an engine / node hub.
  float chaos = snoise(p * 2.2 + vec3(0.0, uTime * 0.35, 0.0)) * uChaos * 0.55;
  float structure = snoise(p * 1.35 + vec3(uTime * 0.12)) * uStructure * 0.42;
  float flow =
      (sin(p.y * 4.2 + uTime * 1.8) * 0.06 +
       snoise(p * 1.5 + vec3(uTime * 0.55)) * 0.16) * uFlow;

  float disp = chaos + structure + flow + uPulse * 0.7;

  vec3 displaced = p + n * disp;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

  vDisp = disp;
  vNormal = normalize(normalMatrix * n);
  vView = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

const CORE_FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
uniform float uGlow;

varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);

  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.4);
  float shade = clamp(dot(n, normalize(vec3(0.4, 0.8, 0.6))) * 0.5 + 0.5, 0.0, 1.0);

  vec3 base = mix(uColorA, uColorB, smoothstep(-0.35, 0.45, vDisp));
  vec3 col = base * (0.22 + shade * 0.5);
  col += fresnel * mix(uColorB, vec3(1.0), 0.22) * uGlow;

  gl_FragColor = vec4(col, uOpacity);
}
`;

/**
 * Particles live entirely on the GPU: the vertex shader blends between three
 * states (packed in the core / orbiting / reconverged) so scrolling costs
 * nothing on the CPU regardless of particle count.
 */
const PARTICLE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uBurst;
uniform float uConverge;
uniform float uSize;
uniform float uPixelRatio;

attribute vec3 aAxis;
attribute vec3 aTarget;
attribute vec3 aOrbit;   // x: radius, y: speed, z: phase
attribute float aRnd;

varying float vRnd;
varying float vFade;

void main() {
  // 1. packed tightly inside the core
  vec3 packed = aAxis * (0.35 + aRnd * 0.35);

  // 2. orbiting on an individually tilted circle
  vec3 axis = normalize(aAxis);
  vec3 helper = abs(axis.y) > 0.95 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 u = normalize(cross(axis, helper));
  vec3 w = normalize(cross(axis, u));
  float angle = aOrbit.z + uTime * aOrbit.y;
  vec3 orbit = (u * cos(angle) + w * sin(angle)) * aOrbit.x;
  orbit += axis * sin(uTime * aOrbit.y * 0.5 + aOrbit.z) * 0.35;

  // 3. reassembled onto the new object
  vec3 pos = mix(packed, orbit, uBurst);
  pos = mix(pos, aTarget, uConverge);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  vRnd = aRnd;
  vFade = uBurst;

  gl_PointSize = uSize * uPixelRatio * (0.55 + aRnd * 0.9) * (18.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const PARTICLE_FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying float vRnd;
varying float vFade;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.05, d);

  vec3 col = mix(uColorA, uColorB, vRnd) * 1.35;
  col += vec3(0.5) * pow(1.0 - d * 2.0, 3.0);

  gl_FragColor = vec4(col, alpha * uOpacity);
}
`;

/* ------------------------------------------------------------------ */
/*  Core object                                                        */
/* ------------------------------------------------------------------ */

type SceneProps = {
  scroll: MutableRefObject<ScrollState>;
  bus: SceneBus;
  quality: Quality;
  isMobile: boolean;
};

function PolymorphicCore({ scroll, bus, isMobile }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Faceted hub (reads as an automation engine / central node, not a soft orb).
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1, isMobile ? 0 : 1),
    [isMobile],
  );

  const ringGeometry = useMemo(() => new THREE.TorusGeometry(1.42, 0.016, 6, 96), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: 0.45 },
      uStructure: { value: 0.0 },
      uFlow: { value: 0.0 },
      uPulse: { value: 0.0 },
      uOpacity: { value: 1.0 },
      uGlow: { value: 0.9 },
      uColorA: { value: COLOR_ELECTRIC.clone() },
      uColorB: { value: COLOR_MAGENTA.clone() },
    }),
    [],
  );

  const shellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: 0.45 },
      uStructure: { value: 0.0 },
      uFlow: { value: 0.0 },
      uPulse: { value: 0.0 },
      uOpacity: { value: 0.12 },
      uGlow: { value: 1.2 },
      uColorA: { value: COLOR_MAGENTA.clone() },
      uColorB: { value: COLOR_ELECTRIC.clone() },
    }),
    [],
  );

  const ringMaterials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({
        color: COLOR_ELECTRIC,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      new THREE.MeshBasicMaterial({
        color: COLOR_MAGENTA,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      new THREE.MeshBasicMaterial({
        color: COLOR_ELECTRIC,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ],
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      ringGeometry.dispose();
      ringMaterials.forEach((m) => m.dispose());
    },
    [geometry, ringGeometry, ringMaterials],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = scroll.current.progress;
    const stage = sampleStage(p);

    const chaosAmt =
      stage.morph === 'chaos' ? 0.55 : stage.morph === 'resolve' ? 0.08 : 0.12;
    const structureAmt =
      stage.morph === 'structure' ? 0.42 : stage.morph === 'resolve' ? 0.22 : 0.1;
    const flowAmt =
      stage.morph === 'flow' ? 0.55 : stage.morph === 'resolve' ? 0.3 : 0.05;

    uniforms.uChaos.value = damp(uniforms.uChaos.value, chaosAmt, 4, dt);
    uniforms.uStructure.value = damp(uniforms.uStructure.value, structureAmt, 4, dt);
    uniforms.uFlow.value = damp(uniforms.uFlow.value, flowAmt, 4, dt);

    const beat = Math.pow(Math.max(0, Math.sin(t * 1.9)), 6) * 0.14;
    uniforms.uPulse.value =
      beat * stage.orchestration + Math.sin(t * 1.2) * 0.02 + stage.finale * 0.04;

    // Hub stays alive through the whole scroll — soft dip only during impact burst.
    const dip = stage.impact * (1 - stage.finale) * 0.45;
    const presence = 1 - dip;
    uniforms.uOpacity.value = damp(uniforms.uOpacity.value, presence, 5, dt);
    uniforms.uGlow.value = damp(
      uniforms.uGlow.value,
      0.85 + stage.orchestration * 0.25 + stage.finale * 0.85,
      3,
      dt,
    );
    uniforms.uTime.value = t;

    shellUniforms.uTime.value = t;
    shellUniforms.uChaos.value = uniforms.uChaos.value * 0.9;
    shellUniforms.uStructure.value = uniforms.uStructure.value;
    shellUniforms.uFlow.value = uniforms.uFlow.value;
    shellUniforms.uPulse.value = uniforms.uPulse.value + 0.06;
    shellUniforms.uOpacity.value = presence * (0.08 + stage.orchestration * 0.08);

    const group = groupRef.current;
    if (!group) return;

    const sideAmp = isMobile ? 0 : 2.35;
    const targetX = stage.side * sideAmp;
    const targetY = stage.rise;

    group.position.x = damp(group.position.x, targetX, 3.2, dt);
    group.position.y = damp(group.position.y, targetY, 3.2, dt);
    bus.corePos.copy(group.position);

    const scale =
      CORE_BASE_SCALE *
      (1 + stage.orchestration * 0.14 + stage.finale * 0.18 - dip * 0.25);
    group.scale.setScalar(damp(group.scale.x, Math.max(0.001, scale), 4, dt));

    group.rotation.y += dt * (0.2 + stage.orchestration * 0.28 + stage.finale * 0.15);
    group.rotation.x = Math.sin(t * 0.25) * 0.14;

    if (shellRef.current) {
      shellRef.current.rotation.y -= dt * 0.35;
    }

    if (ringsRef.current) {
      const ringPresence =
        0.25 + Math.abs(stage.side) * 0.2 + stage.orchestration * 0.45 + stage.finale * 0.3;
      ringsRef.current.visible = ringPresence > 0.05;
      ringsRef.current.children.forEach((child, i) => {
        child.rotation.x += dt * (0.35 + i * 0.12) * (i % 2 === 0 ? 1 : -1);
        child.rotation.y += dt * (0.22 + i * 0.08);
        const mat = ringMaterials[i];
        if (mat) mat.opacity = ringPresence * (0.55 - i * 0.1) * presence;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <shaderMaterial
          vertexShader={CORE_VERTEX}
          fragmentShader={CORE_FRAGMENT}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      <mesh ref={shellRef} geometry={geometry} scale={1.14}>
        <shaderMaterial
          vertexShader={CORE_VERTEX}
          fragmentShader={CORE_FRAGMENT}
          uniforms={shellUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      <group ref={ringsRef}>
        <mesh
          geometry={ringGeometry}
          material={ringMaterials[0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={ringGeometry}
          material={ringMaterials[1]}
          rotation={[Math.PI / 3.2, Math.PI / 4, 0]}
          scale={1.08}
        />
        <mesh
          geometry={ringGeometry}
          material={ringMaterials[2]}
          rotation={[-Math.PI / 3.4, -Math.PI / 5, Math.PI / 6]}
          scale={1.16}
        />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Workflow-node fragments + the network they form                    */
/* ------------------------------------------------------------------ */

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

function Fragments({ scroll, bus, quality, isMobile }: SceneProps) {
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

      // Vertical story chain (trigger → agent → actions)
      const pipeline = new THREE.Vector3(
        ((i % 2) - 0.5) * 0.35,
        1.7 - (i / Math.max(1, total - 1)) * 3.4,
        (i % 3) * 0.12,
      );

      // Integration wall / grid
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

  const livePositions = useMemo(
    () => seeds.map((s) => s.scatter.clone()),
    [seeds],
  );

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
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = scroll.current.progress;
    const stage = sampleStage(p);

    // Stage origin follows the hub so formations sit on the story side.
    const sideAmp = isMobile ? 0 : 2.35;
    stageOrigin.set(stage.side * sideAmp, stage.rise, 0);

    const converge = stage.finale;
    const linePos = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
    const lineArray = linePos.array as Float32Array;
    const hasFocus = stage.focus.size > 0;

    // Keep edges visible whenever nodes are arranged (not pure scatter).
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
      // Finale: every node returns into the hub.
      vTarget.lerp(bus.corePos, converge);

      live.lerp(vTarget, 1 - Math.exp(-5.5 * dt));

      mesh.position.copy(live);
      mesh.lookAt(state.camera.position);
      const arranged =
        stage.formationA !== 'scatter' || stage.formationB !== 'scatter';
      const roll = Math.sin(t * 0.7 + seed.drift) * 0.12 * (arranged ? 0.25 : 1);
      mesh.rotateZ(roll);

      const focused = !hasFocus || stage.focus.has(seed.id);
      const focusScale = focused ? 1.08 : 0.78;
      const focusOpacity = focused ? 0.98 : 0.38;
      const s =
        seed.scale *
        focusScale *
        (1 - converge * 0.85) *
        (1 + Math.sin(t * 0.9 + seed.drift) * 0.03);
      mesh.scale.setScalar(Math.max(0.0001, s));

      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = focusOpacity * (1 - converge * 0.9);

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

/* ------------------------------------------------------------------ */
/*  Data-flow waves (orchestration)                                    */
/* ------------------------------------------------------------------ */

const WAVE_COUNT = 4;

function Waves({ scroll }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: WAVE_COUNT }, (_, i) => ({
        offset: i / WAVE_COUNT,
        tilt: (i % 2 === 0 ? 1 : -1) * (0.25 + i * 0.12),
      })),
    [],
  );

  const geometry = useMemo(() => new THREE.TorusGeometry(1, 0.006, 3, 96), []);
  const materials = useMemo(
    () =>
      rings.map(
        (_, i) =>
          new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? COLOR_ELECTRIC : COLOR_MAGENTA,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
      ),
    [rings],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    },
    [geometry, materials],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.current.progress;
    // Waves peak in orchestration but keep a soft pulse through the close.
    const stage = sampleStage(p);
    const active =
      Math.max(stage.orchestration, stage.impact * 0.45, stage.finale * 0.35) *
      (0.55 + 0.45 * (1 - stage.finale * 0.3));

    const group = groupRef.current;
    if (!group) return;
    group.visible = active > 0.01;
    if (!group.visible) return;

    group.children.forEach((child, i) => {
      const ring = rings[i];
      const cycle = (t * 0.32 + ring.offset) % 1;
      const scale = 1 + cycle * 6.5;
      child.scale.setScalar(scale);
      child.rotation.x = Math.PI / 2 + ring.tilt + Math.sin(t * 0.3 + i) * 0.15;
      child.rotation.z = t * 0.1 * (i % 2 === 0 ? 1 : -1);
      materials[i].opacity = active * Math.pow(1 - cycle, 1.8) * 0.9;
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((_, i) => (
        <mesh key={i} geometry={geometry} material={materials[i]} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Intelligence particles                                             */
/* ------------------------------------------------------------------ */

function Particles({ scroll, quality }: SceneProps) {
  const count = quality.particles;
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const rng = mulberry32(90210);
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const axis = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const orbit = new Float32Array(count * 3);
    const rnd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const u = rng() * 2 - 1;
      const theta = rng() * Math.PI * 2;
      const s = Math.sqrt(Math.max(0, 1 - u * u));
      const ax = s * Math.cos(theta);
      const ay = u;
      const az = s * Math.sin(theta);

      axis[i * 3] = ax;
      axis[i * 3 + 1] = ay;
      axis[i * 3 + 2] = az;

      const tr = 1.05 + rng() * 0.12;
      target[i * 3] = ax * tr;
      target[i * 3 + 1] = ay * tr * 0.92;
      target[i * 3 + 2] = az * tr;

      const band = Math.floor(rng() * 4);
      orbit[i * 3] = 1.9 + band * 0.62 + rng() * 0.24;
      orbit[i * 3 + 1] = (0.16 + rng() * 0.2) * (band % 2 === 0 ? 1 : -1);
      orbit[i * 3 + 2] = rng() * Math.PI * 2;

      rnd[i] = rng();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aAxis', new THREE.BufferAttribute(axis, 3));
    geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    geo.setAttribute('aOrbit', new THREE.BufferAttribute(orbit, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uConverge: { value: 0 },
      uSize: { value: 4.5 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uColorA: { value: COLOR_ELECTRIC.clone() },
      uColorB: { value: COLOR_MAGENTA.clone() },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      quality.dpr[1],
    );
  }, [uniforms, quality.dpr, viewport.dpr]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = scroll.current.progress;

    const stage = sampleStage(p);
    // Burst at impact, stay alive softly, then reconverge at the invite.
    const burst = Math.max(stage.impact, stage.finale * 0.35);
    const converge = stage.finale;
    const visible = Math.max(stage.impact * 0.95, stage.finale * 0.75, eased(p, 0.58, 0.7) * 0.35);

    uniforms.uTime.value = t;
    uniforms.uBurst.value = damp(uniforms.uBurst.value, burst, 5, dt);
    uniforms.uConverge.value = damp(uniforms.uConverge.value, converge, 5, dt);
    uniforms.uOpacity.value = damp(uniforms.uOpacity.value, visible * 0.95, 4, dt);

    if (pointsRef.current) {
      pointsRef.current.visible = uniforms.uOpacity.value > 0.01;
      pointsRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Camera, lighting and atmosphere                                    */
/* ------------------------------------------------------------------ */

function Atmosphere({ scroll, isMobile }: SceneProps) {
  const { camera, scene } = useThree();
  const keyLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const bgColor = useMemo(() => BG_DARK.clone(), []);

  useEffect(() => {
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(bgColor.getHex(), 0.045);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, bgColor]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = scroll.current.progress;

    const stage = sampleStage(p);

    const targetZ =
      7.0 -
      eased(p, 0.08, 0.22) * 0.35 +
      stage.orchestration * 2.0 +
      stage.impact * 1.2 -
      stage.finale * 2.0;
    const targetY = Math.sin(t * 0.12) * 0.14 + stage.rise * 0.45;
    // Camera eases opposite the hub so the stage side stays open for copy.
    const targetX =
      Math.sin(t * 0.09) * 0.18 - stage.side * (isMobile ? 0 : 0.55);

    camera.position.z = damp(camera.position.z, targetZ, 2.2, dt);
    camera.position.y = damp(camera.position.y, targetY, 2.2, dt);
    camera.position.x = damp(camera.position.x, targetX, 2.2, dt);
    camera.lookAt(stage.side * (isMobile ? 0 : 0.6), stage.rise * 0.35, 0);

    const clarity = stage.impact * (1 - stage.finale * 0.45) + stage.finale * 0.2;
    bgColor.copy(BG_DARK).lerp(BG_CLEAR, clarity);
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(bgColor);
      scene.fog.density = 0.05 - clarity * 0.02;
    }

    if (keyLight.current) {
      keyLight.current.intensity = 12 + stage.orchestration * 16 + stage.finale * 26;
      keyLight.current.position.set(Math.sin(t * 0.4) * 3, 2.2, 3.4);
    }
    if (rimLight.current) {
      rimLight.current.intensity = 8 + stage.impact * 14 + stage.finale * 8;
      rimLight.current.position.set(Math.cos(t * 0.3) * -3.5, -1.6, -2.4);
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={keyLight} color={COLOR_ELECTRIC} distance={22} />
      <pointLight ref={rimLight} color={COLOR_MAGENTA} distance={22} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Small deterministic PRNG so the layout is identical every load      */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Scene root                                                         */
/* ------------------------------------------------------------------ */

function Experience(props: SceneProps) {
  return (
    <>
      <Atmosphere {...props} />
      <PolymorphicCore {...props} />
      <Fragments {...props} />
      <Waves {...props} />
      <Particles {...props} />
      {props.quality.bloom ? (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.72}
            luminanceThreshold={0.34}
            luminanceSmoothing={0.7}
            mipmapBlur
            radius={0.6}
          />
          <Vignette offset={0.3} darkness={0.7} eskil={false} />
        </EffectComposer>
      ) : (
        <></>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Overlay copy helpers                                               */
/* ------------------------------------------------------------------ */

/** Soft plate so copy stays readable without burying the 3D scene. */
function TextPanel({
  children,
  align = 'center',
  wide = false,
  strong = false,
}: {
  children: ReactNode;
  /** Logical alignment — respects RTL via start/end. */
  align?: 'center' | 'start' | 'end';
  wide?: boolean;
  /** Extra contrast for the closing CTA (and any stay-visible panel). */
  strong?: boolean;
}) {
  const alignClass =
    align === 'start'
      ? 'text-start me-auto'
      : align === 'end'
        ? 'text-start ms-auto'
        : 'text-center mx-auto';

  return (
    <div className={`relative w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} ${alignClass}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -inset-y-8 md:-inset-x-12 md:-inset-y-12"
        style={{
          background: strong
            ? 'radial-gradient(ellipse 78% 72% at 50% 50%, rgba(7,10,18,0.92) 0%, rgba(7,10,18,0.72) 46%, rgba(7,10,18,0) 76%)'
            : 'radial-gradient(ellipse 72% 68% at 50% 50%, rgba(11,18,32,0.62) 0%, rgba(11,18,32,0.28) 48%, rgba(11,18,32,0) 74%)',
        }}
      />
      <div
        className="relative rounded-[1.75rem] border border-white/[0.12] px-6 py-8 shadow-[0_24px_80px_-28px_rgba(59,130,246,0.35)] backdrop-blur-[10px] md:px-10 md:py-11"
        style={{
          background: strong
            ? 'linear-gradient(155deg, rgba(11,18,32,0.88) 0%, rgba(11,18,32,0.78) 55%, rgba(17,24,39,0.84) 100%)'
            : 'linear-gradient(155deg, rgba(17,24,39,0.55) 0%, rgba(11,18,32,0.38) 55%, rgba(17,24,39,0.42) 100%)',
          boxShadow: strong
            ? '0 0 0 1px rgba(59,130,246,0.22) inset, 0 28px 90px -24px rgba(0,0,0,0.7)'
            : '0 0 0 1px rgba(59,130,246,0.12) inset, 0 24px 80px -28px rgba(139,92,246,0.28)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function GradientWord({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#3b82f6] via-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const NewLanding: NextPage = () => {
  const { c, isRTL, language } = useContent();
  const { t } = useLocalization();
  // Cinematic stage is always dark; brand tokens stay on the /landing dark scale.
  const themeMode = 'dark' as const;

  const scroll = useRef<ScrollState>({ progress: 0 });
  const bus = useMemo<SceneBus>(() => ({ corePos: new THREE.Vector3() }), []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const metricRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const quality = useMemo(
    () => (isMobile ? MOBILE_QUALITY : DESKTOP_QUALITY),
    [isMobile],
  );

  const metrics = useMemo(() => {
    const items = c('stats.items');
    if (!Array.isArray(items)) return [];
    return items.slice(0, 4).map((item: { value: number; suffix: string; label: string }) => ({
      value: Number(item.value) || 0,
      suffix: String(item.suffix || ''),
      label: String(item.label || ''),
      decimals: 0,
    }));
  }, [c, language]);

  const platformBeats = useMemo(() => {
    const items = c('features.items');
    if (!Array.isArray(items)) return [];
    return items.slice(0, 4).map((item: { tag: string; title: string }) => ({
      tag: String(item.tag || ''),
      title: String(item.title || ''),
    }));
  }, [c, language]);

  const teamChips = useMemo(() => {
    const items = c('agents.items');
    if (!Array.isArray(items)) return [];
    return items.map((item: { title: string }) => String(item.title || '')).filter(Boolean);
  }, [c, language]);

  const securityPoints = useMemo(() => {
    const points = c('security.points');
    if (!Array.isArray(points)) return [];
    return points.map((p: { title: string }) => String(p.title || '')).filter(Boolean);
  }, [c, language]);

  /** Homepage "How it works" steps (root i18n — not under landing.*). */
  const howItWorksSteps = useMemo(() => {
    const steps = t('howItWorks.steps');
    if (!Array.isArray(steps)) return [];
    return steps.map(
      (step: { number?: number; title?: string; description?: string }, i: number) => ({
        number: Number(step.number) || i + 1,
        title: String(step.title || ''),
        description: String(step.description || ''),
      }),
    );
  }, [t, language]);

  const faqItems = useMemo(() => {
    const items = c('faq.items');
    if (!Array.isArray(items)) return [];
    return items.slice(0, 4).map((item: { q: string; a: string }) => ({
      q: String(item.q || ''),
      a: String(item.a || ''),
    }));
  }, [c, language]);

  const setMetricRef = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      metricRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      setIsMobile(mq.matches);
      setReducedMotion(rm.matches);
    };
    sync();
    mq.addEventListener('change', sync);
    rm.addEventListener('change', sync);

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true), { timeout: 900 })
      : window.setTimeout(() => setReady(true), 300);

    return () => {
      mq.removeEventListener('change', sync);
      rm.removeEventListener('change', sync);
      if (window.cancelIdleCallback && typeof idle === 'number') {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const proxy = { p: 0 };

      gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? true : 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
        onUpdate: () => {
          scroll.current.progress = proxy.p;
        },
      });

      const panels = gsap.utils.toArray<HTMLElement>('[data-nl-panel]');
      panels.forEach((panel, index) => {
        const lines = panel.querySelectorAll<HTMLElement>('[data-nl-line]');
        if (!lines.length) return;

        // Last chapter (and any data-nl-stay panel) must NOT exit-fade —
        // otherwise the CTA vanishes the moment the footer enters view.
        const stay =
          panel.hasAttribute('data-nl-stay') || index === panels.length - 1;

        // Fast scrub catch-up + no blur: blur made lines "vanish" on quick scrolls.
        const scrub = reducedMotion ? true : 0.45;

        gsap.fromTo(
          lines,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              end: 'top 55%',
              scrub,
              immediateRender: false,
            },
          },
        );

        if (stay) return;

        // Exit only when the panel is nearly gone — keeps copy readable mid-viewport.
        gsap.to(lines, {
          opacity: 0,
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'bottom 28%',
            end: 'bottom top',
            scrub,
            immediateRender: false,
          },
        });
      });

      metrics.forEach((metric, i) => {
        const el = metricRefs.current[i];
        if (!el) return;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: metric.value,
          duration: 1.8,
          delay: i * 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = counter.v.toFixed(metric.decimals);
          },
        });
      });
    }, wrapperRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [reducedMotion, metrics, language]);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <>
      <Head>
        <title>{t('landing.meta.title')}</title>
        <meta name="description" content={t('landing.meta.description')} />
        <meta name="theme-color" content="#0b1220" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <NLThemeStyle />

      <div
        id="nl-root"
        data-nl-theme={themeMode}
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          position: 'relative',
          width: '100%',
          color: 'var(--nl-text)',
          backgroundColor: 'var(--nl-bg)',
          WebkitFontSmoothing: 'antialiased',
          fontFamily: 'var(--nl-font)',
        }}
      >
        {/* ---------- fixed 3D stage ---------- */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {ready ? (
            <Canvas
              dpr={quality.dpr}
              gl={{
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance',
              }}
              camera={{ position: [0, 0, 6.4], fov: 48, near: 0.1, far: 60 }}
            >
              <Suspense fallback={null}>
                <Experience
                  scroll={scroll}
                  bus={bus}
                  quality={quality}
                  isMobile={isMobile}
                />
              </Suspense>
            </Canvas>
          ) : null}
        </div>

        {/* ---------- atmosphere — lighter so the scene stays visible ---------- */}
        <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(11,18,32,0.55)_100%)]" />
        <div className="pointer-events-none fixed inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#0b1220]/90 to-transparent" />
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#0b1220]/80 to-transparent" />

        {/* ---------- chrome tuned for the cinematic stage ---------- */}
        <NLNav variant="cinematic" />

        <div className="fixed inset-x-0 top-0 z-[210] h-px bg-white/5">
          <div
            ref={progressBarRef}
            className="h-px origin-left scale-x-0 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]"
            style={{ transformOrigin: isRTL ? 'right' : 'left' }}
          />
        </div>

        {/* ---------- scroll narrative ---------- */}
        <div ref={wrapperRef} className="relative z-20">
          <section
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 pb-24 pt-32"
          >
            <TextPanel>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                {c('hero.eyebrow')}
              </p>
              <h1
                data-nl-line
                className="text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl"
              >
                {c('hero.titlePre')}{' '}
                <GradientWord>{c('hero.titleGradient')}</GradientWord>
                {c('hero.titlePost')}
              </h1>
              <p
                data-nl-line
                className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-white/65 md:text-lg"
              >
                {c('hero.subtitle')}
              </p>
              <div
                data-nl-line
                className="mt-12 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/35"
              >
                <span>{c('cinematic.scrollHint')}</span>
                <span className="h-12 w-px bg-gradient-to-b from-[#3b82f6]/70 to-transparent" />
              </div>
            </TextPanel>
          </section>

          {/* Partners / backed — from homepage */}
          <section
            data-nl-panel
            className="relative flex min-h-[70vh] items-center justify-center px-6 py-20"
          >
            <TextPanel>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                {c('cinematic.partners.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl"
              >
                {t('partners.title')}
              </h2>
              <p
                data-nl-line
                className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60 md:text-lg"
              >
                {c('marquee.label')}
              </p>
            </TextPanel>
          </section>

          <section
            id="shift"
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-end md:px-12"
          >
            <TextPanel align={isMobile ? 'center' : 'end'}>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                01 — {c('problem.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('problem.title')}
                <br />
                <span className="text-white/45">{c('problem.titleGradient')}</span>
              </h2>
              <p
                data-nl-line
                className="mt-7 max-w-lg text-base leading-relaxed text-white/65 md:text-lg"
              >
                {c('problem.subtitle')}
              </p>
            </TextPanel>
          </section>

          <section
            id="workflow"
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-end md:px-12"
          >
            <TextPanel align={isMobile ? 'center' : 'end'}>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                02 — {c('workflow.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('workflow.title')}
                <br />
                <GradientWord>{c('workflow.titleGradient')}</GradientWord>
              </h2>
              <p
                data-nl-line
                className="mt-7 max-w-md text-base leading-relaxed text-white/65 md:text-lg"
              >
                {c('workflow.subtitle')}
              </p>
              <div
                data-nl-line
                className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-white/45"
              >
                {(Array.isArray(c('workflow.outputs')) ? (c('workflow.outputs') as string[]) : []).map(
                  (label) => (
                    <span key={label}>{label}</span>
                  ),
                )}
              </div>
            </TextPanel>
          </section>

          <section
            id="platform"
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-start md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'start'}>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                03 — {c('features.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('features.title')}
                <br />
                <span className="text-white/45">{c('features.titleGradient')}</span>
              </h2>
              <p
                data-nl-line
                className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
              >
                {c('features.subtitle')}
              </p>
              <div
                data-nl-line
                className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4"
              >
                {platformBeats.map((beat) => (
                  <div key={beat.tag} className="text-start">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#93c5fd]">
                      {beat.tag}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-snug text-white/90 md:text-base">
                      {beat.title}
                    </p>
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          <section
            id="agents"
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-end md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'end'}>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                04 — {c('agents.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('agents.title')}{' '}
                <GradientWord>{c('agents.titleGradient')}</GradientWord>
                {c('agents.titlePost')}
              </h2>
              <p
                data-nl-line
                className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
              >
                {c('agents.subtitle')}
              </p>
              <div
                data-nl-line
                className="mt-10 flex flex-wrap items-center gap-3 md:justify-end"
              >
                {teamChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-[11px] font-medium tracking-[0.04em] text-white/75"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </TextPanel>
          </section>

          <section
            id="integrations"
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-start md:px-12"
          >
            <TextPanel align={isMobile ? 'center' : 'start'}>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                05 — {c('integrations.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('integrations.title')}{' '}
                <GradientWord>{c('integrations.titleGradient')}</GradientWord>
              </h2>
              <p
                data-nl-line
                className="mt-7 max-w-lg text-base leading-relaxed text-white/65 md:text-lg"
              >
                {c('integrations.subtitle')}
              </p>
              <p
                data-nl-line
                className="mt-10 text-5xl font-semibold tracking-tight text-white md:text-6xl"
              >
                <GradientWord>{c('integrations.statNumber')}</GradientWord>
              </p>
              <p
                data-nl-line
                className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/45"
              >
                {c('integrations.statLabel')}
              </p>
            </TextPanel>
          </section>

          <section
            data-nl-panel
            className="relative flex min-h-screen items-end justify-center px-6 pb-[12vh] pt-24"
          >
            <TextPanel>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                06 — {c('cinematic.orchestration.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('cinematic.orchestration.title')}
                <br />
                <span className="text-white/45">{c('cinematic.orchestration.titleMuted')}</span>
              </h2>
              <p
                data-nl-line
                className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-white/65 md:text-lg"
              >
                {c('cinematic.orchestration.subtitle')}
              </p>
            </TextPanel>
          </section>

          <section
            data-nl-panel
            className="relative flex min-h-screen items-end justify-center px-6 pb-[9vh] pt-24"
          >
            <TextPanel wide>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                07 — {c('stats.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('stats.title')}{' '}
                <GradientWord>{c('stats.titleGradient')}</GradientWord>
              </h2>
              <div
                data-nl-line
                className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4"
              >
                {metrics.map((metric, i) => (
                  <div key={metric.label} className="text-center">
                    <div className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                      <span ref={setMetricRef(i)}>0</span>
                      <GradientWord>{metric.suffix}</GradientWord>
                    </div>
                    <p className="mt-3 text-[10px] uppercase leading-relaxed tracking-[0.14em] text-white/45">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          <section
            id="security"
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-start md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'start'}>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                08 — {c('security.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('security.title')}{' '}
                <GradientWord>{c('security.titleGradient')}</GradientWord>
                {c('security.titlePost')}
              </h2>
              <p
                data-nl-line
                className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
              >
                {c('security.subtitle')}
              </p>
              <div
                data-nl-line
                className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {securityPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-start text-sm text-white/75"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          {/* How it works — from homepage */}
          <section
            id="how-it-works"
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-end md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'end'}>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                09 — {c('cinematic.howItWorks.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {t('howItWorks.title')}
              </h2>
              <p
                data-nl-line
                className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 md:text-lg"
              >
                {c('cinematic.howItWorks.subtitle')}
              </p>
              <div
                data-nl-line
                className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
              >
                {howItWorksSteps.map((step) => (
                  <div key={step.number} className="text-start">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#93c5fd]">
                      {String(step.number).padStart(2, '0')}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white md:text-xl">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          {/* FAQ — from homepage / landing */}
          <section
            id="faq"
            data-nl-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-start md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'start'}>
              <p
                data-nl-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                10 — {c('faq.eyebrow')}
              </p>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
              >
                {c('faq.title')}{' '}
                <GradientWord>{c('faq.titleGradient')}</GradientWord>
              </h2>
              <div data-nl-line className="mt-12 space-y-5 text-start">
                {faqItems.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
                  >
                    <p className="text-sm font-semibold text-white md:text-base">
                      {item.q}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          <section
            id="cta"
            data-nl-panel
            data-nl-stay
            className="relative flex min-h-screen items-center justify-center px-6 py-28"
          >
            <TextPanel strong>
              <h2
                data-nl-line
                className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
              >
                {c('cta.title')}{' '}
                <GradientWord>{c('cta.titleGradient')}</GradientWord>
                {c('cta.titlePost')}
              </h2>
              <p
                data-nl-line
                className="mx-auto mt-7 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
              >
                {c('cta.subtitle')}
              </p>
              <div
                data-nl-line
                className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <a
                  href="https://console.dragify.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-9 text-sm font-semibold tracking-wide text-white transition-transform duration-300 hover:scale-[1.04]"
                >
                  <span className="relative z-10">{c('cta.primary')}</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href="/contact"
                  className="inline-flex h-12 items-center rounded-full border border-white/18 px-9 text-sm font-medium tracking-wide text-white/80 transition hover:border-white/45 hover:text-white"
                >
                  {c('cta.secondary')}
                </a>
              </div>
              <p
                data-nl-line
                className="mt-14 text-[10px] uppercase tracking-[0.28em] text-white/40"
              >
                {c('hero.finePrint')}
              </p>
            </TextPanel>
          </section>
        </div>

        <div className="relative z-30 bg-[var(--nl-bg)]">
          <NLFooter />
        </div>
      </div>
    </>
  );
};

export default NewLanding;
