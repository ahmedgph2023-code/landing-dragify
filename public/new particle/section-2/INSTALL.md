# Particle Animation — README

Exported from **So7baFit Particle Studio**.
This package is meant to look **exactly** like the Studio preview:
same density, same crisp text/icons, same hover push, same camera, same colors.

If it looked different on your website before, you almost always missed one of:
container height, `three` version, image path, or studio props (especially `crispText` / hover).

---

## 1) What’s in this folder

| File | Role |
|------|------|
| `ParticleObject.jsx` | The engine (WebGL + sampling + hover physics). **Do not rewrite.** |
| `MyParticleHero.jsx` | Your Studio settings baked as props. This is what you mount. |
| `particle-scene.json` | Full scene snapshot (debug / re-import). |
| `README.md` | This guide. |

All files sit **in one flat folder** (no nested `src/...` paths).

---

## 2) Install dependency (required)

```bash
npm install three@^0.185.1
```

Use a modern `three` (r160+). Old versions break `three/addons/...` imports inside `ParticleObject.jsx`.

React + ReactDOM are assumed (Next.js App Router, Pages Router, Vite, CRA).

---

## 3) Copy the folder into your project

Example:

```text
your-site/
  public/
    particle-assets/
      images/
        f8a9aa58-9f77-4db1-ad38-01565b46a05e          ← put THE SAME image you used in Studio
  src/
    components/
      particle-animation/     ← paste THIS whole folder here
        ParticleObject.jsx
        MyParticleHero.jsx
        particle-scene.json
        README.md
```

Keep `ParticleObject.jsx` and `MyParticleHero.jsx` **next to each other**
(the hero imports `./ParticleObject`).

---

## 4) Put the image in `public/`

Studio `src` was:

```text
blob:https://so7bafit.com/f8a9aa58-9f77-4db1-ad38-01565b46a05e
```

So the file must exist at:

```text
publicblob:https://so7bafit.com/f8a9aa58-9f77-4db1-ad38-01565b46a05e
```

Rules for a 1:1 match:
1. Use the **exact same PNG** you previewed in Studio (same crop, same glow removal, same resolution).
2. Path in `MyParticleHero.jsx` (`src={...}`) must match the public URL.
3. Prefer transparent PNG. Soft bloom baked into the image will look mushy as particles.

If you move the image, update the `src` prop only.

---

## 5) Mount it on a page

### Next.js App Router (`app/...`)

`MyParticleHero.jsx` already has `"use client"`.

```jsx
import MyParticleHero from "@/components/particle-animation/MyParticleHero";

export default function Page() {
  return <MyParticleHero />;
}
```

### Next.js Pages Router (`pages/...`)

`"use client"` is ignored (harmless). Import normally:

```jsx
import MyParticleHero from "../components/particle-animation/MyParticleHero";

export default function Home() {
  return <MyParticleHero />;
}
```

### Vite / CRA

Same import. Ensure the file extension resolves (`.jsx`).

---

## 6) CRITICAL: container size (most common “looks different” bug)

`ParticleObject` draws on a `<canvas>` with `position: absolute; inset: 0`.
If the parent has **no height**, the canvas collapses and the scene looks tiny / cropped / wrong.

`MyParticleHero.jsx` forces a full-viewport box with **inline styles** (works even without Tailwind):

- width: 100%
- height: 100vh
- overflow: hidden
- dark background like Studio (`#050506`)
- ParticleObject stretched with `position: absolute; inset: 0; width/height: 100%`

Do **not** wrap it in a zero-height div, a collapsed grid cell, or a card without `min-height`.

Good:

```jsx
<div style={{ height: "100vh" }}>
  <MyParticleHero />
</div>
```

Bad:

```jsx
<div> {/* no height */}
  <MyParticleHero />
</div>
```

---

## 7) Hover / interaction (must match Studio)

These props are baked into `MyParticleHero.jsx` from your Studio session:

- `cursorEnabled={true}`
- `interactionMode="push"`
- `radius`, `strength`, `swirl`, `spring`, `damping`

Checklist if hover does nothing:
1. `cursorEnabled` must be `true`
2. `strength` must be `> 0`
3. Pointer must be over the **canvas** (not covered by another transparent overlay / nav)
4. OS “reduce motion” can soften interaction — test with it off
5. Don’t remount the component every frame (that resets physics)

---

## 8) Crisp text / icons (must match Studio Optimize)

If you used **Optimize Text & Icons** in Studio, export includes:

- `crispText={true}`
- high `rasterSize` (e.g. 1920)
- denser `count`
- hard points (`pointSoftness={0}`, `sampleJitter={0}`)

If you omit these (or use an old export), the site will look sandy / blurry even with the same PNG.

---

## 9) Background & colors

- Studio often uses transparent WebGL clear (`background=""`) over a dark page.
- Hero section background is set to `#050506` to match Studio chrome.
- Empty / omitted `color` = use **original image colors** (same as Studio “Use Original Image Colors”).
- If you force a hex `color`, the whole cloud tints — that alone can look “totally different”.

---

## 10) Your exported settings snapshot

- `src`: `"blob:https://so7bafit.com/f8a9aa58-9f77-4db1-ad38-01565b46a05e"`
- `count`: `90000`
- `size`: `1.15`
- `crispText`: `true`
- `rasterSize`: `1920`
- `cursorEnabled`: `true`
- `interactionMode`: `"push"`
- `radius`: `120`
- `strength`: `1.15`
- `swirl`: `0.45`
- `spring`: `1.45`
- `damping`: `0.42`
- `drift`: `0.12`
- `scale`: `3.5`
- `cameraDistance`: `3.1`
- `fov`: `48`
- `floatIntensity`: `0.35`
- `rotationIntensity`: `0.12`
- `background`: `""`
- `alphaThreshold`: `36`
- `contrast`: `42`
- `brightness`: `10`
- `pointSoftness`: `0`
- `sampleJitter`: `0`

These values are also applied as JSX props in `MyParticleHero.jsx`.
**Do not delete props** if you want a Studio match — change them only when you intend to.

---

## 11) Quick verify checklist (1:1 with Studio)

1. `npm ls three` → modern version installed  
2. Image exists at `publicblob:https://so7bafit.com/f8a9aa58-9f77-4db1-ad38-01565b46a05e`  
3. Hero section is full viewport height  
4. Open page → particle count / density feels like Studio  
5. Hover pushes particles  
6. Text/icons stay readable if you exported with crisp mode  
7. No extra CSS filters / mix-blend / transforms on the wrapper  

---

## 12) What this package does NOT include

- Multi-logo **morph timeline** playback (Studio-only for now). Export is the live single-formation hero.
- Lenis / scroll-story pages (different product).
- Server APIs from Particle Studio.

To change the look later: tweak in Particle Studio → Export → Download Folder again.

---

## 13) Minimal mental model

```text
PNG in /public
   → ParticleObject samples pixels into points
   → props control size / hover / camera / crisp sampling
   → parent must give the canvas real width + height
```

That’s the whole install. Keep the folder together, install `three`, mount `MyParticleHero`, match the image path — and it should match Studio.
