"use client";

import ParticleObject from "./ParticleObject";

/**
 * Drop-in hero exported from Particle Studio.
 * Keep this file next to ParticleObject.jsx.
 * Parent must not collapse height — this section is 100vh by default.
 *
 * Image: public/icons/nl3/particle/section-2/scene.png
 */
export default function MyParticleHero() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#050506",
      }}
    >
      <ParticleObject
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        src={"/icons/nl3/particle/section-2/scene.png"}
        count={90000}
        size={1.15}
        sizeVariance={0.02}
        color={""}
        radius={120}
        strength={1.15}
        swirl={0.45}
        spring={1.45}
        damping={0.42}
        drift={0.12}
        background={""}
        scale={3.5}
        xOffset={0}
        yOffset={0}
        floatIntensity={0.35}
        rotationIntensity={0.12}
        floatSpeed={0.9}
        orbit={false}
        zoom={false}
        autoRotate={false}
        autoRotateSpeed={2}
        fov={48}
        cameraDistance={3.1}
        cursorEnabled={true}
        interactionMode={"push"}
        initialFormation={true}
        formationDuration={0.85}
        formationStrength={0.65}
        crispText={true}
        rasterSize={1920}
        sampleJitter={0}
        pointSoftness={0}
        alphaThreshold={36}
        brightness={10}
        contrast={42}
        imageScale={1.15}
        invertAlpha={false}
      />
    </section>
  );
}
