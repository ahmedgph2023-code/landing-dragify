/**
 * NL3 — Virtualverse-style continuous particle world.
 * Content = classic home `/` sections.
 *
 * FIRST BEAT (most important): Hero → Partners network
 * occupies a large share of scroll so dissolve/center are unmistakable.
 *
 * Particle visuals for /new-landing-3 now driven by So7ba story:
 * `lib/so7ba-story/registry.ts`
 */

import { SO7BA_STORY } from '../../so7ba-story';

export type Nl3SectionId =
  | 'hero'
  | 'partners'
  | 'features'
  | 'agents'
  | 'integrations'
  | 'stats'
  | 'how'
  | 'faq';

export type VisualSlot = 'right' | 'center' | 'midRight' | 'left';

export type CopySide = 'left' | 'right';

export type Nl3SectionDef = {
  id: Nl3SectionId;
  label: string;
  contentKey: string;
  range: [number, number];
  targetId: Nl3SectionId;
  visualSlot: VisualSlot;
  /** Where the copy column sits — alternates for visual variety */
  copySide: CopySide;
  metaphor: string;
};

/**
 * Hero owns ~50% of the scroll story (0→0.5).
 * Copy / particle sides alternate so the story doesn’t feel one-sided.
 */
export const NL3_SECTIONS: Nl3SectionDef[] = [
  {
    id: 'hero',
    label: 'Hero',
    contentKey: 'hero',
    range: [0.0, 0.5],
    targetId: 'hero',
    visualSlot: 'right',
    copySide: 'left',
    metaphor: 'Robot orb → workflow flow · cards hide 1-by-1 · text 55%',
  },
  {
    id: 'partners',
    label: 'Partners',
    contentKey: 'partners',
    range: [0.5, 0.66],
    targetId: 'partners',
    visualSlot: 'left',
    copySide: 'right',
    metaphor: 'Trust hub from section-2 art · same MainParticles morph · left float',
  },
  {
    id: 'features',
    label: 'Features',
    contentKey: 'features',
    range: [0.66, 0.74],
    targetId: 'features',
    visualSlot: 'right',
    copySide: 'left',
    metaphor: 'Capability hub · agent + 4 nodes · full-viewport terrain',
  },
  {
    id: 'agents',
    label: 'Agents',
    contentKey: 'agents',
    range: [0.74, 0.8],
    targetId: 'agents',
    visualSlot: 'left',
    copySide: 'right',
    metaphor: 'Volumetric cyan robot · halo · 3 orbits · full-viewport terrain',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    contentKey: 'integrations',
    range: [0.8, 0.86],
    targetId: 'integrations',
    visualSlot: 'right',
    copySide: 'left',
    metaphor: 'Ecosystem tree · 5 logo orbs · full-viewport terrain',
  },
  {
    id: 'stats',
    label: 'Statistics',
    contentKey: 'statistics',
    range: [0.86, 0.91],
    targetId: 'stats',
    visualSlot: 'center',
    copySide: 'left',
    metaphor: 'Impact rings · 3 metric orbs · full-viewport terrain',
  },
  {
    id: 'how',
    label: 'How it works',
    contentKey: 'howItWorks',
    range: [0.91, 0.96],
    targetId: 'how',
    visualSlot: 'left',
    copySide: 'right',
    metaphor: 'Person → Agent → Play · plasma bridges · full-viewport terrain',
  },
  {
    id: 'faq',
    label: 'FAQ',
    contentKey: 'faq',
    range: [0.96, 1.0],
    targetId: 'faq',
    visualSlot: 'right',
    copySide: 'left',
    metaphor: 'FAQ ? · orbits + portal · full-viewport terrain',
  },
];

export type MorphTargetId =
  | Nl3SectionId
  | 'heroNode'
  | 'heroChain'
  | 'heroFlow'
  | 'dissolve';

/**
 * Hold ~80% (copy stays through the lower scroll) → exit →
 * dissolve ~10% → reassemble ~10%.
 *
 * Hero is special: progressive workflow build (agent → node → chain → flow)
 * before dissolving into the next section.
 */
export function buildMorphWindowsFromSections(): Array<{
  from: MorphTargetId;
  to: MorphTargetId;
  range: [number, number];
  kind: 'hold' | 'dissolve' | 'reassemble';
}> {
  const windows: Array<{
    from: MorphTargetId;
    to: MorphTargetId;
    range: [number, number];
    kind: 'hold' | 'dissolve' | 'reassemble';
  }> = [];

  for (let i = 0; i < NL3_SECTIONS.length; i++) {
    const cur = NL3_SECTIONS[i];
    const [a, b] = cur.range;
    const span = b - a;

    if (cur.id === 'hero') {
      // Robot hold → progressive workflow build (cards hide in UI during morph)
      const t = (p: number) => a + span * p;
      windows.push({ from: 'hero', to: 'hero', range: [t(0), t(0.1)], kind: 'hold' });
      windows.push({ from: 'hero', to: 'heroNode', range: [t(0.1), t(0.2)], kind: 'reassemble' });
      windows.push({ from: 'heroNode', to: 'heroNode', range: [t(0.2), t(0.28)], kind: 'hold' });
      windows.push({ from: 'heroNode', to: 'heroChain', range: [t(0.28), t(0.42)], kind: 'reassemble' });
      windows.push({ from: 'heroChain', to: 'heroChain', range: [t(0.42), t(0.5)], kind: 'hold' });
      windows.push({ from: 'heroChain', to: 'heroFlow', range: [t(0.5), t(0.7)], kind: 'reassemble' });
      windows.push({ from: 'heroFlow', to: 'heroFlow', range: [t(0.7), t(0.8)], kind: 'hold' });

      if (i < NL3_SECTIONS.length - 1) {
        const next = NL3_SECTIONS[i + 1];
        // Continuous morph: same particle cloud dissolves → reassembles into partners
        windows.push({ from: 'heroFlow', to: 'dissolve', range: [t(0.78), t(0.88)], kind: 'dissolve' });
        windows.push({
          from: 'dissolve',
          to: next.targetId,
          range: [t(0.88), b],
          kind: 'reassemble',
        });
      }
      continue;
    }

    const holdEnd = a + span * 0.8;
    const dissolveEnd = a + span * 0.9;

    windows.push({ from: cur.targetId, to: cur.targetId, range: [a, holdEnd], kind: 'hold' });

    if (i < NL3_SECTIONS.length - 1) {
      const next = NL3_SECTIONS[i + 1];
      windows.push({
        from: cur.targetId,
        to: 'dissolve',
        range: [holdEnd, dissolveEnd],
        kind: 'dissolve',
      });
      windows.push({
        from: 'dissolve',
        to: next.targetId,
        range: [dissolveEnd, b],
        kind: 'reassemble',
      });
    } else {
      windows.push({
        from: cur.targetId,
        to: cur.targetId,
        range: [holdEnd, b],
        kind: 'hold',
      });
    }
  }
  return windows;
}

export function sectionAtProgress(progress: number): Nl3SectionDef {
  const p = Math.min(1, Math.max(0, progress));
  for (let i = 0; i < NL3_SECTIONS.length; i++) {
    const s = NL3_SECTIONS[i];
    if (p < s.range[1] || i === NL3_SECTIONS.length - 1) return s;
  }
  return NL3_SECTIONS[NL3_SECTIONS.length - 1];
}

export function sectionIndexAtProgress(progress: number): number {
  return NL3_SECTIONS.findIndex((x) => x.id === sectionAtProgress(progress).id);
}

/**
 * Text sync — single enter + single exit (no flash / re-appear).
 * Enter at section start · exit before morph · next section enters cleanly.
 */
/**
 * Text sync — single enter + single exit (no flash / re-appear).
 * Enter at section start · exit before morph · next section enters cleanly.
 * Ranges prefer So7ba story registry when the section id exists there.
 */
export function sampleSectionTextStages(progress: number, sectionId: string) {
  const so7baSec = SO7BA_STORY.sections.find((x) => x.id === sectionId);
  const s = so7baSec || NL3_SECTIONS.find((x) => x.id === sectionId);
  if (!s) return { badge: 0, title: 0, subtitle: 0, cta: 0, overall: 0, formAmount: 0 };

  const [a, b] = s.range;
  const span = b - a;

  if (sectionId === 'hero') {
    return { badge: 1, title: 1, subtitle: 1, cta: 1, overall: 1, formAmount: 1 };
  }

  // Outside section → hidden (no early peek that caused title flash)
  if (progress < a || progress > b) {
    return { badge: 0, title: 0, subtitle: 0, cta: 0, overall: 0, formAmount: 0 };
  }

  const formStart = a;
  // Finish enter early so copy is fully sharp during the long hold
  const badgeEnd = a + span * 0.1;
  const titleEnd = a + span * 0.22;
  const subEnd = a + span * 0.34;
  const ctaEnd = a + span * 0.48;
  // Stay readable through hold (~0–0.36) — fade while dissolve starts
  const exitStart = a + span * 0.34;
  const exitEnd = a + span * 0.55;

  const stage = (start: number, end: number) => {
    if (progress < start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / Math.max(0.0001, end - start);
  };

  let badge = stage(formStart, badgeEnd);
  let title = stage(badgeEnd, titleEnd);
  let subtitle = stage(titleEnd, subEnd);
  let cta = stage(subEnd, ctaEnd);
  let overall = Math.min(1, badge * 0.25 + title * 0.4 + subtitle * 0.2 + cta * 0.15);

  if (progress >= exitStart) {
    const out = 1 - smoothExit(progress, exitStart, exitEnd);
    badge *= out;
    title *= out;
    subtitle *= out;
    cta *= out;
    overall *= out;
  }

  return { badge, title, subtitle, cta, overall, formAmount: overall };
}

function smoothExit(p: number, start: number, end: number) {
  if (p <= start) return 0;
  if (p >= end) return 1;
  const t = (p - start) / Math.max(0.0001, end - start);
  return t * t * (3 - 2 * t);
}

export function plainHomeTitle(raw: string, displayedText = 'Acts'): string {
  return String(raw || '')
    .replace(/\{displayedText\}/g, displayedText)
    .replace(/<\/?highlight>/gi, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}
