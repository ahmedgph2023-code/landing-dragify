# Immersive Scroll System (new-landing-3)

Route: **`/new-landing-3`**  
Dev: `http://localhost:3002/new-landing-3`

Persistent particle-driven storytelling (Virtualverse **interaction model**) using classic home `/` content.

---

## Core idea

```
USER SCROLL
     ↓
MASTER PROGRESS (0→1)
     ↓
┌──────────┼──────────┬──────────┐
↓          ↓          ↓          ↓
PARTICLES  COMPOSITION  TEXT     CAMERA
(morph)    (R→C→slot)  (sync)    (dolly)
```

**ONE** WebGL canvas · **ONE** main particle buffer · states morph in place (never recreate per section).

---

## Hero → Partners (first beat — tune this first)

Progress **`0 → 0.26`** owns the entire first cinematic chapter (`registry.ts`).

| Local t (of 0–0.26) | What you should see |
|---------------------|---------------------|
| 0–18% | Hero core holds on **RIGHT** |
| 18–35% | Icon glides **RIGHT → CENTER** |
| 35–62% | **HOLD CENTER** + dissolve explode + reassemble starts |
| 62–100% | Network settles; partners text enters after ~55% formation |

Scroll **up** reverses the same path.

Critical bug fixed: intro RAF no longer overwrites `bus.intro` after the user scrolls (that locked morph on hero-assemble forever).

Press **`D`** → watch `kind` flip: `hold` → `dissolve` → `reassemble`.

---

## Four layers

1. **Particle world** — same N points lerp between targets via dissolve cloud  
2. **Composition** — icon slot: `right | midRight | center | left`  
3. **Typography** — badge → title → body → CTA after ~60% reassembly  
4. **Ambient** — separate starfield + mouse parallax  

---

## Transition phases (every chapter change)

| Phase | What happens |
|-------|----------------|
| HOLD | Shape readable at section `visualSlot` |
| MOVE TO CENTER | Icon glides center + scale pulse |
| DISSOLVE | Shape → particle cloud (`A → dissolve`) |
| REASSEMBLE | Cloud → next shape (`dissolve → B`) |
| SETTLE | Icon moves to next `visualSlot` |
| TEXT | Badge ~60% formed → title → body → CTA |

Scroll is **scrubbed**: progress maps 1:1; scroll up reverses.

---

## Home sections → particle metaphors

| Section | Locale | Metaphor | Slot | Target builder |
|---------|--------|----------|------|----------------|
| Hero | `hero.*` | Automation core | right | `heroSectionAnimation.ts` |
| Partners | `partners.*` | Node network | center | `partnersSectionAnimation.ts` |
| Features | `features.*` | Capability grid | midRight | `featuresSectionAnimation.ts` |
| Agents | `agents.*` | Orb + orbits | right | `agentsSectionAnimation.ts` |
| Integrations | `integrations.*` | Hub connectors | center | `integrationsSectionAnimation.ts` |
| Statistics | `statistics.*` | Metric bars | midRight | `statsSectionAnimation.ts` |
| How it works | `howItWorks.*` | 3-step path | right | `howSectionAnimation.ts` |
| FAQ | `faq.*` | Question mark | center | `faqSectionAnimation.ts` |

---

## Key files

| Role | Path |
|------|------|
| Page shell | `components/new-landing-3/NewLanding3.tsx` |
| Particle canvas | `components/new-landing-3/scene/ParticleMorphCanvas.tsx` |
| Main morph engine | `components/new-landing-3/scene/MainParticles.tsx` |
| Ambient field | `components/new-landing-3/scene/AmbientParticles.tsx` |
| Camera | `components/new-landing-3/scene/CameraRig.tsx` |
| Text layers | `components/new-landing-3/ui/TextStates.tsx` |
| Fullscreen menu | `components/new-landing-3/ui/ImmersiveMenu.tsx` |
| Debug (press `D`) | `components/new-landing-3/ui/DebugPanel.tsx` |
| Section order / morph windows | `lib/particles/sections/registry.ts` |
| Choreography (slots, scale, text sync) | `lib/particles/choreography.ts` |
| Scroll pin + Lenis | `lib/particles/scrollEngine.ts` |
| Tuning | `config/newLanding3Scene.ts` |
| Home assets map | `lib/particles/sections/homeAssets.ts` |
| Per-section shapes | `lib/particles/sections/*SectionAnimation.ts` |
| Dissolve cloud | `lib/particles/sections/morphBridgeAnimation.ts` |
| SVG/PNG → target | `lib/particles/loadSvgTarget.ts` |

---

## Exact customization cheat-sheet

### How do I change the Hero icon?
File: `lib/particles/sections/heroSectionAnimation.ts`  
- Procedural: edit `buildProcedural()`  
- SVG: set `CONFIG.mode = 'svg'` and `CONFIG.svg = '/icons/nl3/your.svg'`  
Asset folder: `public/icons/nl3/`

### How do I change Section 2 (Partners) icon?
File: `lib/particles/sections/partnersSectionAnimation.ts`  
Default is procedural **network**. For SVG: `CONFIG.mode = 'svg'`, `CONFIG.svg = '/icons/nl3/network.svg'`.

### How do I create a new particle icon?
1. Drop SVG in `public/icons/nl3/foo.svg` (white, transparent, ~512²).  
2. Copy a `*SectionAnimation.ts`, point `CONFIG.svg`, export `buildXxxTarget`.  
3. Register in `lib/particles/sections/index.ts`.  
4. Add to `NL3_SECTIONS` in `registry.ts`.

### How do I change particle count?
`config/newLanding3Scene.ts` → `NL3_TUNING.particleCount.{desktop,tablet,mobile}`

### How do I change particle color / glow?
`config/newLanding3Scene.ts` → brand colors + `bloom.*`  
Shader uniforms live in `MainParticles.tsx` (Points shader).

### How do I change dissolve strength?
- Cloud size: `lib/particles/sections/morphBridgeAnimation.ts` → `MORPH_BRIDGE.dissolve.scale` / `radius`  
- Explode: `config/newLanding3Scene.ts` → `dispersion`, `chaosStrength`  
- Explode multiplier: `MainParticles.tsx` (search `explode`)

### How do I change morph timing?
- Chapter lengths: `lib/particles/sections/registry.ts` → `NL3_SECTIONS[].range`  
- Hold / dissolve / reassemble ratios: `buildMorphWindowsFromSections()` (18% / 42% / 40%)  
- Scroll length: `NL3_TUNING.scrollVh`  
- Scrub lag: `NL3_TUNING.scrub`

### How do I change camera position?
`config/newLanding3Scene.ts` → `NL3_TUNING.camera.{start,mid,end}`  
Logic: `components/new-landing-3/scene/CameraRig.tsx`

### How do I change visual position?
- Default RIGHT: `NL3_TUNING.visualOffset`  
- Per chapter: `registry.ts` → `visualSlot`  
- Path RIGHT→CENTER→slot: `lib/particles/choreography.ts` → `sampleIconOffset`

### How do I change text animation?
- Hero entrance: `CHOREO.intro` in `choreography.ts`  
- Hero exit: `sampleHeroExit`  
- Section text: `sampleSectionTextStages` in `registry.ts`  
- DOM markup: `components/new-landing-3/ui/TextStates.tsx`

### How do I add another visual state?
1. `Nl3SectionId` + `NL3_SECTIONS` entry  
2. New `*SectionAnimation.ts` + wire in `index.ts`  
3. Text block in `TextStates.tsx`  
4. Retune ranges so they cover `[0,1]` without gaps

---

## Tuning knobs (`config/newLanding3Scene.ts`)

| Knob | Effect |
|------|--------|
| `scrollVh` | Longer = slower cinematic morph (default 1400) |
| `scrub` | Higher = softer catch-up behind wheel |
| `particleCount.*` | Density / performance |
| `dispersion` / `chaosStrength` | Cloud size during dissolve |
| `visualOffset` | Default RIGHT world X |
| `iconScale` | Base silhouette size |
| `bloom.*` | Glow readability |

Composition per chapter: `registry.ts` → `visualSlot`.

---

## Debug

Press **`D`** in development:

- progress / morph label / localT / FPS / force target buttons.

Force a target (e.g. Partners) without scrolling to verify sampling.

---

## Performance & a11y

- Device tiers: desktop / tablet / mobile particle counts + bloom off on mobile.  
- `prefers-reduced-motion`: skip canvas morph; content still readable.  
- No per-particle React nodes — `Float32Array` + `ShaderMaterial`.

---

## What this is / isn’t

**Is:** one continuous world; dissolve → reassemble; scrubbed scroll; composition changes; text synced to formation.

**Isn’t:** fade between sections; destroy/recreate canvas; GIF/video; Virtualverse assets/copy.
