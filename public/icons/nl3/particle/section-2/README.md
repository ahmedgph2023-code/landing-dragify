# Particle Scroll Morph (NL3)

Exported from **So7baFit Particle Studio** for scroll stories
(hold → dissolve/explode → reassemble) with the **same colored particles**.

## What’s in this folder

| File | Role |
|------|------|
| `ParticleObject.jsx` | Studio engine (`createParticleObject`, `setHomes`, `getColors`) |
| `ScrollMorphHero.jsx` | Mount this — pass `progress={0..1}` |
| `scroll-morph-driver.js` | Lerp + procedural dissolve |
| `scroll-morph-manifest.js` | Manifest (windows, particle props, asset path) |
| `scroll-morph.json` | Same manifest as JSON (debug) |
| `assets/form-a.*` | The image you used in Studio (copy into `public`) |
| `README.md` | This file |

## Install

```bash
npm install three@^0.185.1
```

## Asset

1. Copy `assets/form-a.*` → your site `public` folder.
2. Final URL must match `forms[0].src` in `scroll-morph.json`
   (default: `/particle-assets/images/pasted-1786534329433-msq0ev98-cf78.png`).

If Studio used a blob URL, we rewrote it to `/particle-assets/images/pasted-1786534329433-msq0ev98-cf78.png` —
put the PNG there.

## Use (Next.js / Dragify NL3)

```jsx
import dynamic from "next/dynamic";

const ScrollMorphHero = dynamic(() => import("./ScrollMorphHero"), { ssr: false });

// Map page scroll into section-local 0..1 for this beat
export function PartnersBeat({ localProgress }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <ScrollMorphHero progress={localProgress} />
    </div>
  );
}
```

`localProgress` = 0 at section enter, 1 at section exit.
Inside the package, windows morph:

- `0 → ~0.12` hold form
- `~0.12 → ~0.48` dissolve / explode (colors kept)
- `~0.48 → ~0.88` reassemble
- `~0.88 → 1` hold

## Do not

- Rewrite `ParticleObject.jsx`
- Feed these clouds into a different R3F buffer with a different particle count
- Use the old single-hero export when you need scroll explode

## vs regular `particle-animation` export

| | `particle-animation` | `particle-scroll-morph` |
|--|----------------------|--------------------------|
| Mount | `<MyParticleHero />` | `<ScrollMorphHero progress={t} />` |
| Scroll explode | No | Yes |
| Colors | Studio | Studio |

That’s the whole install.
