/**
 * ═══════════════════════════════════════════════════════════
 * SO7BA SCROLL STORY — single source of truth
 * ═══════════════════════════════════════════════════════════
 *
 * Edit THIS file to add/reorder sections.
 * Drop So7ba exports into:
 *   public/icons/nl3/particle/{folder}/assets/form-*.png
 *
 * Access rule:
 *   form file  →  `${basePath}/{folder}/assets/${file}`
 *
 * One ParticleObject morphs through every form (no second canvas / no box).
 *
 * Timing tip: dissolve + reassemble should own ~60% of each section’s
 * local range so gathering feels long while you scroll.
 */

import type { So7baStoryConfig } from './types';

/** Shared exit: short hold → long explode → long gather into next form */
const EXIT_BEATS = (from: string, prefix: string) =>
  [
    { id: `${prefix}-hold`, kind: 'hold' as const, range: [0.0, 0.36] as [number, number], from, to: from },
    {
      id: `${prefix}-out`,
      kind: 'dissolve' as const,
      range: [0.36, 0.66] as [number, number],
      from,
      to: '$dissolve' as const,
    },
    {
      id: `${prefix}-to-next`,
      kind: 'reassemble' as const,
      range: [0.66, 1.0] as [number, number],
      from: '$dissolve' as const,
      to: '$next' as const,
    },
  ];

export const SO7BA_STORY: So7baStoryConfig = {
  version: 1,
  basePath: '/icons/nl3/particle',
  engine: 'so7ba',

  particleDefaults: {
    count: 90000,
    size: 1.15,
    sizeVariance: 0.02,
    radius: 120,
    strength: 1.15,
    swirl: 0.45,
    spring: 0.85,
    damping: 0.62,
    drift: 0.1,
    crispText: true,
    rasterSize: 1920,
    alphaThreshold: 36,
    brightness: 10,
    contrast: 42,
    imageScale: 1.0,
    scale: 2.65,
    fov: 50,
    cameraDistance: 3.35,
    cursorEnabled: true,
    interactionMode: 'push',
  },

  dissolve: { scale: 1.75, seed: 1 },

  sections: [
    /**
     * HOME / HERO — three progressive forms, then a long dissolve → partners.
     */
    {
      id: 'hero',
      label: 'Hero',
      contentKey: 'hero',
      range: [0.0, 0.46],
      folder: 'hero',
      float: 'right',
      copySide: 'left',
      forms: [
        { id: 'hero.orb', file: 'form-a.png' },
        { id: 'hero.node', file: 'form-b.png' },
        { id: 'hero.flow', file: 'form-c.png' },
      ],
      beats: [
        { id: 'h-hold-a', kind: 'hold', range: [0.0, 0.1], from: 'hero.orb', to: 'hero.orb' },
        { id: 'h-a-b', kind: 'morph', range: [0.1, 0.26], from: 'hero.orb', to: 'hero.node' },
        { id: 'h-hold-b', kind: 'hold', range: [0.26, 0.34], from: 'hero.node', to: 'hero.node' },
        { id: 'h-b-c', kind: 'morph', range: [0.34, 0.5], from: 'hero.node', to: 'hero.flow' },
        { id: 'h-hold-c', kind: 'hold', range: [0.5, 0.6], from: 'hero.flow', to: 'hero.flow' },
        // Long handoff into partners
        { id: 'h-out', kind: 'dissolve', range: [0.6, 0.78], from: 'hero.flow', to: '$dissolve' },
        { id: 'h-to-next', kind: 'reassemble', range: [0.78, 1.0], from: '$dissolve', to: '$next' },
      ],
      note: 'Put 3 Studio exports as form-a/b/c.png in particle/hero/assets/',
    },

    {
      id: 'partners',
      label: 'Partners',
      contentKey: 'partners',
      range: [0.46, 0.62],
      folder: 'section-2',
      float: 'left',
      copySide: 'right',
      forms: [{ id: 'partners.hub', file: 'form-a.png' }],
      beats: EXIT_BEATS('partners.hub', 'p'),
      particle: { scale: 2.35, cameraDistance: 3.55, imageScale: 0.95 },
      note: 'Uses public/icons/nl3/particle/section-2/assets/form-a.png',
    },

    {
      id: 'features',
      label: 'Features',
      contentKey: 'features',
      range: [0.62, 0.72],
      folder: 'features',
      float: 'right',
      copySide: 'left',
      forms: [{ id: 'features.hub', file: 'form-a.png' }],
      beats: EXIT_BEATS('features.hub', 'f'),
    },

    {
      id: 'agents',
      label: 'Agents',
      contentKey: 'agents',
      range: [0.72, 0.8],
      folder: 'agents',
      float: 'left',
      copySide: 'right',
      forms: [{ id: 'agents.bot', file: 'form-a.png' }],
      beats: EXIT_BEATS('agents.bot', 'a'),
    },

    {
      id: 'integrations',
      label: 'Integrations',
      contentKey: 'integrations',
      range: [0.8, 0.87],
      folder: 'integrations',
      float: 'right',
      copySide: 'left',
      forms: [{ id: 'integrations.tree', file: 'form-a.png' }],
      beats: EXIT_BEATS('integrations.tree', 'i'),
    },

    {
      id: 'stats',
      label: 'Statistics',
      contentKey: 'statistics',
      range: [0.87, 0.92],
      folder: 'stats',
      float: 'center',
      copySide: 'left',
      forms: [{ id: 'stats.rings', file: 'form-a.png' }],
      beats: EXIT_BEATS('stats.rings', 's'),
    },

    {
      id: 'how',
      label: 'How it works',
      contentKey: 'howItWorks',
      range: [0.92, 0.96],
      folder: 'how',
      float: 'left',
      copySide: 'right',
      forms: [{ id: 'how.flow', file: 'form-a.png' }],
      beats: EXIT_BEATS('how.flow', 'w'),
    },

    {
      id: 'faq',
      label: 'FAQ',
      contentKey: 'faq',
      range: [0.96, 1.0],
      folder: 'faq',
      float: 'right',
      copySide: 'left',
      forms: [{ id: 'faq.mark', file: 'form-a.png' }],
      beats: [
        { id: 'q-hold', kind: 'hold', range: [0.0, 1.0], from: 'faq.mark', to: 'faq.mark' },
      ],
    },
  ],
};

/** Public URL for a form file inside a section folder. */
export function so7baAssetUrl(folder: string, file: string) {
  const base = SO7BA_STORY.basePath.replace(/\/+$/, '');
  return `${base}/${folder}/assets/${file}`;
}
