# Immersive Home — Scroll-Driven 3D Animation Guide

This document explains how the home page (`/`) immersive experience works and how to customize it.

Inspiration: continuous scroll → progress → timeline → 3D camera/objects + typography (Virtualverse-style interaction model). Branding and copy remain Dragify’s.

---

## Architecture overview

```
pages/index.tsx
  └── components/immersive-home/ImmersiveHome.tsx   # DOM chapters + wiring
        ├── components/3d/LandingScene.tsx          # Persistent WebGL canvas
        │     ├── objects/Atmosphere.tsx            # Camera + lights + fog
        │     ├── objects/Core.tsx                  # Hub / primary object
        │     ├── objects/Fragments.tsx             # Workflow node cards
        │     ├── objects/Particles.tsx
        │     └── objects/Waves.tsx
        ├── lib/animations/scrollController.ts      # Lenis + GSAP ScrollTrigger
        ├── lib/animations/math.ts                  # sampleStage() timeline
        └── config/landingScene.ts                  # ★ Edit this first
```

**Concept:** one fixed WebGL scene. Scroll progress (0→1) samples `CHAPTERS` and interpolates visual state. DOM panels scrub typography in sync.

---

## 1. Where is the 3D scene?

- Entry: `components/3d/LandingScene.tsx`
- Mounted from: `components/immersive-home/ImmersiveHome.tsx` (fixed full-viewport layer)

## 2. Where is the camera controlled?

- File: `components/3d/objects/Atmosphere.tsx`
- Tunables: `SCENE_TUNING.camera` in `config/landingScene.ts`
  - `baseZ`, `fov`, `start`, `near`, `far`

## 3. Where is scroll animation controlled?

- File: `lib/animations/scrollController.ts`
- Creates Lenis (smooth scroll) + GSAP ScrollTrigger scrub on the story wrapper
- Writes `scroll.current.progress` (0..1)

## 4. Where is GSAP configured?

- Registration + timelines: `lib/animations/scrollController.ts`
- Scrub values: `SCENE_TUNING.scroll.scrub` and `typographyScrub` in `config/landingScene.ts`

## 5. Where is Lenis configured?

- Same file: `lib/animations/scrollController.ts`
- Flags: `SCENE_TUNING.scroll.lenisEnabled`, `lenisDuration`
- Disabled automatically when `prefers-reduced-motion: reduce`

## 6. Where is each section’s animation defined?

1. **Chapter → formation mapping:** `CHAPTERS` in `config/landingScene.ts`
2. **Interpolation math:** `sampleStage()` in `lib/animations/math.ts`
3. **DOM panels:** sections with `data-ih-panel` / `data-ih-line` in `ImmersiveHome.tsx`

### Section mapping (home content → visual state)

| Existing section | Chapter id | Formation | Morph | 3D behaviour |
|---|---|---|---|---|
| Hero | `hero` | scatter | chaos | Hub center; nodes drift |
| Partners | `partners` | orbit | chaos | Soft orbit around hub |
| Features | `features` | network | structure | Network graph; focus AI/webhook nodes |
| Agents | `agents` | orbit | structure | Focused agent nodes orbit |
| Integrations | `integrations` | stack | structure | Integration wall/grid |
| Statistics | `statistics` | orbit | flow | Particle burst / impact |
| How it works | `how` | pipeline | structure | Vertical story chain |
| FAQ | `faq` | orbit | structure | Calm orbit |
| CTA | `cta` | converge | resolve | Nodes reconverge into hub |

---

## 7. How to change a 3D object

- Procedural hub: `components/3d/objects/Core.tsx`
- Scale: `SCENE_TUNING.coreBaseScale`
- Swap to GLB later:
  1. Drop file in `public/models/`
  2. Set `ASSET_SLOTS.heroObject.modelUrl` in `config/landingScene.ts`
  3. Load with `@react-three/drei` `<useGLTF />` inside `Core.tsx` (keep scroll uniforms)

## 8. How to change an icon

- **3D workflow card icons:** `components/3d/workflowNodes.ts`  
  Edit `icon` (SVG path), `label`, `color`, or `id`.
- **Feature section icon keys:** `SECTION_ICONS.features` in `config/landingScene.ts`  
  and the feature cards in `ImmersiveHome.tsx`.
- Do **not** convert every DOM icon into 3D — keep Lucide/SVG/images in DOM.

## 9. How to change colors

- Brand 3D colors: `SCENE_TUNING.colors` in `config/landingScene.ts`
- UI tokens: `components/new-landing/theme.ts` (`--nl-*`)

## 10. How to change camera movement

- `components/3d/objects/Atmosphere.tsx` (scroll-linked targets)
- Amplitudes / base Z: `SCENE_TUNING.camera` + `sideAmpDesktop` / `sideAmpMobile`

## 11. How to change animation speed

- Global scrub lag: `SCENE_TUNING.scroll.scrub` (higher = softer catch-up)
- Lenis feel: `SCENE_TUNING.scroll.lenisDuration`
- Chapter cross-fade: `SCENE_TUNING.chapterBlendStart`
- Typography scrub: `SCENE_TUNING.scroll.typographyScrub`

## 12. How to disable an animation

- Freeze entire scene: `SCENE_TUNING.enableSceneAnimation = false`
- Disable Lenis: `SCENE_TUNING.scroll.lenisEnabled = false`
- Disable WebGL: set `disableWebGL: true` on a quality preset
- Reduced motion users: canvas is skipped automatically

## 13. How to add a new section

1. Add a panel in `ImmersiveHome.tsx` with `data-ih-panel` and `id="..."`.
2. Append a matching entry to `CHAPTERS` in `config/landingScene.ts` (same order).
3. Optionally tune `focus`, `side`, `formation`, `rise`.
4. Refresh ScrollTrigger (already called on mount / ready).

## 14. How to add a new visual state

1. Extend `Formation` / `Morph` types in `config/landingScene.ts` if needed.
2. Implement the formation in `formationPoint()` inside `Fragments.tsx`.
3. Map it on a chapter in `CHAPTERS`.

## 15. How to replace a procedural shape with a GLB

1. Place model at `public/models/your-model.glb`
2. Set `ASSET_SLOTS.heroObject.modelUrl = '/models/your-model.glb'`
3. In `Core.tsx`, conditionally render `<primitive object={gltf.scene} />` while keeping the same group transforms driven by `sampleStage`

## 16. How to adjust mobile behaviour

- Presets: `MOBILE_QUALITY`, `TABLET_QUALITY`, `DESKTOP_QUALITY` in `config/landingScene.ts`
- Breakpoints: `SCENE_TUNING.mobileMax`, `tabletMax`
- Side staging disabled on mobile via `sideAmpMobile: 0`

### Disable 3D on mobile

```ts
export const MOBILE_QUALITY: Quality = {
  ...,
  disableWebGL: true,
};
```

## 17. How to reduce motion

- Automatic via `prefers-reduced-motion: reduce`
- Behaviour: no Lenis, static gradient background (no canvas), simpler typography scrub
- Camera/core also damp motion when `reducedMotion` is passed into the scene

## 18. How to optimize performance

- Lower `particles` / `nodeCount` in quality presets
- Turn off `bloom` on mobile (already off in `MOBILE_QUALITY`)
- Cap `dpr`
- Keep a **single** canvas (`LandingScene`)
- Prefer procedural geometry; compress GLBs if added later

---

## Important variables (quick index)

| Variable | File | Purpose |
|---|---|---|
| `CHAPTERS` | `config/landingScene.ts` | Master section → visual state map |
| `SCENE_TUNING.camera.*` | `config/landingScene.ts` | Camera FOV / Z / start |
| `SCENE_TUNING.coreBaseScale` | `config/landingScene.ts` | Hub size |
| `SCENE_TUNING.scroll.scrub` | `config/landingScene.ts` | Scroll→animation lag |
| `SCENE_TUNING.scroll.lenisDuration` | `config/landingScene.ts` | Smooth scroll feel |
| `DESKTOP_QUALITY.particles` | `config/landingScene.ts` | Particle count |
| `scroll.current.progress` | `lib/animations/scrollState.ts` | Live 0..1 progress |
| `sampleStage(p)` | `lib/animations/math.ts` | Timeline sampler |
| `WORKFLOW_NODES` | `components/3d/workflowNodes.ts` | 3D card icons |
| `ASSET_SLOTS.heroObject` | `config/landingScene.ts` | Future GLB slot |

---

## Customization cheat sheet

| Goal | Edit |
|---|---|
| Change an icon | `components/3d/workflowNodes.ts` or feature cards in `ImmersiveHome.tsx` |
| Change the 3D object | `components/3d/objects/Core.tsx` + `ASSET_SLOTS` |
| Change the camera | `Atmosphere.tsx` + `SCENE_TUNING.camera` |
| Change scroll speed / scrub | `SCENE_TUNING.scroll` |
| Change transition Features → Agents | Reorder / edit those two entries in `CHAPTERS` |
| Disable 3D on mobile | `MOBILE_QUALITY.disableWebGL = true` |

---

## Content source

Home page copy comes from root i18n keys in `locales/en.json` / `locales/ar.json`:

- `hero.*`, `partners.*`, `features.*`, `agents.*`, `integrations.*`, `statistics.*`, `howItWorks.*`, `faq.*`

Do not replace these with placeholder marketing text when iterating on animation.

---

## Dependencies

Already in the project / added for this experience:

- `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- `gsap` (+ ScrollTrigger)
- `lenis` (smooth scroll, synced with ScrollTrigger)

Classic home components (`components/Hero.tsx`, etc.) remain in the repo for reference / other routes; `/` now uses `ImmersiveHome`.
