/**
 * So7ba scroll-story types.
 * One ParticleObject · many forms · scroll drives morph.
 */

export type So7baFloatSide = 'left' | 'right' | 'center';

export type So7baCopySide = 'left' | 'right';

export type So7baFormRef = {
  /** Unique within the whole story */
  id: string;
  /**
   * Image file inside the section folder assets/, e.g. "form-a.png"
   * Resolved to: /icons/nl3/particle/{folder}/assets/{file}
   */
  file: string;
};

export type So7baBeatKind = 'hold' | 'morph' | 'dissolve' | 'reassemble';

/**
 * Local beat inside a section (0..1 of that section’s scroll range).
 * `to: '$next'` = next section’s first form (resolved when building timeline).
 * `to: '$dissolve'` = procedural explode cloud (keeps colors).
 */
export type So7baBeat = {
  id: string;
  kind: So7baBeatKind;
  range: [number, number];
  from: string;
  to: string | '$next' | '$dissolve';
};

export type So7baSectionDef = {
  id: string;
  label: string;
  /** Localization / TextStates content key */
  contentKey: string;
  /** Global scroll window 0..1 */
  range: [number, number];
  /**
   * Folder under public/icons/nl3/particle/{folder}
   * Drop So7ba export assets here (assets/form-*.png, optional scroll-morph.json).
   */
  folder: string;
  /** Where the particle cloud floats */
  float: So7baFloatSide;
  /** Where the copy column sits (opposite of float in most cases) */
  copySide: So7baCopySide;
  /** Forms for this section — hero can list 3 progressive shapes */
  forms: So7baFormRef[];
  /** Local choreography 0..1 within section range */
  beats: So7baBeat[];
  /** Optional Studio visual overrides for this section’s hold */
  particle?: Partial<{
    scale: number;
    cameraDistance: number;
    fov: number;
    imageScale: number;
    xOffset: number;
    yOffset: number;
  }>;
  note?: string;
};

export type So7baStoryConfig = {
  version: 1;
  /** Public base that every section folder lives under */
  basePath: string;
  engine: 'so7ba';
  particleDefaults: {
    count: number;
    size: number;
    sizeVariance: number;
    radius: number;
    strength: number;
    swirl: number;
    spring: number;
    damping: number;
    drift: number;
    crispText: boolean;
    rasterSize: number;
    alphaThreshold: number;
    brightness: number;
    contrast: number;
    imageScale: number;
    scale: number;
    fov: number;
    cameraDistance: number;
    cursorEnabled: boolean;
    interactionMode: string;
  };
  dissolve: { scale: number; seed: number };
  sections: So7baSectionDef[];
};

export type ResolvedForm = {
  id: string;
  sectionId: string;
  src: string;
  float: So7baFloatSide;
};

export type GlobalMorphWindow = {
  id: string;
  sectionId: string;
  range: [number, number];
  kind: So7baBeatKind;
  from: string;
  to: string;
  floatFrom: So7baFloatSide;
  floatTo: So7baFloatSide;
};
