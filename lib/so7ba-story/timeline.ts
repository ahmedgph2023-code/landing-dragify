/**
 * Flatten SO7BA_STORY sections → global morph windows + resolved form list.
 */

import { SO7BA_STORY, so7baAssetUrl } from './registry';
import type {
  GlobalMorphWindow,
  ResolvedForm,
  So7baFloatSide,
  So7baSectionDef,
} from './types';

export function listResolvedForms(): ResolvedForm[] {
  const out: ResolvedForm[] = [];
  for (const section of SO7BA_STORY.sections) {
    for (const form of section.forms) {
      out.push({
        id: form.id,
        sectionId: section.id,
        src: so7baAssetUrl(section.folder, form.file),
        float: section.float,
      });
    }
  }
  return out;
}

function firstFormId(section: So7baSectionDef | undefined): string | null {
  return section?.forms[0]?.id ?? null;
}

function floatOfForm(formId: string, sections: So7baSectionDef[]): So7baFloatSide {
  for (const s of sections) {
    if (s.forms.some((f) => f.id === formId)) return s.float;
  }
  return 'center';
}

/** Map section-local beat ranges into global 0..1 scroll windows. */
export function buildGlobalMorphWindows(): GlobalMorphWindow[] {
  const sections = SO7BA_STORY.sections;
  const windows: GlobalMorphWindow[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const next = sections[i + 1];
    const [a, b] = section.range;
    const span = b - a;
    const nextFirst = firstFormId(next);

    for (const beat of section.beats) {
      const [l0, l1] = beat.range;
      const g0 = a + span * l0;
      const g1 = a + span * l1;
      let to = beat.to;
      if (to === '$next') {
        to = nextFirst || beat.from;
      }
      if (to === '$dissolve') {
        to = '__dissolve__';
      }
      let from = beat.from;
      if (from === '$dissolve') from = '__dissolve__';

      windows.push({
        id: `${section.id}:${beat.id}`,
        sectionId: section.id,
        range: [g0, g1],
        kind: beat.kind,
        from,
        to,
        floatFrom: floatOfForm(from === '__dissolve__' ? beat.from : from, sections),
        floatTo:
          to === '__dissolve__'
            ? floatOfForm(beat.from, sections)
            : floatOfForm(to, sections),
      });
    }
  }

  return windows;
}

export function sectionAtProgress(progress: number): So7baSectionDef {
  const p = Math.min(1, Math.max(0, progress));
  const sections = SO7BA_STORY.sections;
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (p < s.range[1] || i === sections.length - 1) return s;
  }
  return sections[sections.length - 1];
}

export function floatOffsetX(side: So7baFloatSide): number {
  switch (side) {
    case 'left':
      return -0.92;
    case 'right':
      return 0.92;
    default:
      return 0;
  }
}
