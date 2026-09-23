/**
 * New-Landing-2 — visual storytelling config
 *
 * Existing /landing sections → continuous visual states:
 *
 * 1. Hero          → single automation core (far camera)
 * 2. Partners      → soft orbit rings (ecosystem)
 * 3. Problem/Shift → core fractures into chaos
 * 4. Workflow      → chaos aligns into a vertical pipeline
 * 5. Features      → pipeline splits into 4 capability modules
 * 6. Agents        → modules become orbiting team satellites
 * 7. Integrations  → satellites expand into connected brand network
 * 8. Security      → network tightens into a protective shield
 * 9. Testimonials  → soft proof orbs
 * 10. Pricing      → three geometric tiers
 * 11. CTA          → everything converges to one focused core
 *
 * Edit THIS file to retune camera, formations, icons, colors, scrub.
 */

export type Vec3 = [number, number, number];

export type FormationId =
  | 'core'
  | 'orbit'
  | 'fracture'
  | 'pipeline'
  | 'modules'
  | 'satellites'
  | 'network'
  | 'shield'
  | 'orbs'
  | 'tiers'
  | 'converge';

export type SceneState = {
  id: string;
  /** Maps to landing section purpose */
  section: string;
  /** Global timeline window [start, end] in 0..1 */
  range: [number, number];
  formation: FormationId;
  camera: { position: Vec3; lookAt: Vec3; fov: number };
  /** Caption DOM alignment */
  caption: 'center' | 'left' | 'right' | 'bottom';
  hubScale: number;
  lineOpacity: number;
  particleBurst: number;
  bgTint: number; // 0 = deep navy, 1 = lighter
};

/** Master visual timeline — scroll progress maps through these windows. */
export const SCENE_STATES: SceneState[] = [
  {
    id: 'hero',
    section: 'Hero',
    range: [0.0, 0.08],
    formation: 'core',
    camera: { position: [0, 0.2, 9.5], lookAt: [0, 0, 0], fov: 42 },
    caption: 'center',
    hubScale: 1.15,
    lineOpacity: 0,
    particleBurst: 0,
    bgTint: 0,
  },
  {
    id: 'partners',
    section: 'Partners / Backed',
    range: [0.08, 0.14],
    formation: 'orbit',
    camera: { position: [0.4, 0.6, 8.2], lookAt: [0, 0.1, 0], fov: 44 },
    caption: 'bottom',
    hubScale: 0.95,
    lineOpacity: 0.15,
    particleBurst: 0.05,
    bgTint: 0.05,
  },
  {
    id: 'shift',
    section: 'Problem / The Shift',
    range: [0.14, 0.24],
    formation: 'fracture',
    camera: { position: [-1.2, 0.4, 7.4], lookAt: [0.2, 0, 0], fov: 46 },
    caption: 'left',
    hubScale: 0.7,
    lineOpacity: 0.05,
    particleBurst: 0.2,
    bgTint: 0.1,
  },
  {
    id: 'workflow',
    section: 'Workflow',
    range: [0.24, 0.36],
    formation: 'pipeline',
    camera: { position: [2.2, 0.1, 6.8], lookAt: [-0.4, 0, 0], fov: 48 },
    caption: 'right',
    hubScale: 0.55,
    lineOpacity: 0.55,
    particleBurst: 0.15,
    bgTint: 0.12,
  },
  {
    id: 'features',
    section: 'Platform / Features',
    range: [0.36, 0.46],
    formation: 'modules',
    camera: { position: [-1.8, 0.5, 7.0], lookAt: [0.3, 0, 0], fov: 47 },
    caption: 'left',
    hubScale: 0.5,
    lineOpacity: 0.4,
    particleBurst: 0.1,
    bgTint: 0.15,
  },
  {
    id: 'agents',
    section: 'Agents / Use cases',
    range: [0.46, 0.56],
    formation: 'satellites',
    camera: { position: [0.2, 1.4, 7.6], lookAt: [0, -0.2, 0], fov: 46 },
    caption: 'right',
    hubScale: 0.65,
    lineOpacity: 0.35,
    particleBurst: 0.12,
    bgTint: 0.18,
  },
  {
    id: 'integrations',
    section: 'Integrations',
    range: [0.56, 0.68],
    formation: 'network',
    camera: { position: [0, 0.3, 8.5], lookAt: [0, 0, 0], fov: 45 },
    caption: 'center',
    hubScale: 0.45,
    lineOpacity: 0.7,
    particleBurst: 0.25,
    bgTint: 0.22,
  },
  {
    id: 'security',
    section: 'Security',
    range: [0.68, 0.76],
    formation: 'shield',
    camera: { position: [0, 0, 6.2], lookAt: [0, 0, 0], fov: 44 },
    caption: 'left',
    hubScale: 0.9,
    lineOpacity: 0.5,
    particleBurst: 0.08,
    bgTint: 0.12,
  },
  {
    id: 'voices',
    section: 'Testimonials',
    range: [0.76, 0.84],
    formation: 'orbs',
    camera: { position: [1.2, 0.2, 7.8], lookAt: [-0.2, 0, 0], fov: 46 },
    caption: 'right',
    hubScale: 0.4,
    lineOpacity: 0.2,
    particleBurst: 0.35,
    bgTint: 0.2,
  },
  {
    id: 'pricing',
    section: 'Pricing',
    range: [0.84, 0.92],
    formation: 'tiers',
    camera: { position: [0, -0.2, 8.0], lookAt: [0, 0.2, 0], fov: 45 },
    caption: 'center',
    hubScale: 0.35,
    lineOpacity: 0.25,
    particleBurst: 0.1,
    bgTint: 0.15,
  },
  {
    id: 'cta',
    section: 'CTA',
    range: [0.92, 1.0],
    formation: 'converge',
    camera: { position: [0, 0.1, 5.4], lookAt: [0, 0, 0], fov: 40 },
    caption: 'center',
    hubScale: 1.35,
    lineOpacity: 0,
    particleBurst: 0.55,
    bgTint: 0.08,
  },
];

/**
 * Easy-to-edit icon / integration registry.
 * Change `image` or `svgPath` here — the 3D scene reads from this list.
 */
export type IconDef = {
  id: string;
  label: string;
  color: string;
  /** Prefer existing /public assets when available */
  image?: string;
  /** Fallback 24x24 SVG path if no image */
  svgPath?: string;
};

export const INTEGRATION_ICONS: IconDef[] = [
  {
    id: 'slack',
    label: 'Slack',
    color: '#E01E5A',
    image: '/slack.png',
  },
  {
    id: 'outlook',
    label: 'Outlook',
    color: '#0078D4',
    image: '/outlook.png',
  },
  {
    id: 'drive',
    label: 'Drive',
    color: '#4285F4',
    image: '/onedrive.png',
  },
  {
    id: 'google',
    label: 'Google',
    color: '#EA4335',
    image: '/google.png',
  },
  {
    id: 'amazon',
    label: 'Amazon',
    color: '#FF9900',
    image: '/amazon.png',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    svgPath:
      'M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.99.58 3.84 1.6 5.4L2 22l4.92-1.61a9.86 9.86 0 0 0 5.12 1.41h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.73 13.98c-.24.67-1.4 1.24-1.93 1.32-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.93-4.36-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.14.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.28.37-.23.62-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.32.07.12.07.67-.17 1.34z',
  },
  {
    id: 'shopify',
    label: 'Shopify',
    color: '#95BF47',
    svgPath:
      'M15.337 3.034a.55.55 0 0 0-.345.134l-1.05.314a3.2 3.2 0 0 0-.58-.98C12.8 1.86 12.05 1.5 11.2 1.55c-.2.01-.39.06-.56.14L9.9 3.9l-1.75.4c-.35.08-.55.14-.55.14l.08.42s.38-.1.72-.18l2.95-.7.78-.2c.14.5.34 1.02.62 1.45.22.34.46.58.7.72L9.2 19.3a.2.2 0 0 0 .19.26h2.85a.2.2 0 0 0 .2-.14l3.15-9.55.95-.25-2.8 8.65a.2.2 0 0 0 .19.26h2.9a.2.2 0 0 0 .2-.14l3.35-10.5a.2.2 0 0 0-.1-.24l-1.4-.35v-.2c0-1.65-.9-3.05-2.35-3.7a2.4 2.4 0 0 0-1.15-.35z',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    color: '#EA4335',
    svgPath:
      'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.25L12 13.5 4 8.25V6.5l8 5.25L20 6.5v1.75z',
  },
];

/** Feature modules shown in the "modules" formation (order matters). */
export const FEATURE_NODE_IDS = ['agents', 'orchestration', 'deploy', 'api'] as const;

export const FEATURE_VISUALS = [
  { id: 'agents', label: 'Agents', color: '#3b82f6' },
  { id: 'orchestration', label: 'Orchestration', color: '#8b5cf6' },
  { id: 'deploy', label: 'Deploy', color: '#22d3ee' },
  { id: 'api', label: 'APIs', color: '#f472b6' },
] as const;

export const NL2_TUNING = {
  /** Total scroll length of the pinned experience (viewport heights). */
  scrollVh: 950,
  /** GSAP scrub lag — higher = silkier catch-up */
  scrub: 1.2,
  scrubReduced: true as boolean | number,
  lenisDuration: 1.2,
  lenisEnabled: true,
  colors: {
    electric: '#3b82f6',
    violet: '#8b5cf6',
    cyan: '#22d3ee',
    pink: '#f472b6',
    bgDeep: '#05070f',
    bgMid: '#0b1220',
  },
  quality: {
    desktop: { nodes: 12, particles: 2200, dpr: [1, 1.75] as [number, number], bloom: true },
    tablet: { nodes: 10, particles: 1400, dpr: [1, 1.4] as [number, number], bloom: true },
    mobile: { nodes: 8, particles: 700, dpr: [1, 1.2] as [number, number], bloom: false },
  },
  mobileMax: 820,
  tabletMax: 1100,
  /** Side offset so captions clear the sculpture on desktop */
  captionClearance: 2.4,
};

/**
 * Caption windows — which DOM caption is visible at which progress.
 * Opacity is smoothed inside the page from these ranges.
 */
export function captionVisibility(progress: number, stateId: string): number {
  const state = SCENE_STATES.find((s) => s.id === stateId);
  if (!state) return 0;
  const [a, b] = state.range;
  const mid = (a + b) / 2;
  const half = (b - a) / 2;
  // Peak in the middle 60% of the window, fade at edges
  const edge = half * 0.35;
  if (progress < a || progress > b) return 0;
  if (progress < a + edge) return (progress - a) / edge;
  if (progress > b - edge) return (b - progress) / edge;
  // boost near mid
  const t = 1 - Math.abs(progress - mid) / half;
  return Math.min(1, 0.75 + t * 0.25);
}
