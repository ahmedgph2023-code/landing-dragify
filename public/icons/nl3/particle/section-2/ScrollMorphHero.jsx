"use client";

import { useEffect, useRef } from "react";
import { createParticleObject } from "./ParticleObject";
import { buildDissolveCloud, cloudAtProgress } from "./scroll-morph-driver";
import manifest from "./scroll-morph-manifest";

const DEFAULT_SRC = "/icons/nl3/particle/section-2/assets/form-a.png";

/**
 * Scroll-driven Studio particles (NL3 / landing scroll stories).
 * @param {number} progress section-local 0..1
 */
export default function ScrollMorphHero({
  progress = 0,
  src,
  className,
  style,
  windows,
  easing,
}) {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  const formsRef = useRef(null);
  const progressRef = useRef(progress);
  const windowsRef = useRef(windows);
  const easingRef = useRef(easing);
  progressRef.current = progress;
  windowsRef.current = windows;
  easingRef.current = easing;

  const assetSrc = src || manifest?.forms?.[0]?.src || DEFAULT_SRC;
  const scrollWindows = windows || manifest?.scroll?.windows;
  const scrollEasing = easing || manifest?.scroll?.easing || "power2.inOut";
  const particle = manifest?.particle || {};

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
        spring: particle.spring ?? 1.45,
        damping: particle.damping ?? 0.42,
        drift: particle.drift ?? 0.12,
        background: particle.background ?? "",
        scale: particle.scale ?? 3.5,
        xOffset: particle.xOffset ?? 0,
        yOffset: particle.yOffset ?? 0,
        floatIntensity: particle.floatIntensity ?? 0.35,
        rotationIntensity: particle.rotationIntensity ?? 0.12,
        floatSpeed: particle.floatSpeed ?? 0.9,
        fov: particle.fov ?? 48,
        cameraDistance: particle.cameraDistance ?? 3.1,
        cursorEnabled: particle.cursorEnabled ?? true,
        interactionMode: particle.interactionMode ?? "push",
        crispText: particle.crispText ?? true,
        rasterSize: particle.rasterSize ?? 1920,
        sampleJitter: particle.sampleJitter ?? 0,
        pointSoftness: particle.pointSoftness ?? 0,
        alphaThreshold: particle.alphaThreshold ?? 36,
        brightness: particle.brightness ?? 10,
        contrast: particle.contrast ?? 42,
        imageScale: particle.imageScale ?? 1.15,
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
          const dissolve = buildDissolveCloud(formA, { scale: 2.35, seed: 1 });
          formsRef.current = { formA, dissolve };
          applyProgress(api, progressRef.current);
        },
      },
    );
    instanceRef.current = instance;

    return () => {
      instance?.destroy?.();
      instanceRef.current = null;
      formsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSrc]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || !formsRef.current) return;
    applyProgress(instance, progress);
  }, [progress, scrollWindows, scrollEasing]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100%",
        overflow: "hidden",
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
