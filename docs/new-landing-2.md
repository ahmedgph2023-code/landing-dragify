# New-Landing-2 — Continuous Scroll Story

Route: **`/new-landing-2`**

This page is a separate experiment. It does **not** modify `/`, `/landing`, or `/new-landing`.

## What makes it different

| Previous approaches | New-Landing-2 |
|---|---|
| Stacked `min-h-screen` sections | One tall sticky story (`950vh`) |
| Cards / panels per section | Sparse captions over a living sculpture |
| Background canvas decoration | Persistent WebGL scene **is** the page |
| Enter/exit fades as main effect | Scroll progress morphs formations + camera |

## Existing sections → visual states

| Landing section | State id | Formation | Meaning |
|---|---|---|---|
| Hero | `hero` | `core` | Single automation core |
| Partners | `partners` | `orbit` | Ecosystem rings |
| Problem / Shift | `shift` | `fracture` | Fragmented tools |
| Workflow | `workflow` | `pipeline` | Trigger → agent → actions |
| Features | `features` | `modules` | 4 capability modules |
| Agents | `agents` | `satellites` | Team use-case orbits |
| Integrations | `integrations` | `network` | Brand icon network |
| Security | `security` | `shield` | Protective dome |
| Testimonials | `voices` | `orbs` | Soft proof lights |
| Pricing | `pricing` | `tiers` | Three plan columns |
| CTA | `cta` | `converge` | Everything returns to one core |

## File map

```
pages/new-landing-2.tsx
components/new-landing-2/NewLanding2.tsx          # sticky story + captions
components/new-landing-2/ui/Captions.tsx
components/new-landing-2/scene/SceneCanvas.tsx    # R3F canvas
components/new-landing-2/scene/CameraRig.tsx      # camera + lights
components/new-landing-2/scene/MorphWorld.tsx     # hub + morphing nodes
components/new-landing-2/scene/EnergyParticles.tsx
components/new-landing-2/scene/textures.ts
lib/new-landing-2/scrollEngine.ts                 # Lenis + ScrollTrigger
lib/new-landing-2/worldMath.ts                    # sampleWorld + formations
config/newLanding2Scene.ts                        # ★ edit this first
```

## How scrolling works

```
tall story (950vh)
   ↓ sticky 100vh stage stays fixed
scroll progress 0→1
   ↓ ScrollTrigger scrub
bus.progress
   ↓ sampleWorld()
camera + hub + nodes + particles + caption visibility
```

Scroll up reverses naturally.

## Customization cheat sheet

| Change | File | Variable / place |
|---|---|---|
| **Icons** (Slack, WhatsApp, …) | `config/newLanding2Scene.ts` | `INTEGRATION_ICONS` (`image` or `svgPath`) |
| **Feature module labels/colors** | `config/newLanding2Scene.ts` | `FEATURE_VISUALS` |
| **Camera per chapter** | `config/newLanding2Scene.ts` | `SCENE_STATES[].camera` |
| **Formation / morph sequence** | `config/newLanding2Scene.ts` | `SCENE_STATES[].formation` + ranges |
| **Formation math** | `lib/new-landing-2/worldMath.ts` | `formationTarget()` |
| **3D hub / nodes** | `components/new-landing-2/scene/MorphWorld.tsx` | hub geometry / materials |
| **Colors** | `config/newLanding2Scene.ts` | `NL2_TUNING.colors` |
| **Scroll length / scrub / Lenis** | `config/newLanding2Scene.ts` | `NL2_TUNING.scrollVh`, `scrub`, `lenisDuration` |
| **Particles** | `config/newLanding2Scene.ts` | `NL2_TUNING.quality.*.particles` |
| **Mobile quality** | `config/newLanding2Scene.ts` | `NL2_TUNING.quality.mobile` |
| **Caption copy** | `components/new-landing-2/NewLanding2.tsx` | CaptionLayer blocks (reads `landing.*` i18n) |
| **Caption alignment** | `config/newLanding2Scene.ts` | `SCENE_STATES[].caption` |

### Disable 3D on mobile

In `NewLanding2.tsx`, the canvas is already skipped when `prefers-reduced-motion` is on. To force-disable WebGL on mobile, change the canvas condition to also require `!isMobile`.

### Add a new chapter

1. Append to `SCENE_STATES` in `config/newLanding2Scene.ts`
2. Implement formation in `formationTarget()` if new
3. Add a `<CaptionLayer id="...">` in `NewLanding2.tsx`

## Content source

Copy comes from existing `landing.*` keys in `locales/en.json` / `ar.json` (same as `/landing`).

## Compare

- `/` — previous immersive home (untouched by this work beyond shared Layout chrome list)
- `/landing` — classic modular landing
- `/new-landing` — earlier cinematic variant
- **`/new-landing-2`** — this continuous morph story
