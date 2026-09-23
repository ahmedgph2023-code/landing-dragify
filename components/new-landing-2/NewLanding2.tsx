/**
 * New-Landing-2
 *
 * Virtualverse-style continuous experience:
 * - ONE pinned fullscreen stage
 * - Tall spacer creates scroll distance
 * - Single scrubbed progress 0..1 drives camera + morphing sculpture + captions
 * - Existing /landing content reinterpreted as visual states (not card grids)
 *
 * Does NOT modify the previous ImmersiveHome / index implementation.
 */

import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  NL2_TUNING,
  SCENE_STATES,
} from '../../config/newLanding2Scene';
import { createPinnedScrollEngine } from '../../lib/new-landing-2/scrollEngine';
import { sampleWorld } from '../../lib/new-landing-2/worldMath';
import { useLocalization } from '../../context/LocalizationContext';
import { NLThemeStyle } from '../new-landing/theme';
import { CaptionLayer, Eyebrow, Grad } from './ui/Captions';

const SceneCanvas = dynamic(() => import('./scene/SceneCanvas'), { ssr: false });

function useLandingCopy() {
  const { t, language, isRTL } = useLocalization();
  const c = (key: string) => t(`landing.${key}`);
  return { c, t, language, isRTL };
}

export default function NewLanding2() {
  const { c, t, language, isRTL } = useLandingCopy();

  const storyRef = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const bus = useMemo(() => ({ progress: 0 }), []);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeId, setActiveId] = useState('hero');

  const quality = useMemo(() => {
    if (isMobile) return NL2_TUNING.quality.mobile;
    if (isTablet) return NL2_TUNING.quality.tablet;
    return NL2_TUNING.quality.desktop;
  }, [isMobile, isTablet]);

  const featureItems = useMemo(() => {
    const items = c('features.items');
    return Array.isArray(items) ? items.slice(0, 4) : [];
  }, [c, language]);

  const agentTitles = useMemo(() => {
    const items = c('agents.items');
    if (!Array.isArray(items)) return [];
    return items.map((i: { title: string }) => i.title).filter(Boolean);
  }, [c, language]);

  const securityPoints = useMemo(() => {
    const points = c('security.points');
    if (!Array.isArray(points)) return [];
    return points.map((p: { title: string }) => p.title).filter(Boolean);
  }, [c, language]);

  const voices = useMemo(() => {
    const items = c('testimonials.items');
    if (!Array.isArray(items)) return [];
    return items.slice(0, 3);
  }, [c, language]);

  const workflowOutputs = useMemo(() => {
    const o = c('workflow.outputs');
    return Array.isArray(o) ? o : [];
  }, [c, language]);

  useEffect(() => {
    const mqM = window.matchMedia(`(max-width: ${NL2_TUNING.mobileMax}px)`);
    const mqT = window.matchMedia(`(max-width: ${NL2_TUNING.tabletMax}px)`);
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
      ? window.requestIdleCallback(() => setReady(true), { timeout: 700 })
      : window.setTimeout(() => setReady(true), 200);

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
    if (!storyRef.current || !ready) return;

    const engine = createPinnedScrollEngine({
      story: storyRef.current,
      bus,
      reducedMotion,
      onProgress: (p) => {
        setProgress(p);
        setActiveId(sampleWorld(p).activeId);
        if (progressBar.current) {
          progressBar.current.style.transform = `scaleX(${p})`;
        }
      },
    });

    return () => engine.destroy();
  }, [ready, reducedMotion, bus, language]);

  return (
    <>
      <Head>
        <title>{c('meta.title')} — New Landing 2</title>
        <meta name="description" content={c('meta.description')} />
        <meta name="theme-color" content="#05070f" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <NLThemeStyle />

      <div
        id="nl2-root"
        data-nl-theme="dark"
        dir={isRTL ? 'rtl' : 'ltr'}
        className="nl2-root"
      >
        {/* Top chrome */}
        <header className="nl2-top">
          <Link href="/" className="nl2-logo">
            <Image src="/logo3.png" alt="Dragify" width={110} height={36} priority />
          </Link>
          <div className="nl2-top-right">
            <span className="nl2-chapter">{SCENE_STATES.find((s) => s.id === activeId)?.section}</span>
            <a className="nl2-cta-mini" href="https://console.dragify.ai/" target="_blank" rel="noreferrer">
              {c('nav.start')}
            </a>
          </div>
        </header>

        <div className="nl2-progress-track">
          <div
            ref={progressBar}
            className="nl2-progress-bar"
            style={{ transformOrigin: isRTL ? 'right' : 'left' }}
          />
        </div>

        {/* Chapter ticks */}
        <nav className="nl2-ticks" aria-label="Story progress">
          {SCENE_STATES.map((s) => {
            const on = s.id === activeId;
            const seen = progress >= s.range[0];
            return (
              <div
                key={s.id}
                className={`nl2-tick ${on ? 'is-on' : ''} ${seen ? 'is-seen' : ''}`}
                title={s.section}
              />
            );
          })}
        </nav>

        {/* STICKY STORY — one continuous scrubbed experience */}
        <div
          ref={storyRef}
          className="nl2-story"
          style={{ height: `${NL2_TUNING.scrollVh}vh` }}
        >
          <div className="nl2-stage">
            <div className="nl2-canvas">
              {ready && !reducedMotion ? (
                <SceneCanvas bus={bus} quality={quality} reducedMotion={reducedMotion} />
              ) : (
                <div className="nl2-canvas-fallback" />
              )}
            </div>

            <div className="nl2-vignette" />

            <CaptionLayer id="hero" progress={progress} isMobile={isMobile}>
              <Eyebrow>{c('hero.eyebrow')}</Eyebrow>
              <h1 className="nl2-h1">
                {c('hero.titlePre')} <Grad>{c('hero.titleGradient')}</Grad>
                {c('hero.titlePost')}
              </h1>
              <p className="nl2-sub">{c('hero.subtitle')}</p>
              <div className="nl2-actions">
                <a className="nl2-btn" href="https://console.dragify.ai/" target="_blank" rel="noreferrer">
                  {c('hero.ctaPrimary')}
                </a>
                <span className="nl2-scroll-hint">Scroll to enter the system</span>
              </div>
            </CaptionLayer>

            <CaptionLayer id="partners" progress={progress} isMobile={isMobile}>
              <Eyebrow>Backed by</Eyebrow>
              <h2 className="nl2-h2">{t('partners.title')}</h2>
              <p className="nl2-sub">{c('marquee.label')}</p>
            </CaptionLayer>

            <CaptionLayer id="shift" progress={progress} isMobile={isMobile}>
              <Eyebrow>01 — {c('problem.eyebrow')}</Eyebrow>
              <h2 className="nl2-h2">
                {c('problem.title')}
                <br />
                <span className="nl2-muted">{c('problem.titleGradient')}</span>
              </h2>
              <p className="nl2-sub">{c('problem.subtitle')}</p>
            </CaptionLayer>

            <CaptionLayer id="workflow" progress={progress} isMobile={isMobile}>
              <Eyebrow>02 — {c('workflow.eyebrow')}</Eyebrow>
              <h2 className="nl2-h2">
                {c('workflow.title')} <Grad>{c('workflow.titleGradient')}</Grad>
              </h2>
              <p className="nl2-sub">{c('workflow.subtitle')}</p>
              <ul className="nl2-list">
                {workflowOutputs.map((o: string) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </CaptionLayer>

            <CaptionLayer id="features" progress={progress} isMobile={isMobile}>
              <Eyebrow>03 — {c('features.eyebrow')}</Eyebrow>
              <h2 className="nl2-h2">
                {c('features.title')} <Grad>{c('features.titleGradient')}</Grad>
              </h2>
              <p className="nl2-sub">{c('features.subtitle')}</p>
              <div className="nl2-tags">
                {featureItems.map((f: { tag: string; title: string }) => (
                  <span key={f.tag} className="nl2-tag">
                    <strong>{f.tag}</strong> {f.title}
                  </span>
                ))}
              </div>
            </CaptionLayer>

            <CaptionLayer id="agents" progress={progress} isMobile={isMobile}>
              <Eyebrow>04 — {c('agents.eyebrow')}</Eyebrow>
              <h2 className="nl2-h2">
                {c('agents.title')} <Grad>{c('agents.titleGradient')}</Grad>
                {c('agents.titlePost')}
              </h2>
              <p className="nl2-sub">{c('agents.subtitle')}</p>
              <div className="nl2-tags">
                {agentTitles.slice(0, 6).map((title: string) => (
                  <span key={title} className="nl2-chip">
                    {title}
                  </span>
                ))}
              </div>
            </CaptionLayer>

            <CaptionLayer id="integrations" progress={progress} isMobile={isMobile}>
              <Eyebrow>05 — {c('integrations.eyebrow')}</Eyebrow>
              <h2 className="nl2-h2">
                {c('integrations.title')} <Grad>{c('integrations.titleGradient')}</Grad>
              </h2>
              <p className="nl2-sub">{c('integrations.subtitle')}</p>
              <p className="nl2-stat">
                <Grad>{c('integrations.statNumber')}</Grad>
                <span>{c('integrations.statLabel')}</span>
              </p>
            </CaptionLayer>

            <CaptionLayer id="security" progress={progress} isMobile={isMobile}>
              <Eyebrow>06 — {c('security.eyebrow')}</Eyebrow>
              <h2 className="nl2-h2">
                {c('security.title')} <Grad>{c('security.titleGradient')}</Grad>
                {c('security.titlePost')}
              </h2>
              <p className="nl2-sub">{c('security.subtitle')}</p>
              <ul className="nl2-list">
                {securityPoints.map((p: string) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </CaptionLayer>

            <CaptionLayer id="voices" progress={progress} isMobile={isMobile}>
              <Eyebrow>07 — {c('testimonials.eyebrow')}</Eyebrow>
              <h2 className="nl2-h2">
                {c('testimonials.title')} <Grad>{c('testimonials.titleGradient')}</Grad>
              </h2>
              <div className="nl2-quotes">
                {voices.map((v: { text: string; name: string; role: string }) => (
                  <blockquote key={v.name}>
                    <p>“{v.text}”</p>
                    <footer>
                      {v.name} — {v.role}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </CaptionLayer>

            <CaptionLayer id="pricing" progress={progress} isMobile={isMobile}>
              <Eyebrow>08 — {c('pricing.eyebrow')}</Eyebrow>
              <h2 className="nl2-h2">
                {c('pricing.title')} <Grad>{c('pricing.titleGradient')}</Grad>
              </h2>
              <p className="nl2-sub">{c('pricing.subtitle')}</p>
              <a className="nl2-btn ghost" href="/pricing">
                View plans
              </a>
            </CaptionLayer>

            <CaptionLayer id="cta" progress={progress} isMobile={isMobile}>
              <h2 className="nl2-h1">
                {c('cta.title')} <Grad>{c('cta.titleGradient')}</Grad>
                {c('cta.titlePost')}
              </h2>
              <p className="nl2-sub">{c('cta.subtitle')}</p>
              <div className="nl2-actions">
                <a className="nl2-btn" href="https://console.dragify.ai/" target="_blank" rel="noreferrer">
                  {c('cta.primary')}
                </a>
                <a className="nl2-btn ghost" href="/contact">
                  {c('cta.secondary')}
                </a>
              </div>
              <p className="nl2-fine">{c('hero.finePrint')}</p>
            </CaptionLayer>
          </div>
        </div>

        <footer className="nl2-footer">
          <p>
            © {new Date().getFullYear()} Dragify ·{' '}
            <Link href="/">Classic home</Link> ·{' '}
            <Link href="/landing">Landing</Link> ·{' '}
            <Link href="/new-landing">New Landing</Link>
          </p>
        </footer>
      </div>

      <style jsx global>{`
        #nl2-root.nl2-root {
          --nl2-bg: #05070f;
          --nl2-text: #f4f6fb;
          background: var(--nl2-bg);
          color: var(--nl2-text);
          font-family: 'Outfit', 'Cairo', system-ui, sans-serif;
          min-height: 100vh;
          overflow-x: clip;
        }
        html[dir='rtl'] #nl2-root {
          font-family: 'Cairo', 'Outfit', system-ui, sans-serif;
        }
        .nl2-top {
          position: fixed;
          inset-inline: 0;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          pointer-events: none;
        }
        .nl2-logo,
        .nl2-top-right,
        .nl2-cta-mini {
          pointer-events: auto;
        }
        .nl2-top-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .nl2-chapter {
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        .nl2-cta-mini {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          background: linear-gradient(115deg, #3b82f6, #8b5cf6);
          color: #fff;
        }
        .nl2-progress-track {
          position: fixed;
          inset-inline: 0;
          top: 0;
          z-index: 60;
          height: 2px;
          background: rgba(255, 255, 255, 0.06);
        }
        .nl2-progress-bar {
          height: 100%;
          width: 100%;
          transform: scaleX(0);
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f472b6);
        }
        .nl2-ticks {
          position: fixed;
          inset-inline-end: 1rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .nl2-tick {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .nl2-tick.is-seen {
          background: rgba(147, 197, 253, 0.55);
        }
        .nl2-tick.is-on {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          transform: scale(1.7);
        }
        .nl2-story {
          position: relative;
          width: 100%;
        }
        .nl2-stage {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #05070f;
        }
        .nl2-canvas,
        .nl2-canvas-fallback {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .nl2-canvas-fallback {
          background: radial-gradient(ellipse at 50% 40%, #152038 0%, #05070f 70%);
        }
        .nl2-vignette {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          background:
            radial-gradient(ellipse at center, transparent 40%, rgba(5, 7, 15, 0.55) 100%),
            linear-gradient(to bottom, rgba(5, 7, 15, 0.65), transparent 18%, transparent 82%, rgba(5, 7, 15, 0.7));
        }
        .nl2-caption .nl2-h1 {
          font-size: clamp(2rem, 5.5vw, 4.4rem);
          line-height: 1.05;
          font-weight: 650;
          letter-spacing: -0.03em;
          margin: 0.4rem 0 0;
        }
        .nl2-caption .nl2-h2 {
          font-size: clamp(1.6rem, 3.8vw, 3rem);
          line-height: 1.12;
          font-weight: 650;
          letter-spacing: -0.02em;
          margin: 0.35rem 0 0;
        }
        .nl2-sub {
          margin: 1rem 0 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: clamp(0.95rem, 1.4vw, 1.125rem);
          line-height: 1.55;
          max-width: 36rem;
        }
        .nl2-muted {
          color: rgba(255, 255, 255, 0.42);
        }
        .nl2-eyebrow {
          margin: 0;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #93c5fd;
        }
        .nl2-grad {
          background: linear-gradient(100deg, #eef2ff 0%, #93c5fd 40%, #c4b5fd 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .nl2-actions {
          margin-top: 1.75rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          align-items: center;
        }
        .nl2-btn {
          display: inline-flex;
          align-items: center;
          height: 2.85rem;
          padding: 0 1.4rem;
          border-radius: 999px;
          background: linear-gradient(115deg, #3b82f6, #8b5cf6);
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .nl2-btn.ghost {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.85);
        }
        .nl2-scroll-hint {
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
        }
        .nl2-list {
          margin: 1.1rem 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.45rem;
        }
        .nl2-list li {
          font-size: 0.92rem;
          color: rgba(255, 255, 255, 0.72);
          padding-inline-start: 0.9rem;
          border-inline-start: 2px solid rgba(59, 130, 246, 0.55);
        }
        .nl2-tags {
          margin-top: 1.2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .nl2-tag,
        .nl2-chip {
          font-size: 0.78rem;
          padding: 0.45rem 0.75rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
        }
        .nl2-tag strong {
          color: #93c5fd;
          margin-inline-end: 0.35rem;
          font-weight: 600;
        }
        .nl2-stat {
          margin-top: 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 650;
        }
        .nl2-stat span {
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 500;
          max-width: 22rem;
        }
        .nl2-quotes {
          margin-top: 1.2rem;
          display: grid;
          gap: 1rem;
        }
        .nl2-quotes blockquote {
          margin: 0;
          padding: 0;
        }
        .nl2-quotes p {
          margin: 0;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.5;
        }
        .nl2-quotes footer {
          margin-top: 0.35rem;
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          color: rgba(147, 197, 253, 0.8);
        }
        .nl2-fine {
          margin-top: 1.5rem;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
        }
        .nl2-footer {
          position: relative;
          z-index: 5;
          padding: 2.5rem 1.5rem 3rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          background: #05070f;
        }
        .nl2-footer a {
          color: #93c5fd;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        @media (max-width: 820px) {
          .nl2-ticks {
            display: none;
          }
          .nl2-chapter {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
