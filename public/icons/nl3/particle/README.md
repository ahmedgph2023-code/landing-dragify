# So7ba particle sections

Base path (from `lib/so7ba-story/registry.ts`):

```text
/icons/nl3/particle/{folder}/assets/{file}
```

## Layout

```text
public/icons/nl3/particle/
  README.md          ← this file
  hero/assets/       ← form-a.png, form-b.png, form-c.png  (3 progressive home forms)
  section-2/assets/  ← partners (existing Studio export)
  features/assets/
  agents/assets/
  integrations/assets/
  stats/assets/
  how/assets/
  faq/assets/
```

## How to add / replace a section

1. In So7ba playground: tune image → **Download NL3 Scroll Morph** (or just export the PNG).
2. Copy `assets/form-a.png` into the matching folder above.
3. Open `lib/so7ba-story/registry.ts` — find the section object:
   - `folder` — must match the folder name
   - `float` — `'left' | 'right' | 'center'` (particle side)
   - `copySide` — text side
   - `forms` — list every PNG used in that section
   - `beats` — hold / morph / dissolve / reassemble (local 0..1)
4. Refresh `/new-landing-3`.

## Continuous morph

One `ParticleObject` loads every form once, then scroll lerps
`form → dissolve → next form`. No second canvas, no CSS box.

Config file (single source of truth):

`lib/so7ba-story/registry.ts`
