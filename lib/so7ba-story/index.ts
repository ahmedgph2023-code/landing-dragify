/**
 * So7ba scroll-story public API.
 *
 * Config:  ./registry.ts   ← edit sections / float / folders here
 * Assets:  public{basePath}/{folder}/assets/form-*.png
 */

export { SO7BA_STORY, so7baAssetUrl } from './registry';
export type {
  So7baStoryConfig,
  So7baSectionDef,
  So7baFormRef,
  So7baBeat,
  So7baFloatSide,
  So7baCopySide,
  ResolvedForm,
  GlobalMorphWindow,
} from './types';
export {
  listResolvedForms,
  buildGlobalMorphWindows,
  sectionAtProgress,
  floatOffsetX,
} from './timeline';
