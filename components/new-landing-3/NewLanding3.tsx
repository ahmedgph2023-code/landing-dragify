/**
 * New-Landing-3
 * Classic home `/` story as scroll-driven particle morphs.
 */

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NL3_TUNING, type ParticleStateId } from '../../config/newLanding3Scene';
import { CHOREO } from '../../lib/particles/choreography';
import { createPinnedScrollEngine } from '../../lib/particles/scrollEngine';
import { SO7BA_STORY } from '../../lib/so7ba-story';
import type { ProgressBus } from '../../lib/particles/types';
import { useLocalization } from '../../context/LocalizationContext';
import NL3Footer from './ui/NL3Footer';
import { NLThemeStyle } from '../new-landing/theme';
import { DebugPanel } from './ui/DebugPanel';
import { ImmersiveMenu } from './ui/ImmersiveMenu';
import { ProgressIndicator } from './ui/ProgressIndicator';
import { TextStates } from './ui/TextStates';

const So7baScrollCanvas = dynamic(() => import('../so7ba-story/So7baScrollCanvas'), {
  ssr: false,
});

function useLandingCopy() {
  const { t, language, isRTL } = useLocalization();
  return { t, language, isRTL };
}

export default function NewLanding3() {
  const { t, language, isRTL } = useLandingCopy();

  const storyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollApiRef = useRef<{ scrollToProgress: (p: number) => void } | null>(null);
  const bus = useMemo<ProgressBus>(
    () => ({ progress: 0, intro: 0, mouse: { x: 0, y: 0 } }),
    [],
  );

  const [progress, setProgress] = useState(0);
  const [intro, setIntro] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [targetsReady, setTargetsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugForceState, setDebugForceState] = useState<ParticleStateId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const onTargetsReady = useCallback(() => setTargetsReady(true), []);

  const particleCount = isMobile
    ? NL3_TUNING.particleCount.mobile
    : isTablet
      ? NL3_TUNING.particleCount.tablet
      : NL3_TUNING.particleCount.desktop;

  const ambientCount = isMobile
    ? NL3_TUNING.ambientCount.mobile
    : isTablet
      ? NL3_TUNING.ambientCount.tablet
      : NL3_TUNING.ambientCount.desktop;

  const bloom = isMobile
    ? NL3_TUNING.bloom.mobile
    : isTablet
      ? NL3_TUNING.bloom.tablet
      : NL3_TUNING.bloom.desktop;

  const dpr = isMobile
    ? NL3_TUNING.dpr.mobile
    : isTablet
      ? NL3_TUNING.dpr.tablet
      : NL3_TUNING.dpr.desktop;

  useEffect(() => {
    const mqM = window.matchMedia(`(max-width: ${NL3_TUNING.mobileMax}px)`);
    const mqT = window.matchMedia(`(max-width: ${NL3_TUNING.tabletMax}px)`);
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setIsMobile(mqM.matches);
      setIsTablet(mqT.matches && !mqM.matches);
      setReducedMotion(rm.matches);
    };
    sync();
    mqM.addEventListener('change', sync);
    mqT.addEventListener('change', sync);
    rm.addEventListener('change', sync);

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true), { timeout: 600 })
      : window.setTimeout(() => setReady(true), 180);

    return () => {
      mqM.removeEventListener('change', sync);
      mqT.removeEventListener('change', sync);
      rm.removeEventListener('change', sync);
      if (typeof idle === 'number') {
        window.cancelIdleCallback?.(idle);
        window.clearTimeout(idle);
      }
    };
  }, []);

  useEffect(() => {
    if (!storyRef.current || !stageRef.current || !ready) return;
    const engine = createPinnedScrollEngine({
      story: storyRef.current,
      stage: stageRef.current,
      bus,
      reducedMotion,
      onProgress: (p) => {
        setProgress(p);
        // Scroll owns the timeline — cancel cinematic intro so morph can run
        if (p > 0.01 && bus.intro < 1) {
          bus.intro = 1;
          setIntro(1);
        }
      },
    });
    scrollApiRef.current = { scrollToProgress: engine.scrollToProgress };
    return () => {
      scrollApiRef.current = null;
      engine.destroy();
    };
  }, [ready, reducedMotion, bus, language]);

  const jumpToSection = useCallback((index: number) => {
    const s = SO7BA_STORY.sections[index];
    if (!s) return;
    const mid = (s.range[0] + s.range[1]) * 0.5;
    scrollApiRef.current?.scrollToProgress(mid);
  }, []);

  const jumpToSectionId = useCallback((sectionId: string) => {
    const index = SO7BA_STORY.sections.findIndex((s) => s.id === sectionId);
    if (index < 0) return;
    jumpToSection(index);
  }, [jumpToSection]);

  // Particle assemble when targets ready; text intro can start slightly earlier on ready
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion) {
      bus.intro = 1;
      setIntro(1);
      return;
    }
    // Wait for targets if possible, but don't block forever
    if (!targetsReady) {
      const fallback = window.setTimeout(() => setTargetsReady(true), 2200);
      return () => window.clearTimeout(fallback);
    }
    let raf = 0;
    let cancelled = false;
    const start = performance.now();
    const duration = CHOREO.intro.duration * 1000;
    const tick = (now: number) => {
      if (cancelled) return;
      // User already scrolled — do not overwrite bus.intro
      if (bus.progress > 0.01) {
        bus.intro = 1;
        setIntro(1);
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      bus.intro = eased;
      setIntro(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [ready, targetsReady, reducedMotion, bus]);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      bus.mouse.x = x;
      bus.mouse.y = y;
      setMouse({ x, y });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reducedMotion, isMobile, bus]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === NL3_TUNING.debugShortcut && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        setDebugOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Reduced-motion fallback: skip canvas intro, mark ready for text
  useEffect(() => {
    if (ready && reducedMotion) {
      setTargetsReady(true);
      bus.intro = 1;
      setIntro(1);
    }
  }, [ready, reducedMotion, bus]);

  return (
    <>
      <Head>
        <title>Dragify AI - Deployment Made Intelligent</title>
        <meta name="description" content="Dragify AI - Deployment: Drag, Drop, and Drive Intelligent Decisions" />
        <meta name="theme-color" content="#05070a" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <NLThemeStyle />

      <div id="nl3-root" data-nl-theme="dark" data-vv-style="true" dir={isRTL ? 'rtl' : 'ltr'} className="nl3-root">
        <div className="nl3-vignette" aria-hidden />
        <div className="nl3-grain" aria-hidden />

        {/* VV chrome — brand mark + hamburger */}
        <div className={`nl3-top ${menuOpen ? 'is-menu-open' : ''}`}>
          <button
            type="button"
            className="nl3-logo"
            aria-label="Dragify home"
            onClick={() => jumpToSectionId('hero')}
          >
            <span className="nl3-logo-dash" aria-hidden />
            <span className="nl3-logo-word">DRAGIFY</span>
          </button>
          <button
            type="button"
            className={`nl3-menu ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <ImmersiveMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          t={t}
          onJumpToSection={jumpToSectionId}
        />

        <ProgressIndicator progress={progress} onJump={jumpToSection} />

        <div ref={storyRef} className="nl3-story" style={{ height: `${NL3_TUNING.scrollVh}vh` }}>
          <div ref={stageRef} className="nl3-stage">
            <div className="nl3-canvas">
              {ready && !reducedMotion ? (
                <So7baScrollCanvas
                  progress={progress}
                  reducedMotion={reducedMotion}
                  onReady={onTargetsReady}
                />
              ) : (
                <div className="nl3-canvas-fallback" />
              )}
            </div>

            <TextStates
              progress={progress}
              intro={intro}
              mouse={mouse}
              t={t}
              isMobile={isMobile}
              reducedMotion={reducedMotion}
            />

            <div className="nl3-scroll-hint" aria-hidden>
              <span
                className="nl3-scroll-label"
                style={{ opacity: intro > 0.97 && progress < 0.04 ? 1 : 0.08 }}
              >
                Scroll
              </span>
              <span
                className="nl3-scroll-arrow"
                style={{ opacity: intro > 0.97 && progress < 0.04 ? 1 : 0.08 }}
              >
                ↓
              </span>
            </div>
          </div>
        </div>

        <div id="story-end" className="nl3-end-cap" />

        <div className="nl3-footer-wrap">
          <NL3Footer />
        </div>
        <a
          className="nl3-fab"
          href="https://calendly.com/cloudilic"
          target="_blank"
          rel="noreferrer"
          aria-label="Book consultation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12h12M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <DebugPanel
          progress={progress}
          particleCount={particleCount}
          enabled={debugOpen}
          debugForceState={debugForceState}
          onForceState={setDebugForceState}
        />

        <style jsx global>{`
/* Virtual Verse–style visual system for /new-landing-3 (Dragify content) */

.nl3-root {
  --nl3-bg: #050708;
  --nl3-bg-pure: #04070a;
  --nl3-text: #ffffff;
  --nl3-dim: #9aa4a8;
  --nl3-glow: #2be9d1;
  --nl3-glow-bright: #38f5dd;
  --nl3-warm: #caa25a;
  --nl3-font: 'Sora', 'Plus Jakarta Sans', 'Cairo', ui-sans-serif, system-ui, sans-serif;
  --nl3-hud: 'Plus Jakarta Sans', 'Sora', ui-sans-serif, system-ui, sans-serif;
  --nl3-body: 'Plus Jakarta Sans', 'Cairo', ui-sans-serif, system-ui, sans-serif;
  background: var(--nl3-bg-pure);
  color: var(--nl3-text);
  font-family: var(--nl3-body);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  isolation: isolate;
}

html:has(.nl3-root),
body:has(.nl3-root) {
  background: var(--nl3-bg-pure);
  overflow-x: hidden;
}

.nl3-vignette {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(ellipse 58% 52% at 68% 42%, rgba(43, 233, 209, 0.11) 0%, transparent 60%),
    radial-gradient(ellipse 45% 40% at 72% 55%, rgba(91, 108, 255, 0.07) 0%, transparent 55%),
    radial-gradient(ellipse 95% 55% at 50% 100%, rgba(20, 80, 110, 0.22) 0%, transparent 55%),
    radial-gradient(ellipse 70% 55% at 72% 48%, rgba(10, 26, 26, 0.45) 0%, transparent 62%),
    radial-gradient(ellipse 90% 80% at 50% 50%, transparent 42%, rgba(4, 7, 10, 0.72) 100%);
}

.nl3-grain {
  position: fixed;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0.07;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

.nl3-top {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 220;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.05rem clamp(1rem, 3vw, 1.75rem);
  pointer-events: none;
}

.nl3-top.is-menu-open {
  opacity: 0;
  pointer-events: none;
}

.nl3-logo,
.nl3-menu {
  pointer-events: auto;
}

.nl3-logo {
  opacity: 1;
  border: 0;
  background: rgba(5, 10, 12, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  padding: 0.55rem 0.85rem 0.55rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(43, 233, 209, 0.28);
  filter: drop-shadow(0 0 16px rgba(43, 233, 209, 0.35));
  transition: opacity 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.nl3-logo:hover {
  border-color: rgba(43, 233, 209, 0.55);
  background: rgba(5, 14, 16, 0.55);
}

.nl3-logo-dash {
  display: block;
  width: 28px;
  height: 3px;
  border-radius: 2px;
  background: var(--nl3-glow);
  box-shadow: 0 0 14px rgba(43, 233, 209, 1), 0 0 28px rgba(43, 233, 209, 0.55);
}

.nl3-logo-word {
  font-family: var(--nl3-hud);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: #e8fff9;
  text-shadow: 0 0 18px rgba(43, 233, 209, 0.55);
}

.nl3-menu {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(43, 233, 209, 0.28);
  border-radius: 50%;
  background: rgba(5, 10, 12, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: grid;
  place-content: center;
  gap: 6px;
  cursor: pointer;
  position: relative;
  z-index: 221;
  box-shadow: 0 0 18px rgba(43, 233, 209, 0.2);
}

.nl3-menu span {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--nl3-glow);
  box-shadow: 0 0 12px rgba(46, 230, 197, 0.95);
  transition: transform 0.28s ease, opacity 0.2s ease;
}

.nl3-menu.is-open span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.nl3-menu.is-open span:nth-child(2) {
  opacity: 0;
}

.nl3-menu.is-open span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.nl3-ticks {
  position: fixed;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 35;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;
}

.nl3-tick {
  width: 9px;
  height: 9px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(46, 230, 197, 0.45);
  background: transparent;
  cursor: pointer;
  transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
}

.nl3-tick:hover {
  border-color: var(--nl3-glow-bright);
  transform: scale(1.15);
}

.nl3-tick.is-seen {
  border-color: rgba(46, 230, 197, 0.65);
  background: rgba(46, 230, 197, 0.18);
}

.nl3-tick.is-on {
  background: var(--nl3-glow);
  border-color: var(--nl3-glow-bright);
  box-shadow: 0 0 12px rgba(46, 230, 197, 0.95), 0 0 28px rgba(60, 255, 224, 0.35);
  transform: scale(1.3);
}

.nl3-story {
  position: relative;
  width: 100%;
}

.nl3-stage {
  position: relative;
  top: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--nl3-bg-pure);
}

.nl3-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.so7ba-story-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: auto;
}

.so7ba-story-canvas--fallback {
  background: radial-gradient(ellipse at 70% 45%, #0a1a1a 0%, #05070a 55%, #000 100%);
}

.nl3-canvas-fallback {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 75% 48%, #0a1a1a 0%, #05070a 55%, #000 100%);
}

.nl3-copy {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: grid;
  align-items: center;
  justify-items: stretch;
  padding: clamp(5.75rem, 11vh, 7.5rem) clamp(1.25rem, 4.2vw, 3.75rem) clamp(4rem, 8vh, 5.5rem);
  pointer-events: none;
  width: 100%;
  max-width: none;
  margin: 0;
  box-sizing: border-box;
}

.nl3-text-layer {
  grid-area: 1 / 1;
  width: min(560px, calc(50vw - 2rem));
  max-width: calc(50% - 1rem);
  will-change: opacity, transform;
  justify-self: start;
}

.nl3-text-hero {
  width: min(640px, 48%);
  max-width: 48%;
  align-self: start;
  margin-top: clamp(0.25rem, 2.2vh, 1.6rem);
  padding-bottom: 0;
}

.nl3-text-layer.is-copy-right {
  justify-self: end;
  text-align: left;
}

.nl3-text-layer.is-copy-right .nl3-ctas,
.nl3-text-layer.is-copy-right .nl3-logo-row,
.nl3-text-layer.is-copy-right .nl3-partner-board,
.nl3-text-layer.is-copy-right .nl3-avatar-row,
.nl3-text-layer.is-copy-right .nl3-chips,
.nl3-text-layer.is-copy-right .nl3-agent-cats,
.nl3-text-layer.is-copy-right .nl3-feature-grid,
.nl3-text-layer.is-copy-right .nl3-feature-list,
.nl3-text-layer.is-copy-right .nl3-steps,
.nl3-text-layer.is-copy-right .nl3-faq,
.nl3-text-layer.is-copy-right .nl3-faq-help,
.nl3-text-layer.is-copy-right .nl3-stats-focus,
.nl3-text-layer.is-copy-right .nl3-hero-apps {
  margin-inline-start: 0;
  margin-inline-end: 0;
}

.nl3-text-layer.is-copy-right .nl3-feature-card,
.nl3-text-layer.is-copy-right .nl3-feature-row,
.nl3-text-layer.is-copy-right .nl3-steps li,
.nl3-text-layer.is-copy-right .nl3-stat-focus {
  text-align: left;
}

.nl3-text-stats {
  width: min(960px, 94vw);
  padding-top: 1.5vh;
}

.nl3-text-stats .nl3-eyebrow-line,
.nl3-text-stats .nl3-stats-focus {
  margin-inline: auto;
}

.nl3-text-stats .nl3-eyebrow-line {
  justify-content: center;
}

.nl3-text-stats .nl3-title {
  text-align: center;
  max-width: 18ch;
  margin-inline: auto;
  line-height: 1.12;
}

.nl3-stats-sub {
  max-width: 54ch;
  margin-inline: auto;
  text-align: center;
  font-size: clamp(0.9rem, 1.25vw, 1.05rem);
  line-height: 1.6;
  color: rgba(168, 182, 198, 0.9);
}

.nl3-text-stats .nl3-stat-label {
  margin-inline: auto;
}

.nl3-copy.is-mobile {
  align-items: end;
  padding-bottom: 18vh;
}

.nl3-copy.is-mobile .nl3-text-layer {
  width: 100%;
  max-width: 100%;
  justify-self: stretch !important;
  text-align: left !important;
}

.nl3-copy.is-mobile .nl3-title-written {
  max-width: none;
  font-size: clamp(1.85rem, 7.2vw, 2.45rem);
}

.nl3-copy.is-mobile .nl3-text-partners {
  width: 100%;
}

.nl3-copy.is-mobile .nl3-partner-board {
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.nl3-copy.is-mobile .nl3-partner-tile:nth-child(7) {
  max-width: 100%;
}

.nl3-eyebrow {
  margin: 0 0 1.1rem;
  font-family: var(--nl3-hud);
  font-size: 0.7rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #5ef0d4;
  font-weight: 600;
  text-shadow: 0 0 18px rgba(43, 233, 209, 0.5);
}

.nl3-eyebrow-line {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
}

.nl3-line {
  width: 22px;
  height: 1px;
  background: var(--nl3-glow);
  box-shadow: 0 0 8px rgba(43, 233, 209, 0.8);
}

.nl3-title {
  margin: 0;
  font-family: var(--nl3-font);
  font-size: clamp(2.65rem, 5.8vw, 4.75rem);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: #ffffff;
  text-shadow:
    0 0 18px rgba(255, 255, 255, 0.35),
    0 0 42px rgba(43, 233, 209, 0.35),
    0 0 80px rgba(43, 233, 209, 0.18);
}

.nl3-title-written {
  font-size: clamp(2.35rem, 4.85vw, 3.85rem);
  line-height: 1.12;
  letter-spacing: -0.032em;
  font-weight: 700;
  max-width: 11.5ch;
  text-shadow: 0 2px 24px rgba(8, 18, 40, 0.5);
}

.nl3-title-written .nl3-title-line {
  display: block;
  overflow: visible;
  margin-bottom: 0.02em;
}

.nl3-title-written .nl3-title-line-inner {
  display: inline-block;
  transform-origin: left center;
}

.nl3-write-mark {
  background: linear-gradient(105deg, #6ea0ff 0%, #8b6cff 42%, #c084fc 78%, #6ea0ff 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: none !important;
  box-shadow: none;
  border: 0;
  outline: 0;
  animation: nl3-mark-shine 3.6s ease-in-out infinite;
}

.nl3-write-mark--violet {
  background: linear-gradient(105deg, #5b8cff 0%, #7c6bff 45%, #b388ff 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: none !important;
}

.nl3-write-mark--cyan {
  background: linear-gradient(105deg, #5ef0d4 0%, #38d6ff 48%, #5b9dff 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: none !important;
}

.nl3-write-mark.is-typing {
  animation: nl3-mark-shine 3.6s ease-in-out infinite;
}

.nl3-blinker {
  display: inline-block;
  margin-inline-start: 3px;
  color: #7aa8ff;
  font-weight: 500;
  vertical-align: baseline;
  animation: nl3-blink 1s step-start infinite;
}

@keyframes nl3-blink {
  50% {
    opacity: 0;
  }
}

@keyframes nl3-mark-shine {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nl3-blinker,
  .nl3-write-mark,
  .nl3-write-mark.is-typing {
    animation: none;
  }

  .nl3-avatar-row::before {
    animation: none;
  }
}

.nl3-title-sm {
  font-size: clamp(1.9rem, 3.9vw, 3.1rem);
}

.nl3-title-line {
  display: block;
}

.nl3-grad,
.nl3-accent {
  color: var(--nl3-glow-bright);
  text-shadow:
    0 0 16px rgba(56, 245, 221, 0.85),
    0 0 36px rgba(43, 233, 209, 0.55),
    0 0 70px rgba(43, 233, 209, 0.3);
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
  filter: none;
}

.nl3-how-mark {
  background: linear-gradient(100deg, #5ef0d4 0%, #2be9d1 45%, #7dffb0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: none;
}

.nl3-workflow-mark {
  background: linear-gradient(100deg, #00f2fe 0%, #3ee9c8 48%, #4ade80 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
}

.nl3-title-agents {
  max-width: 14ch;
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.nl3-sub {
  margin: 1.2rem 0 0;
  font-family: var(--nl3-body);
  font-size: clamp(0.95rem, 1.4vw, 1.08rem);
  line-height: 1.65;
  color: var(--nl3-dim);
  max-width: 42ch;
}

.nl3-text-hero .nl3-sub {
  max-width: 54ch;
  font-size: clamp(0.98rem, 1.35vw, 1.12rem);
  line-height: 1.65;
}

.nl3-text-hero .nl3-btn-ghost {
  border-color: rgba(46, 230, 197, 0.72);
  box-shadow: 0 0 20px rgba(43, 233, 209, 0.18);
  color: #e8fffb;
}

.nl3-text-hero .nl3-btn-ghost:hover {
  border-color: rgba(94, 240, 212, 1);
  color: #c9fff4;
  background: rgba(46, 230, 197, 0.08);
}

.nl3-text-hero .nl3-btn-play {
  border-color: rgba(46, 230, 197, 0.9);
}

.nl3-text-hero .nl3-btn-play::before {
  border-color: transparent transparent transparent #5ef0d4;
}

.nl3-text-hero .nl3-ctas {
  margin-top: 1.9rem;
  gap: 1rem;
}

.nl3-text-hero .nl3-hero-awards {
  margin-top: 1.35rem;
  gap: 1.25rem;
}

.nl3-sub strong,
.nl3-sub b {
  color: #e8f7f3;
  font-weight: 600;
}

.nl3-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.75rem;
  pointer-events: auto;
}

.nl3-btn {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-family: var(--nl3-hud);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-transform: none;
  text-decoration: none;
  color: #f5fffc;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: transparent;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
}

.nl3-btn:hover {
  transform: translateY(-2px);
}

.nl3-btn-primary {
  border: none;
  background: linear-gradient(90deg, #3a59eb 0%, #6d5cff 48%, #8b5cf6 100%);
  color: #ffffff;
  box-shadow: 0 8px 28px rgba(58, 89, 235, 0.38);
}

.nl3-btn-primary:hover {
  box-shadow: 0 10px 32px rgba(58, 89, 235, 0.48);
}

.nl3-btn-ico {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.18);
  line-height: 1;
}

.nl3-btn-ghost {
  border-color: rgba(46, 230, 197, 0.45);
  background: transparent;
  box-shadow: 0 0 18px rgba(43, 233, 209, 0.12);
}

.nl3-btn-ghost:hover {
  border-color: rgba(46, 230, 197, 0.85);
  color: #c9fff4;
}

.nl3-btn-play {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(46, 230, 197, 0.7);
  position: relative;
  flex: 0 0 auto;
}

.nl3-btn-play::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 5px;
  border-style: solid;
  border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent var(--nl3-glow);
}

.nl3-sub-mark {
  color: var(--nl3-glow-bright, #5ef0d4);
  text-shadow: 0 0 14px rgba(43, 233, 209, 0.45);
  font-weight: 600;
}

.nl3-btn-warm {
  margin-top: 1.5rem;
  border-color: rgba(201, 148, 74, 0.75);
  box-shadow: 0 0 16px rgba(201, 148, 74, 0.22);
  display: inline-flex;
}

.nl3-fine {
  margin: 1rem 0 0;
  font-size: 0.78rem;
  color: rgba(154, 163, 168, 0.85);
}

.nl3-list {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-width: 38ch;
}

.nl3-list li {
  position: relative;
  padding-inline-start: 1rem;
  font-size: 0.88rem;
  line-height: 1.4;
  color: rgba(220, 235, 230, 0.85);
}

.nl3-list li::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--nl3-glow);
  box-shadow: 0 0 8px rgba(46, 230, 197, 0.8);
}

.nl3-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  max-width: 42ch;
}

.nl3-chips-integrations {
  max-width: 36ch;
  gap: 0.55rem;
}

.nl3-chip {
  font-family: var(--nl3-hud);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.48rem 0.85rem;
  border: 1px solid rgba(46, 230, 197, 0.22);
  border-radius: 999px;
  color: rgba(186, 198, 210, 0.88);
  background: rgba(8, 12, 18, 0.45);
}

.nl3-chip strong {
  color: var(--nl3-glow);
  font-weight: 600;
  margin-inline-end: 0.25rem;
}

.nl3-chip.is-on-chip {
  border-color: rgba(74, 222, 128, 0.55);
  color: #7dffb0;
  background: rgba(12, 32, 22, 0.72);
  box-shadow: 0 0 16px rgba(74, 222, 128, 0.18);
}

.nl3-chip.is-off-chip {
  border-color: rgba(148, 163, 184, 0.28);
  color: rgba(168, 182, 198, 0.85);
  background: transparent;
}

.nl3-hero-apps {
  display: flex;
  gap: 0.45rem;
  margin-top: 1.2rem;
  align-items: center;
}

.nl3-hero-awards {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.1rem;
  margin-top: 1.15rem;
}

.nl3-hero-rail {
  position: absolute;
  left: clamp(1.1rem, 3.5vw, 3.2rem);
  right: clamp(2.6rem, 5vw, 4rem);
  bottom: clamp(1.35rem, 3.2vh, 2.25rem);
  z-index: 6;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

.nl3-hero-rail-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-height: 118px;
  padding: 0.85rem 0.9rem 0.95rem;
  border-radius: 14px;
  border: 1px solid rgba(46, 230, 197, 0.28);
  background: rgba(4, 8, 14, 0.72);
  box-shadow:
    0 0 22px rgba(43, 233, 209, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  will-change: opacity, transform, filter;
  transition: border-color 0.2s ease;
}

.nl3-hero-rail-ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #5ef0d4;
  border: 1px solid rgba(46, 230, 197, 0.45);
  background: rgba(4, 14, 20, 0.8);
  box-shadow: 0 0 14px rgba(46, 230, 197, 0.22);
  margin-bottom: 0.15rem;
}

.nl3-hero-rail-card:nth-child(3) .nl3-hero-rail-ico,
.nl3-hero-rail-card:nth-child(5) .nl3-hero-rail-ico {
  color: #b388ff;
  border-color: rgba(155, 108, 255, 0.5);
  box-shadow: 0 0 14px rgba(155, 108, 255, 0.28);
}

.nl3-hero-rail-card strong {
  font-family: var(--nl3-hud);
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f4fffb;
  line-height: 1.25;
}

.nl3-hero-rail-card p {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.4;
  color: rgba(168, 182, 198, 0.9);
}

.nl3-copy.is-mobile .nl3-hero-rail {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  bottom: 0.85rem;
  right: 1rem;
  left: 1rem;
}

.nl3-copy.is-mobile .nl3-hero-rail-card:nth-child(5) {
  grid-column: 1 / -1;
}

@media (max-width: 1100px) {
  .nl3-hero-rail-card p {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.nl3-award {
  display: inline-flex;
  line-height: 0;
  opacity: 0.95;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.nl3-award:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.nl3-award img {
  width: auto;
  height: clamp(52px, 7vw, 78px);
}

.nl3-app-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(46, 230, 197, 0.06);
  border: 1px solid rgba(46, 230, 197, 0.2);
  display: grid;
  place-items: center;
  overflow: hidden;
}

.nl3-logo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1.15rem;
  max-width: 44ch;
  align-items: center;
}

.nl3-logo-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.7rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(46, 230, 197, 0.16);
  min-height: 44px;
}

.nl3-partners-sub {
  max-width: 42ch;
  color: rgba(186, 200, 214, 0.9);
  line-height: 1.6;
  font-size: clamp(0.92rem, 1.25vw, 1.05rem);
  margin-top: 0.85rem;
}

.nl3-text-partners {
  width: min(520px, calc(48vw - 1.5rem));
  max-width: calc(48% - 0.75rem);
  align-self: center;
  padding-top: clamp(0.5rem, 2vh, 1.5rem);
}

.nl3-text-partners .nl3-title-sm {
  font-size: clamp(2.1rem, 4.1vw, 3.35rem);
  line-height: 1.12;
  max-width: 12ch;
  letter-spacing: -0.03em;
}

.nl3-text-partners .nl3-eyebrow {
  margin-bottom: 0.95rem;
}

.nl3-partner-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 1.55rem;
  width: min(100%, 440px);
}

.nl3-partner-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 78px;
  height: 78px;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  background: rgba(4, 10, 18, 0.72);
  border: 1px solid rgba(46, 230, 197, 0.32);
  box-shadow:
    0 0 20px rgba(43, 233, 209, 0.1),
    0 8px 24px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
}

.nl3-partner-tile:hover {
  border-color: rgba(94, 240, 212, 0.55);
  background: rgba(8, 18, 28, 0.82);
  box-shadow:
    0 0 28px rgba(43, 233, 209, 0.18),
    0 10px 28px rgba(0, 0, 0, 0.34);
}

.nl3-partner-tile:nth-child(7) {
  grid-column: 1 / -1;
  max-width: 52%;
  justify-self: center;
}

.nl3-partner-logo-img {
  width: auto !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 52px !important;
  object-fit: contain !important;
  object-position: center !important;
  /* Partner cards from /icons/nl3/partners keep original colors */
  filter: none;
  opacity: 0.95;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.nl3-partner-tile:hover .nl3-partner-logo-img {
  filter: none;
  opacity: 1;
  transform: scale(1.03);
}

.nl3-partner-tile.is-color .nl3-partner-logo-img,
.nl3-partner-tile.is-color:hover .nl3-partner-logo-img {
  filter: none;
  opacity: 1;
}

.nl3-btn-partners {
  border-radius: 999px;
  border-color: rgba(46, 230, 197, 0.65) !important;
  color: #e8fffb;
  box-shadow: 0 0 18px rgba(43, 233, 209, 0.2);
  padding: 0.9rem 1.65rem;
  letter-spacing: 0.01em;
}

.nl3-btn-partners:hover {
  border-color: rgba(94, 240, 212, 0.95) !important;
  color: #c9fff4;
  background: rgba(43, 233, 209, 0.08);
  box-shadow: 0 0 26px rgba(43, 233, 209, 0.3);
}

.nl3-logo-row-apps {
  gap: 0.55rem;
  margin-top: 1.35rem;
}

.nl3-app-tile {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(6, 12, 20, 0.72);
  border: 1px solid rgba(46, 230, 197, 0.32);
  box-shadow:
    0 0 16px rgba(43, 233, 209, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
}

.nl3-app-tile:hover {
  border-color: rgba(94, 240, 212, 0.6);
  box-shadow: 0 0 22px rgba(43, 233, 209, 0.28);
  transform: translateY(-1px);
}

.nl3-integrations-sub {
  max-width: 42ch;
  color: rgba(168, 182, 198, 0.92);
  line-height: 1.55;
}

.nl3-title-integrations {
  max-width: 16ch;
  line-height: 1.12;
}

.nl3-btn-integrations {
  border-radius: 12px;
  border-color: rgba(220, 230, 240, 0.45);
  box-shadow: none;
  padding: 0.9rem 1.5rem;
}

.nl3-btn-integrations:hover {
  border-color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.08);
}

.nl3-feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin-top: 1.1rem;
  max-width: 380px;
}

.nl3-feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 1.45rem;
  width: 100%;
  max-width: min(100%, 520px);
}

.nl3-features-sub {
  max-width: 42ch;
  color: rgba(168, 182, 198, 0.92);
  line-height: 1.55;
}

.nl3-feature-row {
  display: grid;
  grid-template-columns: 52px 1fr 36px;
  gap: 0.85rem;
  align-items: center;
  padding: 0.9rem 0.95rem;
  border-radius: 14px;
  border: 1px solid rgba(46, 230, 197, 0.18);
  background: rgba(6, 12, 22, 0.58);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 0 16px rgba(43, 233, 209, 0.05),
    0 10px 28px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(12px);
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.nl3-feature-row:hover,
.nl3-feature-row.is-active {
  border-color: rgba(46, 230, 197, 0.4);
  background: rgba(8, 18, 32, 0.72);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 28px rgba(43, 233, 209, 0.14),
    0 12px 32px rgba(0, 0, 0, 0.32);
}

.nl3-feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #5ef0d4;
  background: rgba(8, 16, 28, 0.9);
  border: 1px solid rgba(46, 230, 197, 0.42);
  box-shadow: 0 0 16px rgba(43, 233, 209, 0.2);
  flex: 0 0 auto;
}

.nl3-feature-icon img {
  width: 24px;
  height: 24px;
  filter: brightness(0) saturate(100%) invert(84%) sepia(28%) saturate(900%) hue-rotate(113deg) brightness(102%);
}

.nl3-feature-copy {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  min-width: 0;
}

.nl3-feature-go {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: rgba(94, 240, 212, 0.85);
  border: 1px solid rgba(46, 230, 197, 0.35);
  background: rgba(8, 18, 28, 0.65);
  box-shadow: 0 0 12px rgba(43, 233, 209, 0.12);
  transition: border-color 0.22s ease, color 0.22s ease, box-shadow 0.22s ease;
}

.nl3-feature-row:hover .nl3-feature-go,
.nl3-feature-row.is-active .nl3-feature-go {
  border-color: rgba(94, 240, 212, 0.7);
  color: #c9fff4;
  box-shadow: 0 0 18px rgba(43, 233, 209, 0.28);
}

.nl3-feature-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: rgba(200, 220, 215, 0.88);
  padding: 0.55rem;
  border: 1px solid rgba(46, 230, 197, 0.16);
  border-radius: 12px;
  background: rgba(5, 12, 12, 0.45);
}

.nl3-feature-card strong,
.nl3-feature-copy strong {
  font-size: 0.98rem;
  line-height: 1.25;
  color: #f5fffc;
  font-family: var(--nl3-hud);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.nl3-feature-desc {
  font-size: 0.84rem;
  line-height: 1.45;
  color: rgba(168, 182, 198, 0.92);
}

.nl3-hero-media {
  margin-bottom: 0.35rem;
}

.nl3-hero-robot {
  display: none;
}

.nl3-avatar-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin: 1.35rem 0 0.75rem;
  position: relative;
}

.nl3-avatar-row::before {
  content: '';
  position: absolute;
  left: 26px;
  right: 26px;
  top: 50%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(46, 230, 197, 0.25) 12%,
    rgba(94, 240, 212, 0.75) 50%,
    rgba(46, 230, 197, 0.25) 88%,
    transparent
  );
  box-shadow: 0 0 12px rgba(43, 233, 209, 0.45);
  z-index: 0;
  pointer-events: none;
  animation: nl3-avatar-pulse 2.8s ease-in-out infinite;
}

@keyframes nl3-avatar-pulse {
  0%,
  100% {
    opacity: 0.65;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.35);
  }
}

.nl3-avatar {
  position: relative;
  z-index: 1;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(46, 230, 197, 0.6);
  box-shadow:
    0 0 18px rgba(46, 230, 197, 0.4),
    0 0 32px rgba(43, 233, 209, 0.16);
  line-height: 0;
  background: rgba(4, 10, 12, 0.9);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.nl3-avatar:hover {
  transform: scale(1.06);
  border-color: rgba(94, 240, 212, 0.9);
  box-shadow:
    0 0 22px rgba(46, 230, 197, 0.55),
    0 0 40px rgba(43, 233, 209, 0.22);
}

.nl3-avatar img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

.nl3-agents-sub {
  max-width: 44ch;
  color: rgba(168, 182, 198, 0.92);
  line-height: 1.6;
}

.nl3-agent-cats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem 0.7rem;
  margin-top: 1rem;
  max-width: 460px;
}

.nl3-agent-cat {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.55rem;
  text-align: left;
  padding: 0.78rem 1rem;
  border-radius: 999px;
  font-family: var(--nl3-hud);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(214, 236, 232, 0.95);
  background: rgba(4, 8, 14, 0.55);
  border: 1px solid rgba(46, 230, 197, 0.22);
  box-shadow:
    0 0 12px rgba(43, 233, 209, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
}

.nl3-agent-cat:hover {
  border-color: rgba(94, 240, 212, 0.55);
  background: rgba(10, 20, 32, 0.78);
  box-shadow: 0 0 22px rgba(43, 233, 209, 0.18);
  transform: translateY(-1px);
}

.nl3-agent-cat-ico {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: #5ef0d4;
  filter: drop-shadow(0 0 6px rgba(43, 233, 209, 0.45));
}

.nl3-agent-cat-ico svg {
  display: block;
}

.nl3-stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  max-width: 420px;
}

.nl3-stats-focus {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.85rem, 3vw, 2.25rem);
  margin-top: clamp(2.75rem, 7vh, 4.5rem);
  width: 100%;
}

.nl3-stat-focus {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.95rem;
  min-width: 0;
}

.nl3-stat-ring-slot {
  display: grid;
  place-items: center;
  width: min(100%, 210px);
  aspect-ratio: 1;
  margin-inline: auto;
}

.nl3-stat-neon {
  display: block;
  font-family: var(--nl3-hud);
  font-size: clamp(2.75rem, 6.8vw, 4.6rem);
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 0.95;
  color: #eafffb;
  background: linear-gradient(180deg, #f5fffc 0%, #5ef0d4 55%, #2be9d1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 14px rgba(43, 233, 209, 0.85)) drop-shadow(0 0 36px rgba(43, 233, 209, 0.4));
}

.nl3-stat-label {
  display: block;
  font-family: var(--nl3-hud);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  line-height: 1.45;
  text-align: center;
  color: rgba(236, 248, 245, 0.92);
  max-width: 13rem;
}

.nl3-stat-card {
  padding: 0.15rem 0;
  border: 0;
  background: transparent;
  text-align: start;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.85rem 1rem;
  align-items: baseline;
}

.nl3-stat-card strong {
  display: block;
  font-family: var(--nl3-hud);
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
  color: #ffffff;
  text-shadow:
    0 0 18px rgba(46, 230, 197, 0.75),
    0 0 40px rgba(60, 255, 224, 0.35);
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
}

.nl3-stat-card span {
  display: block;
  margin-top: 0;
  font-family: var(--nl3-hud);
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.35;
  color: rgba(230, 245, 242, 0.88);
}

.nl3-title-how {
  max-width: 16ch;
  line-height: 1.14;
}

.nl3-steps {
  margin: 1.45rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 46ch;
}

.nl3-steps li {
  display: flex;
  gap: 0.95rem;
  align-items: flex-start;
  padding: 1rem 1.05rem;
  border-radius: 16px;
  background: rgba(6, 12, 20, 0.55);
  border: 1px solid rgba(46, 230, 197, 0.16);
  box-shadow:
    0 0 22px rgba(43, 233, 209, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
}

.nl3-steps li:hover {
  border-color: rgba(46, 230, 197, 0.32);
  box-shadow: 0 0 28px rgba(43, 233, 209, 0.12);
}

.nl3-step-num {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  margin-top: 0.05rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--nl3-hud);
  font-size: 0.82rem;
  font-weight: 700;
  color: #5ef0d4;
  background: rgba(8, 18, 28, 0.85);
  border: 1.5px solid rgba(46, 230, 197, 0.7);
  box-shadow: 0 0 16px rgba(46, 230, 197, 0.4);
}

.nl3-step-copy {
  min-width: 0;
}

.nl3-steps strong {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f5fffc;
}

.nl3-steps p {
  margin: 0.35rem 0 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: rgba(168, 182, 198, 0.92);
}

.nl3-faq {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: 48ch;
}

.nl3-faq-sub {
  max-width: 42ch;
  color: rgba(168, 182, 198, 0.92);
  line-height: 1.55;
}

.nl3-title-faq {
  max-width: 16ch;
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.nl3-faq-item {
  border: 1px solid rgba(46, 230, 197, 0.2);
  border-radius: 14px;
  background: rgba(6, 12, 20, 0.58);
  padding: 0.1rem 0.3rem;
  box-shadow:
    0 0 18px rgba(43, 233, 209, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
}

.nl3-faq-item:hover,
.nl3-faq-item[open] {
  border-color: rgba(46, 230, 197, 0.38);
  box-shadow: 0 0 26px rgba(43, 233, 209, 0.12);
}

.nl3-faq-item summary {
  cursor: pointer;
  display: grid;
  grid-template-columns: 36px 1fr 22px;
  gap: 0.7rem;
  align-items: center;
  padding: 0.8rem 0.6rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #f2fffb;
  list-style: none;
}

.nl3-faq-item summary::-webkit-details-marker {
  display: none;
}

.nl3-faq-ico {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1.5px solid rgba(46, 230, 197, 0.55);
  box-shadow: 0 0 14px rgba(46, 230, 197, 0.3);
  background: rgba(4, 14, 20, 0.85);
  position: relative;
}

.nl3-faq-ico::before {
  content: '';
  display: block;
  background: var(--nl3-glow);
  opacity: 0.95;
}

.nl3-faq-ico-0::before {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  box-shadow: 0 0 0 2px rgba(4, 14, 20, 1), 0 0 0 3.5px var(--nl3-glow);
}

.nl3-faq-ico-1::before {
  width: 12px;
  height: 8px;
  border-radius: 2px 2px 0 0;
  clip-path: polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%);
}

.nl3-faq-ico-2::before {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  box-shadow:
    8px 0 0 -3px var(--nl3-glow),
    -8px 0 0 -3px var(--nl3-glow),
    0 8px 0 -3px var(--nl3-glow);
}

.nl3-faq-ico-3::before {
  width: 12px;
  height: 5px;
  border-radius: 99px;
  box-shadow: 0 6px 0 0 var(--nl3-glow);
  transform: rotate(-25deg);
}

.nl3-faq-q {
  text-align: start;
  line-height: 1.35;
}

.nl3-faq-plus {
  color: #5ef0d4;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  transition: transform 0.2s ease;
  text-shadow: 0 0 10px rgba(43, 233, 209, 0.55);
}

.nl3-faq-item[open] .nl3-faq-plus {
  transform: rotate(45deg);
}

.nl3-faq-item p {
  margin: 0 0.6rem 0.85rem 3.5rem;
  font-size: 0.84rem;
  line-height: 1.55;
  color: rgba(168, 182, 198, 0.95);
}

.nl3-faq-help {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.85rem;
  align-items: center;
  max-width: 48ch;
  padding: 0.85rem 0.95rem;
  border-radius: 16px;
  border: 1px solid rgba(46, 230, 197, 0.22);
  background: rgba(6, 12, 20, 0.62);
  box-shadow: 0 0 24px rgba(43, 233, 209, 0.08);
  backdrop-filter: blur(10px);
}

.nl3-faq-help-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid rgba(46, 230, 197, 0.5);
  box-shadow: 0 0 16px rgba(46, 230, 197, 0.3);
  line-height: 0;
  flex: 0 0 auto;
}

.nl3-faq-help-copy {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.45;
  color: rgba(200, 214, 220, 0.92);
}

.nl3-faq-help-btn {
  white-space: nowrap;
  padding: 0.55rem 0.95rem !important;
  font-size: 0.78rem !important;
  border-radius: 999px !important;
  display: inline-flex !important;
  align-items: center;
  gap: 0.4rem;
}

.nl3-faq-help-chat {
  width: 14px;
  height: 12px;
  border: 1.5px solid currentColor;
  border-radius: 4px 4px 4px 1px;
  position: relative;
  opacity: 0.9;
  flex: 0 0 auto;
}

.nl3-faq-help-chat::after {
  content: '';
  position: absolute;
  left: 3px;
  bottom: -4px;
  width: 5px;
  height: 5px;
  border-left: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(-40deg);
}

.nl3-copy.is-mobile .nl3-faq-help {
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
}

.nl3-copy.is-mobile .nl3-faq-help-btn {
  grid-column: 1 / -1;
  justify-self: start;
}

.nl3-copy.is-mobile .nl3-feature-grid,
.nl3-copy.is-mobile .nl3-feature-list,
.nl3-copy.is-mobile .nl3-stats-grid,
.nl3-copy.is-mobile .nl3-stats-focus {
  max-width: 100%;
}

.nl3-copy.is-mobile .nl3-stats-grid,
.nl3-copy.is-mobile .nl3-stats-focus {
  grid-template-columns: 1fr;
}

.nl3-scroll-hint {
  position: absolute;
  bottom: clamp(1.75rem, 4vh, 2.75rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 7;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  pointer-events: none;
}

.nl3-scroll-label {
  font-family: var(--nl3-hud);
  font-size: 0.68rem;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(94, 240, 212, 0.82);
  text-shadow: 0 0 12px rgba(43, 233, 209, 0.45);
}

.nl3-scroll-arrow {
  display: block;
  font-size: 0.85rem;
  line-height: 1;
  color: rgba(94, 240, 212, 0.85);
  animation: nl3-scroll-bounce 1.6s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(43, 233, 209, 0.55);
}

.nl3-scroll-line {
  display: block;
  width: 1px;
  height: 36px;
  background: linear-gradient(180deg, var(--nl3-glow), transparent);
  animation: nl3-scroll-pulse 1.6s ease-in-out infinite;
}

@keyframes nl3-scroll-bounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.55;
  }
  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}

@keyframes nl3-scroll-pulse {
  0%,
  100% {
    transform: scaleY(0.55);
    opacity: 0.35;
    transform-origin: top;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
    transform-origin: top;
  }
}

.nl3-fab {
  position: fixed;
  right: 1.15rem;
  bottom: 1.2rem;
  z-index: 35;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: var(--nl3-glow);
  text-decoration: none;
  border: 1px solid rgba(46, 230, 197, 0.45);
  border-radius: 50%;
  background: rgba(5, 12, 12, 0.55);
  filter: drop-shadow(0 0 12px rgba(46, 230, 197, 0.55));
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.nl3-fab:hover {
  transform: scale(1.06);
  border-color: var(--nl3-glow-bright);
  box-shadow: 0 0 22px rgba(46, 230, 197, 0.45);
}

.nl3-end-cap {
  height: 1px;
}

.nl3-footer-wrap {
  position: relative;
  z-index: 20;
  background:
    radial-gradient(ellipse 55% 45% at 32% 55%, rgba(43, 233, 209, 0.07) 0%, transparent 58%),
    radial-gradient(ellipse 40% 40% at 28% 70%, rgba(120, 80, 255, 0.08) 0%, transparent 60%),
    linear-gradient(180deg, #040608 0%, #030506 45%, #020304 100%);
  isolation: isolate;
  border-top: 1px solid rgba(43, 233, 209, 0.12);
  overflow: hidden;
}

.nl3f {
  position: relative;
  padding: 4.75rem 0 2.1rem;
  color: rgba(210, 230, 224, 0.88);
  min-height: 520px;
}

.nl3f-portal {
  position: absolute;
  left: -4%;
  top: 8%;
  width: min(58%, 680px);
  height: 78%;
  z-index: 0;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 70% 65% at 45% 48%, #000 20%, transparent 78%);
}

.nl3f-portal-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.nl3f-inner {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 0 auto;
  padding-inline: clamp(1.25rem, 3vw, 2rem);
}

.nl3f-top {
  display: flex;
  justify-content: space-between;
  gap: clamp(2rem, 5vw, 4rem);
  padding-bottom: 2.75rem;
  border-bottom: 1px solid rgba(43, 233, 209, 0.14);
}

.nl3f-brand {
  max-width: 280px;
  flex: 0 0 auto;
  position: relative;
  z-index: 2;
}

.nl3f-tagline {
  margin: 0.9rem 0 1.25rem;
  font-size: 0.92rem;
  line-height: 1.55;
  color: rgba(180, 205, 200, 0.78);
}

.nl3f-mark {
  background: linear-gradient(100deg, #00f2fe 0%, #5b8cff 45%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
}

.nl3f-socials {
  display: flex;
  gap: 0.55rem;
}

.nl3f-socials a {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: rgba(220, 240, 235, 0.88);
  background: rgba(8, 14, 20, 0.72);
  border: 1px solid rgba(43, 233, 209, 0.22);
  box-shadow: 0 0 14px rgba(43, 233, 209, 0.08);
  backdrop-filter: blur(8px);
  transition: border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.nl3f-socials a:hover {
  color: #fff !important;
  border-color: rgba(43, 233, 209, 0.55) !important;
  box-shadow: 0 0 18px rgba(43, 233, 209, 0.28);
}

.nl3f-cols {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1.1rem, 2.5vw, 2rem);
  flex: 1;
  max-width: 760px;
}

.nl3f-col-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  margin-bottom: 0.95rem;
}

.nl3f-col-ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #5ef0d4;
  background: rgba(6, 14, 20, 0.65);
  border: 1px solid rgba(46, 230, 197, 0.35);
  box-shadow: 0 0 16px rgba(46, 230, 197, 0.22);
}

.nl3f-col-title {
  margin: 0;
  font-family: var(--nl3-hud);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #7ff5df;
  text-shadow: 0 0 12px rgba(43, 233, 209, 0.4);
}

.nl3f-col-rule {
  display: block;
  width: 100%;
  max-width: 92px;
  height: 1px;
  background: linear-gradient(90deg, rgba(46, 230, 197, 0.75), rgba(46, 230, 197, 0.05));
  position: relative;
}

.nl3f-col-rule::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  transform: translate(-20%, -50%);
  background: #5ef0d4;
  box-shadow: 0 0 10px rgba(46, 230, 197, 0.9);
}

.nl3f-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.72rem;
}

.nl3f-col li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nl3f-link-ico {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: rgba(94, 240, 212, 0.85);
  filter: drop-shadow(0 0 6px rgba(46, 230, 197, 0.45));
}

.nl3f-col a {
  font-size: 0.88rem;
  color: rgba(200, 220, 215, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nl3f-col a:hover {
  color: var(--nl3-glow) !important;
}

.nl3f-bottom {
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.nl3f-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
  font-size: 0.82rem;
  color: rgba(160, 185, 180, 0.72);
}

.nl3f-mini-mark {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(43, 233, 209, 0.35);
  background: rgba(6, 14, 16, 0.85);
  box-shadow: 0 0 14px rgba(43, 233, 209, 0.2);
  overflow: hidden;
  line-height: 0;
}

.nl3f-legal {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.82rem;
  color: rgba(160, 185, 180, 0.55);
}

.nl3f-legal a {
  color: rgba(190, 215, 210, 0.78);
  text-decoration: none;
}

.nl3f-legal a:hover {
  color: var(--nl3-glow) !important;
}

.nl3f-arrow {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  border: 1px solid rgba(43, 233, 209, 0.5);
  background: rgba(6, 14, 16, 0.75);
  box-shadow:
    0 0 0 5px rgba(43, 233, 209, 0.07),
    0 0 24px rgba(43, 233, 209, 0.35);
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.nl3f-arrow-ring {
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 1px dashed rgba(46, 230, 197, 0.35);
  box-shadow: 0 0 16px rgba(120, 90, 255, 0.18);
  pointer-events: none;
  animation: nl3f-spin 14s linear infinite;
}

@keyframes nl3f-spin {
  to {
    transform: rotate(360deg);
  }
}

.nl3f-arrow:hover {
  color: #fff !important;
  border-color: rgba(43, 233, 209, 0.85) !important;
  box-shadow:
    0 0 0 7px rgba(43, 233, 209, 0.12),
    0 0 30px rgba(43, 233, 209, 0.5);
  transform: translateX(2px);
}

@media (prefers-reduced-motion: reduce) {
  .nl3f-arrow-ring {
    animation: none;
  }
}

@media (max-width: 900px) {
  .nl3f {
    min-height: 0;
  }

  .nl3f-top {
    flex-direction: column;
  }

  .nl3f-cols {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: none;
  }

  .nl3f-portal {
    width: 90%;
    left: 5%;
    top: 0;
    height: 42%;
    opacity: 0.55;
  }
}

@media (max-width: 560px) {
  .nl3f-cols {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem 1rem;
  }

  .nl3f-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .nl3f-arrow {
    align-self: flex-end;
  }
}

.nl3-debug {
  position: fixed;
  left: 12px;
  bottom: 12px;
  z-index: 60;
  width: 220px;
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.88);
  border: 1px solid rgba(46, 230, 197, 0.35);
  color: #d7fff6;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.45;
}

.nl3-debug-title {
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: var(--nl3-glow);
}

.nl3-debug-section {
  margin-top: 0.55rem;
  opacity: 0.7;
}

.nl3-debug-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 0.35rem;
}

.nl3-debug-btns button {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 2px 6px;
  border-radius: 6px;
  cursor: pointer;
}

.nl3-debug-btns button.is-on {
  background: rgba(46, 230, 197, 0.22);
  border-color: rgba(46, 230, 197, 0.7);
}

.nl3-debug-hint {
  margin-top: 0.5rem;
  opacity: 0.5;
}

@media (max-width: 820px) {
  .nl3-ticks {
    right: 0.65rem;
  }
  .nl3-title {
    font-size: clamp(1.95rem, 8vw, 2.7rem);
  }
  .nl3-grain {
    opacity: 0.045;
  }
}

        `}</style>
      </div>
    </>
  );
}
