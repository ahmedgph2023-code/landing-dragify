"use client";

import { useEffect, useRef } from "react";
import { createParticleObject } from "./ParticleObject";
import { buildDissolveCloud, cloudAtProgress } from "./scroll-morph-driver";
import manifest from "./scroll-morph-manifest";

/** Public URL for the Studio image shipped under public/icons/nl3/particle/section-2 */
export const SECTION2_SCENE_SRC =
  "/icons/nl3/particle/section-2/assets/form-a.png";

/**
 * Scroll-driven Studio particles (NL3 partners / section-2).
 * progress is smoothed so scrubbing doesn't thrash the spring.
 * fit="panel" = half-column beside copy (pull camera back so hubs aren’t cropped).
 */
export default function ScrollMorphHero({
  progress = 0,
  src,
  className,
  style,
  windows,
  easing,
  fit = "full",
}) {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  const formsRef = useRef(null);
  const progressRef = useRef(progress);
  const smoothRef = useRef(progress);
  const windowsRef = useRef(windows);
  const easingRef = useRef(easing);
  const rafRef = useRef(0);
  progressRef.current = progress;
  windowsRef.current = windows;
  easingRef.current = easing;

  const assetSrc = src || SECTION2_SCENE_SRC;
  const scrollWindows = windows || manifest?.scroll?.windows;
  const scrollEasing = easing || manifest?.scroll?.easing || "power2.inOut";
  const particle = manifest?.particle || {};
  const panelFit = fit === "panel";

  function applyProgress(instance, p) {
    const forms = formsRef.current;
    if (!forms || !instance) return;
    const w = windowsRef.current || scrollWindows;
    const e = easingRef.current || scrollEasing;
    const cloud = cloudAtProgress(p, forms, w, e);
    if (cloud?.positions) instance.setHomes(cloud.positions, cloud.colors);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const instance = createParticleObject(
      { canvas },
      {
        count: particle.count ?? 90000,
        size: particle.size ?? 1.15,
        sizeVariance: particle.sizeVariance ?? 0.02,
        radius: particle.radius ?? 120,
        strength: particle.strength ?? 1.15,
        swirl: particle.swirl ?? 0.45,
        spring: Math.min(particle.spring ?? 1.45, 1.05),
        damping: Math.max(particle.damping ?? 0.42, 0.55),
        drift: particle.drift ?? 0.12,
        background: particle.background ?? "",
        scale: panelFit ? Math.min(particle.scale ?? 2.05, 2.1) : particle.scale ?? 3.5,
        xOffset: particle.xOffset ?? 0,
        yOffset: particle.yOffset ?? 0,
        floatIntensity: particle.floatIntensity ?? 0.35,
        rotationIntensity: Math.min(particle.rotationIntensity ?? 0.12, 0.08),
        floatSpeed: particle.floatSpeed ?? 0.9,
        fov: panelFit ? Math.max(particle.fov ?? 48, 52) : particle.fov ?? 48,
        cameraDistance: panelFit
          ? Math.max(particle.cameraDistance ?? 3.1, 3.85)
          : particle.cameraDistance ?? 3.1,
        cursorEnabled: particle.cursorEnabled ?? true,
        interactionMode: particle.interactionMode ?? "push",
        crispText: particle.crispText ?? true,
        rasterSize: particle.rasterSize ?? 1920,
        sampleJitter: particle.sampleJitter ?? 0,
        pointSoftness: particle.pointSoftness ?? 0,
        alphaThreshold: particle.alphaThreshold ?? 36,
        brightness: particle.brightness ?? 10,
        contrast: particle.contrast ?? 42,
        imageScale: panelFit
          ? Math.min(particle.imageScale ?? 1.15, 0.92)
          : particle.imageScale ?? 1.15,
        invertAlpha: particle.invertAlpha ?? false,
        src: assetSrc,
        orbit: false,
        zoom: false,
        autoRotate: false,
        initialFormation: false,
        onLoad: (api) => {
          if (!api) return;
          const homes = api.getHomes?.();
          const colors = api.getColors?.();
          if (!homes) return;
          const formA = {
            positions: homes,
            colors: colors || new Float32Array(homes.length),
          };
          const dissolve = buildDissolveCloud(formA, {
            scale: 1.35,
            seed: 1,
          });
          formsRef.current = { formA, dissolve };
          smoothRef.current = progressRef.current;
          applyProgress(api, smoothRef.current);
        },
      },
    );
    instanceRef.current = instance;

    const tick = () => {
      const inst = instanceRef.current;
      if (inst && formsRef.current) {
        const target = progressRef.current;
        const cur = smoothRef.current;
        const next = cur + (target - cur) * 0.085;
        smoothRef.current = Math.abs(target - next) < 0.0004 ? target : next;
        applyProgress(inst, smoothRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      instance?.destroy?.();
      instanceRef.current = null;
      formsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSrc, panelFit]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100%",
        overflow: "visible",
        background: "transparent",
        ...style,
      }}
    >
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
