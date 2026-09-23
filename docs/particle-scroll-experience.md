# Particle Scroll Experience (New Landing 3)

Route: **`/new-landing-3`**

Full Dragify landing story as a scroll-driven particle morph (Virtualverse-style).
Copy comes from `landing.*` + home `howItWorks` / `partners`.
Home images/logos are embedded in UI chapters (`homeAssets.ts`).

**14 sections:** hero → partners → shift → workflow → features → agents → integrations → stats → security → how → voices → faq → pricing → cta

---

## Section animation files (ملف واحد لكل سكشن)

| Section | File — عدّل الشكل من هنا |
|---|---|
| **Hero** | `lib/particles/sections/heroSectionAnimation.ts` |
| **Partners** | `lib/particles/sections/partnersSectionAnimation.ts` |
| **The Shift** | `lib/particles/sections/shiftSectionAnimation.ts` |
| **Workflow** | `lib/particles/sections/workflowSectionAnimation.ts` |
| **Features** | `lib/particles/sections/featuresSectionAnimation.ts` |
| **Agents** | `lib/particles/sections/agentsSectionAnimation.ts` |
| **Integrations** | `lib/particles/sections/integrationsSectionAnimation.ts` |
| **Stats** | `lib/particles/sections/statsSectionAnimation.ts` |
| **Security** | `lib/particles/sections/securitySectionAnimation.ts` |
| **How** | `lib/particles/sections/howSectionAnimation.ts` |
| **Voices** | `lib/particles/sections/voicesSectionAnimation.ts` |
| **FAQ** | `lib/particles/sections/faqSectionAnimation.ts` |
| **Pricing** | `lib/particles/sections/pricingSectionAnimation.ts` |
| **CTA** | `lib/particles/sections/ctaSectionAnimation.ts` |
| Morph bridge (intro cloud only) | `lib/particles/sections/morphBridgeAnimation.ts` |
| Order / scroll windows | `lib/particles/sections/registry.ts` |
| Home image map | `lib/particles/sections/homeAssets.ts` |

في أعلى كل ملف سكشن: وصف EN/AR + **AI icon generation prompt**.
داخل الملف: `CONFIG.mode` (`procedural` | `svg`) + `CONFIG.svg` + الشكل الإجرائي.

عشان SVG: غيّر `mode: 'svg'` و `svg: '/icons/nl3/....svg'` داخل ملف السكشن.

---

## How to replace icons (Arabic / EN)

ضع ملفاتك هنا:

```
public/icons/nl3/hero-core.svg
public/icons/nl3/partners.svg
public/icons/nl3/network.svg
public/icons/nl3/workflow.svg
… (انظر CONFIG.svg في كل ملف سكشن)
```

ثم في ملف السكشن:

```ts
CONFIG.mode = 'svg';
CONFIG.svg = '/icons/nl3/your-icon.svg';
```

---

## How to replace icons (legacy note)  scale: 2.45,
  depth: 0.32,
  jitter: 0.018,
};

PARTICLE_TARGETS.network = {
  kind: 'svg', // أو 'network' للشكل الإجرائي
  src: '/icons/nl3/about.svg',
  scale: 2.5,
  depth: 0.32,
  jitter: 0.014,
};
```

**أفضل فورمات:** SVG أبيض على خلفية شفافة (مفضّل) · PNG شفاف عالي الدقة · GLB لو 3D.

---

## Choreography (refined)

See `lib/particles/choreography.ts` (`CHOREO`):

| Phase | Behavior |
|---|---|
| **Intro** | Particles assemble cloud→hero; title → subtitle → CTAs |
| **Scroll early** | Hero text exits upward; icon drifts right→center |
| **Morph** | Centered particle morph (hero→dissolve→transition→network) |
| **Return** | At ~80–90% network formed, icon returns to the right |
| **Section 2 text** | Badge → title (scale up) → subtitle → CTA |
| **Mouse** | Main repulsion + ambient parallax (subtle) |

---

## 1. Architecture

```
Scroll (Lenis + GSAP ScrollTrigger scrub)
        ↓
  master progress 0 → 1
        ↓
 ┌──────┴──────┬──────────────┐
 ↓             ↓              ↓
Particle     Camera         Text
morph        dolly          layers
(BufferGeometry lerp)
```

**One** main particle system. **One** ambient system. Particles are never destroyed/recreated during the story.

### File map

```
pages/new-landing-3.tsx
components/new-landing-3/NewLanding3.tsx          # sticky stage + chrome + styles
components/new-landing-3/ui/TextStates.tsx        # hero ↔ problem copy
components/new-landing-3/ui/ProgressIndicator.tsx
components/new-landing-3/ui/DebugPanel.tsx        # press D in development
components/new-landing-3/scene/ParticleMorphCanvas.tsx
components/new-landing-3/scene/MainParticles.tsx  # morphing Points
components/new-landing-3/scene/AmbientParticles.tsx
components/new-landing-3/scene/CameraRig.tsx
lib/particles/createParticleTarget.ts            # ★ SVG / image / GLB / network
lib/particles/scrollEngine.ts
lib/particles/shaders.ts
lib/particles/noise.ts
lib/particles/types.ts
config/newLanding3Scene.ts                       # ★ edit this first
public/icons/nl3/hero-core.svg
public/icons/nl3/network.svg
docs/particle-scroll-experience.md               # this file
```

---

## 2. Particle system

Two independent systems:

| System | Role |
|---|---|
| **Main** (`MainParticles`) | Forms hero icon → dissolve → transition → network |
| **Ambient** (`AmbientParticles`) | Deep-space background field |

Main particles use `THREE.Points` + custom `ShaderMaterial` (soft sprite, additive blending). Positions live in a `Float32Array` BufferAttribute updated every frame from scroll progress — **never** via React state.

---

## 3. Target generation

`lib/particles/createParticleTarget.ts` exposes:

| API | Input |
|---|---|
| `createFromSVG(src, count)` | SVG → canvas sample → point cloud |
| `createFromImage(src, count)` | PNG → opaque bright pixels |
| `createFromGLB(src, count)` | GLTF mesh vertices / surface |
| `createFromGeometry(geo, count)` | Any BufferGeometry |
| `createNetworkTarget(count)` | Procedural hub + branches |
| `createDissolveCloud(count)` | Volumetric cloud |
| `createTransitionField(count)` | Abstract filaments |
| `buildMorphTargets(count, hero, network)` | Builds all 4 NL3 states |

All targets are resampled to the **same** particle count so morphing stays continuous.

Pipeline:

```
YOUR SVG / ICON
      ↓
Point Generator (sample bright pixels)
      ↓
N particles (normalized + depth + jitter)
      ↓
TARGET A / B / C / D buffers
      ↓
lerp(from, to, localT) + deterministic arc noise
```

---

## 4. Scroll progress

`lib/particles/scrollEngine.ts`:

- Tall story container: `NL3_TUNING.scrollVh` (default **420vh**)
- Sticky `100vh` stage stays fixed
- ScrollTrigger scrub writes `bus.progress ∈ [0, 1]`
- Lenis synced with `ScrollTrigger.update` when enabled

Scroll up reverses. Mid-scroll pause keeps the exact intermediate morph.

---

## 5. Morphing

`sampleMorphProgress(progress)` in `config/newLanding3Scene.ts`:

| Window | From → To |
|---|---|
| `0.00 → 0.28` | hero → dissolve |
| `0.28 → 0.52` | dissolve → transition |
| `0.52 → 1.00` | transition → network |

Interpolation:

```
pos = lerp(targetA, targetB, smoothstep(localT))
    + morphArcOffset(i, localT, dispersion)
```

Noise is **deterministic** (`hash2(i, salt)`), never `Math.random()` per frame.

---

## 6. Hero state

- Content: existing `landing.hero.*` copy
- Visual: `/icons/nl3/hero-core.svg` sampled into particles
- Idle breathing + tiny rotation only near settle (does not fight scroll)

---

## 7. Dissolve state

Procedural spherical cloud (`createDissolveCloud`). Particles physically leave the icon silhouette — no opacity fade cheat.

---

## 8. Network state

Procedural particle network (central node + radiating branches + tip nodes) matching **Problem / The Shift** (“fragmentation → one connecting layer”).

To use an SVG network instead, set in config:

```ts
network: { kind: 'svg', src: '/icons/nl3/network.svg', ... }
```

---

## 9. Text animation

`TextStates.tsx` + `TEXT_WINDOWS` in config:

- Hero exits with translateY / slight blur / opacity as dissolve begins
- Problem copy enters as the network forms
- Same master `progress` — not IntersectionObserver section swaps

---

## 10. Camera

`CameraRig.tsx` lerps start → mid → end from `NL3_TUNING.camera`. Subtle only; particles are the main effect.

---

## 11. Performance

- Typed arrays / BufferGeometry updates (no React per particle)
- Quality tiers: desktop 12k / tablet 7k / mobile 4k
- Bloom via `@react-three/postprocessing` (disabled on mobile by default)
- Soft particle texture + additive blend reduces need for heavy post

---

## 12. Mobile

- Lower particle counts
- Visual offset moves above/below text (`visualOffsetMobile`)
- Bloom off
- `prefers-reduced-motion`: canvas skipped / motion reduced

---

## 13. How to replace icons

### Change Hero icon

1. Drop SVG at `public/icons/nl3/your-icon.svg` (white shapes on transparent)
2. Edit `config/newLanding3Scene.ts` → `PARTICLE_TARGETS.hero.src`

### Change Second Section visual

- Procedural: edit `PARTICLE_TARGETS.network.nodeCount` etc.
- Or SVG: set `kind: 'svg'` and `src: '/icons/nl3/network.svg'`

### Change particle count

`NL3_TUNING.particleCount.{desktop,tablet,mobile}`

### Change particle color / glow

`NL3_TUNING.colors.core`, `.glow`, `.ambient`  
`NL3_TUNING.bloom.*`

### Change morph timing

`MORPH_WINDOWS` ranges

### Change dispersion / depth

`NL3_TUNING.dispersion`, `.chaosStrength`, `.depthScale`  
Also per-target `depth` / `jitter` in `PARTICLE_TARGETS`

### Change network node count

`PARTICLE_TARGETS.network.nodeCount`

### Change text animation

`TEXT_WINDOWS` + `components/new-landing-3/ui/TextStates.tsx`

### Change scroll duration

`NL3_TUNING.scrollVh` (higher = slower cinematic morph)

---

## 14. How to add another target shape

```ts
// 1) Generate
const services = await createFromSVG('/icons/nl3/services.svg', count, { scale: 3.2 });

// 2) Include in targets map passed to MainParticles
// 3) Append a window in MORPH_WINDOWS:
{ from: 'network', to: 'services', range: [1.0, 1.0] } // then retune ranges to fit 0..1
```

Later sections should extend the **same** particle buffer + progress windows — do not spawn a second morph system.

---

## 15. How to add another section later

1. Add content layer in `TextStates` (or a new caption component)
2. Add a new target via `createFromSVG` / network / GLB
3. Extend `MORPH_WINDOWS` + `TEXT_WINDOWS` + `scrollVh`
4. Keep one `bus.progress` orchestrating everything

Do **not** start work on sections 3+ until these two sections are approved.

---

## Debug mode

In development, press **`D`**:

- Live progress `0.00 → 1.00`
- Morph label (`hero→dissolve`, etc.)
- Particle count + FPS
- Force show TARGET: hero / dissolve / transition / network

---

## Content mapping

| Visual state | Landing content |
|---|---|
| Hero particles | `landing.hero` |
| Network particles | `landing.problem` (The Shift — connections / fragmentation) |

Copy is read from existing `locales/en.json` / `ar.json` — not invented from Virtualverse.
