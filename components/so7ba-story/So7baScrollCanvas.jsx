"use client";

/**
 * Full-viewport So7ba story canvas.
 * ONE ParticleObject · morphs every registry form · no CSS “box”.
 */

import { useEffect, useMemo, useRef } from "react";
import { createParticleObject } from "../particle-scroll-morph/ParticleObject";
import {
  buildDissolveCloud,
  getEase,
  lerpClouds,
  sampleWindowProgress,
} from "../particle-scroll-morph/scroll-morph-driver";
import {
  SO7BA_STORY,
  buildGlobalMorphWindows,
  floatOffsetX,
  listResolvedForms,
  sectionAtProgress,
} from "../../lib/so7ba-story";

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function captureForm(instance, src, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      reject(new Error(`Timeout loading ${src}`));
    }, timeoutMs);

    instance.setOptions({
      src,
      onLoad: (api) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        const homes = api.getHomes?.();
        const colors = api.getColors?.();
        if (!homes) {
          reject(new Error(`No homes for ${src}`));
          return;
        }
        resolve({
          positions: homes.slice(),
          colors: colors ? colors.slice() : new Float32Array(homes.length),
        });
      },
      onError: (err) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(err || new Error(`Failed ${src}`));
      },
    });
  });
}

function equalize(clouds) {
  const ids = Object.keys(clouds);
  if (!ids.length) return clouds;
  let min = Infinity;
  for (const id of ids) {
    min = Math.min(min, clouds[id].positions.length);
  }
  if (!Number.isFinite(min) || min < 3) return clouds;
  const out = {};
  for (const id of ids) {
    out[id] = {
      positions: clouds[id].positions.slice(0, min),
      colors: clouds[id].colors.slice(0, min),
    };
  }
  return out;
}

export default function So7baScrollCanvas({
  progress = 0,
  reducedMotion = false,
  onReady,
}) {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  const cloudsRef = useRef(null);
  const progressRef = useRef(progress);
  const smoothRef = useRef(progress);
  const floatSmoothRef = useRef(0);
  const lastSectionRef = useRef("");
  const rafRef = useRef(0);
  progressRef.current = progress;

  const windows = useMemo(() => buildGlobalMorphWindows(), []);
  const forms = useMemo(() => listResolvedForms(), []);
  const defaults = SO7BA_STORY.particleDefaults;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return undefined;

    let cancelled = false;
    const firstSrc = forms[0]?.src || "";

    const instance = createParticleObject(
      { canvas },
      {
        ...defaults,
        src: firstSrc,
        background: "",
        orbit: false,
        zoom: false,
        autoRotate: false,
        initialFormation: false,
        xOffset: floatOffsetX(forms[0]?.float || "center"),
      },
    );
    instanceRef.current = instance;
    floatSmoothRef.current = floatOffsetX(forms[0]?.float || "center");

    (async () => {
      const clouds = {};
      // Capture first form from initial load
      try {
        await wait(50);
        // Force reload path for first asset via captureForm
        const first = await captureForm(instance, firstSrc);
        if (cancelled) return;
        clouds[forms[0].id] = first;

        for (let i = 1; i < forms.length; i++) {
          if (cancelled) return;
          try {
            const cloud = await captureForm(instance, forms[i].src);
            clouds[forms[i].id] = cloud;
          } catch (err) {
            console.warn("[So7baStory] skip form", forms[i].id, err?.message || err);
            // Reuse previous cloud so timeline never hard-breaks
            const prevId = forms[i - 1]?.id;
            if (prevId && clouds[prevId]) clouds[forms[i].id] = clouds[prevId];
          }
        }

        const normalized = equalize(clouds);
        const seedForm =
          normalized[forms[0].id] || Object.values(normalized)[0];
        if (seedForm) {
          normalized.__dissolve__ = buildDissolveCloud(seedForm, {
            scale: SO7BA_STORY.dissolve.scale,
            seed: SO7BA_STORY.dissolve.seed,
          });
        }
        cloudsRef.current = normalized;

        // Park on first form
        instance.setHomes(seedForm.positions, seedForm.colors);
        onReady?.();
      } catch (err) {
        console.error("[So7baStory] init failed", err);
        onReady?.();
      }
    })();

    const ease = getEase("power2.inOut");

    const tick = () => {
      const inst = instanceRef.current;
      const map = cloudsRef.current;
      if (inst && map) {
        const target = progressRef.current;
        // Slower follow = morph feels tied to scroll distance, not a snap
        smoothRef.current += (target - smoothRef.current) * 0.045;
        if (Math.abs(target - smoothRef.current) < 0.0002) {
          smoothRef.current = target;
        }
        const p = smoothRef.current;
        const { window: w, local } = sampleWindowProgress(p, windows);
        if (w) {
          const from = map[w.from] || map[forms[0]?.id];
          const to = map[w.to] || from;
          let cloud = from;
          if (from && to && w.kind !== "hold" && from !== to) {
            // Gentler ease on explode/gather so mid-scroll still reads clearly
            const eased =
              w.kind === "dissolve" || w.kind === "reassemble"
                ? getEase("power2.inOut")(local)
                : ease(local);
            cloud = lerpClouds(from, to, eased);
          }
          if (cloud?.positions) inst.setHomes(cloud.positions, cloud.colors);

          const fx = floatOffsetX(w.floatFrom);
          const tx = floatOffsetX(w.floatTo);
          const mixed =
            w.kind === "hold" ? fx : fx + (tx - fx) * ease(local);
          floatSmoothRef.current += (mixed - floatSmoothRef.current) * 0.05;
          inst.setOptions?.({ xOffset: floatSmoothRef.current });
        }

        const section = sectionAtProgress(p);
        if (section && lastSectionRef.current !== section.id) {
          lastSectionRef.current = section.id;
          const over = section.particle || {};
          inst.setOptions?.({
            scale: over.scale ?? defaults.scale,
            cameraDistance: over.cameraDistance ?? defaults.cameraDistance,
            imageScale: over.imageScale ?? defaults.imageScale,
            fov: over.fov ?? defaults.fov,
            yOffset: over.yOffset ?? 0,
          });
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      instance?.destroy?.();
      instanceRef.current = null;
      cloudsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) {
    return <div className="so7ba-story-canvas so7ba-story-canvas--fallback" />;
  }

  return (
    <div className="so7ba-story-canvas" aria-hidden>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          touchAction: "none",
        }}
      />
    </div>
  );
}
