/**
 * Landing 3D scene configuration — edit this file to retune the experience.
 *
 * Home page sections map 1:1 to CHAPTERS below.
 * Camera / object / particle knobs live in SCENE_TUNING and QUALITY_*.
 */

export type Formation =
  | 'scatter'
  | 'network'
  | 'pipeline'
  | 'stack'
  | 'orbit'
  | 'converge';

export type Morph = 'chaos' | 'structure' | 'flow' | 'resolve';

export type ChapterId =
  | 'hero'
  | 'partners'
  | 'features'
  | 'agents'
  | 'integrations'
  | 'statistics'
  | 'how'
  | 'faq'
  | 'cta';

export type Chapter = {
  id: ChapterId;
  /** -1 = 3D left (copy right) · 0 = center · 1 = 3D right */
  side: -1 | 0 | 1;
  formation: Formation;
  morph: Morph;
  /** Workflow node ids emphasized for this chapter. */
  focus?: string[];
  /** Vertical lift of the hub (clears bottom copy). */
  rise?: number;
};

/** One chapter per scroll panel, in DOM order (matches home page sections). */
export const CHAPTERS: Chapter[] = [
  { id: 'hero', side: 0, formation: 'scatter', morph: 'chaos' },
  { id: 'partners', side: 0, formation: 'orbit', morph: 'chaos' },
  {
    id: 'features',
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
  { id: 'statistics', side: 0, formation: 'orbit', morph: 'flow', rise: 1.0 },
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

export type Quality = {
  particles: number;
  nodeCount: number;
  coreDetail: number;
  dpr: [number, number];
  bloom: boolean;
  /** Set true to skip the WebGL canvas entirely (e.g. very low-end). */
  disableWebGL?: boolean;
};

export const DESKTOP_QUALITY: Quality = {
  particles: 2800,
  nodeCount: 14,
  coreDetail: 48,
  dpr: [1, 1.75],
  bloom: true,
};

export const TABLET_QUALITY: Quality = {
  particles: 1600,
  nodeCount: 10,
  coreDetail: 32,
  dpr: [1, 1.5],
  bloom: true,
};

export const MOBILE_QUALITY: Quality = {
  particles: 900,
  nodeCount: 8,
  coreDetail: 24,
  dpr: [1, 1.25],
  bloom: false,
};

/** Global scene / camera / scroll feel. */
export const SCENE_TUNING = {
  /** Hub base scale (relative to viewport). */
  coreBaseScale: 0.62,
  /** How far the hub slides left/right for side staging (desktop). */
  sideAmpDesktop: 2.35,
  sideAmpMobile: 0,
  /** Camera defaults. */
  camera: {
    fov: 48,
    near: 0.1,
    far: 60,
    start: [0, 0, 6.4] as [number, number, number],
    /** Base Z; scroll + chapter morphs adjust from here. */
    baseZ: 7.0,
  },
  /** Brand colors (hex). */
  colors: {
    electric: '#3b82f6',
    magenta: '#8b5cf6',
    bgDark: '#0b1220',
    bgClear: '#111827',
  },
  /** GSAP ScrollTrigger scrub lag (higher = smoother / softer). */
  scroll: {
    scrub: 1.35,
    scrubReduced: true as boolean | number,
    /** Typography line enter/exit scrub. */
    typographyScrub: 0.45,
    /** Lenis smoothness (0..1-ish duration feel). */
    lenisDuration: 1.15,
    lenisEnabled: true,
  },
  /** Cross-fade between chapter formations starts after this local progress. */
  chapterBlendStart: 0.62,
  /** Set false to freeze the 3D scene (DOM still scrolls). */
  enableSceneAnimation: true,
  /** Mobile breakpoint (px). */
  mobileMax: 820,
  tabletMax: 1100,
};

/** Feature icon keys — swap strings / components here without hunting through 3D code. */
export const SECTION_ICONS = {
  features: {
    agent: 'agent',
    orchestration: 'orchestration',
    deploy: 'deploy',
    api: 'api',
  },
  /** Workflow node ids used as 3D card icons (see workflowNodes.ts). */
  workflowNodes: [
    'whatsapp',
    'gmail',
    'slack',
    'shopify',
    'aiAgent',
    'openai',
    'routing',
    'filter',
    'sql',
    'sheets',
    'outlook',
    'drive',
    'instagram',
    'webhook',
    'notion',
    'crm',
  ] as const,
};

/**
 * Optional GLB override. When `modelUrl` is set, LandingScene can swap the
 * procedural hub for a loaded model without changing the scroll timeline.
 */
export const ASSET_SLOTS = {
  heroObject: {
    /** Leave null to keep procedural icosahedron hub. */
    modelUrl: null as string | null,
    // Example: modelUrl: '/models/dragify-core.glb',
    scale: 1,
    rotation: [0, 0, 0] as [number, number, number],
  },
};
