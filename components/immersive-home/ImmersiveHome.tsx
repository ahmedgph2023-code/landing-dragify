/**
 * ImmersiveHome — scroll-driven 3D experience for the site home page.
 * Preserves existing home copy (hero, partners, features, agents,
 * integrations, statistics, howItWorks, faq) while presenting it as
 * chapters of one continuous visual scene.
 */

import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import {
  CHAPTERS,
  DESKTOP_QUALITY,
  MOBILE_QUALITY,
  SCENE_TUNING,
  TABLET_QUALITY,
} from '../../config/landingScene';
import { createScrollController } from '../../lib/animations/scrollController';
import { createScrollState } from '../../lib/animations/scrollState';
import { useLocalization } from '../../context/LocalizationContext';
import { NLThemeStyle } from '../new-landing/theme';
import NLNav from '../new-landing/NLNav';
import NLFooter from '../new-landing/NLFooter';
import { GradientWord, TextPanel } from './TextPanel';

const LandingScene = dynamic(() => import('../3d/LandingScene'), { ssr: false });

function parseStatValue(raw: string): { value: number; suffix: string; decimals: number } {
  const cleaned = String(raw || '').trim();
  const match = cleaned.match(/^([\d.]+)(.*)$/);
  if (!match) return { value: 0, suffix: cleaned, decimals: 0 };
  const num = Number(match[1]);
  return {
    value: Number.isFinite(num) ? num : 0,
    suffix: match[2] || '',
    decimals: match[1].includes('.') ? 1 : 0,
  };
}

export default function ImmersiveHome() {
  const { t, language, isRTL } = useLocalization();

  const scroll = useRef(createScrollState());
  const bus = useMemo(() => ({ corePos: new THREE.Vector3() }), []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const metricRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [activeChapter, setActiveChapter] = useState(0);

  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Hero typewriter (preserves home writerTexts behaviour)
  const writerTexts: string[] = t('hero.writerTexts') || ['Acts', 'Thinks', 'Leaps'];
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCharIndex(0);
    setTextIndex(0);
  }, [language, writerTexts.join('|')]);

  useEffect(() => {
    const currentText = writerTexts[textIndex] || '';
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText.charAt(charIndex));
        setCharIndex((c) => c + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
    const pause = setTimeout(() => {
      setDisplayedText('');
      setCharIndex(0);
      setTextIndex((i) => (i + 1) % writerTexts.length);
    }, 2000);
    return () => clearTimeout(pause);
  }, [charIndex, textIndex, writerTexts]);

  const quality = useMemo(() => {
    if (isMobile) return MOBILE_QUALITY;
    if (isTablet) return TABLET_QUALITY;
    return DESKTOP_QUALITY;
  }, [isMobile, isTablet]);

  const heroTitleHtml = useMemo(() => {
    return String(t('hero.title') || '')
      .replace('{displayedText}', displayedText || '\u00a0')
      .replace(/<highlight>/g, '<span class="ih-grad">')
      .replace(/<\/highlight>/g, '</span>');
  }, [t, language, displayedText]);

  const features = useMemo(() => {
    const items = [
      {
        title: t('features.items.0.title'),
        description: t('features.items.0.description'),
        icon: 'agent',
      },
      {
        title: t('features.items.1.title'),
        description: t('features.items.1.description'),
        icon: 'orchestration',
      },
      {
        title: t('features.items.2.title'),
        description: t('features.items.2.description'),
        icon: 'deploy',
      },
      {
        title: t('features.items.3.title'),
        description: t('features.items.3.description'),
        icon: 'api',
      },
    ];
    return items.filter((i) => i.title);
  }, [t, language]);

  const agents = useMemo(() => {
    const raw = t('agents.items');
    if (!Array.isArray(raw)) return [];
    return raw.map((item: { title: string; description?: string }) => ({
      title: String(item.title || ''),
      description: String(item.description || ''),
    }));
  }, [t, language]);

  const integrations = useMemo(() => {
    const raw = t('integrations.items');
    if (!Array.isArray(raw)) return [];
    return raw.map((item: { name: string; connected?: boolean }) => ({
      name: String(item.name || ''),
      connected: Boolean(item.connected),
    }));
  }, [t, language]);

  const metrics = useMemo(() => {
    const raw = t('statistics.items');
    if (!Array.isArray(raw)) return [];
    return raw.slice(0, 4).map((item: { percentage: string; description: string }) => {
      const parsed = parseStatValue(String(item.percentage || ''));
      return {
        ...parsed,
        label: String(item.description || ''),
      };
    });
  }, [t, language]);

  const howSteps = useMemo(() => {
    const steps = t('howItWorks.steps');
    if (!Array.isArray(steps)) return [];
    return steps.map(
      (step: { number?: number; title?: string; description?: string }, i: number) => ({
        number: Number(step.number) || i + 1,
        title: String(step.title || ''),
        description: String(step.description || ''),
      }),
    );
  }, [t, language]);

  const faqItems = useMemo(() => {
    const items = t('faq.items');
    if (!Array.isArray(items)) return [];
    return items.slice(0, 5).map((item: { question: string; answer: string }) => ({
      q: String(item.question || ''),
      a: String(item.answer || ''),
    }));
  }, [t, language]);

  const setMetricRef = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      metricRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const mqMobile = window.matchMedia(`(max-width: ${SCENE_TUNING.mobileMax}px)`);
    const mqTablet = window.matchMedia(`(max-width: ${SCENE_TUNING.tabletMax}px)`);
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      setIsMobile(mqMobile.matches);
      setIsTablet(mqTablet.matches && !mqMobile.matches);
      setReducedMotion(rm.matches);
    };
    sync();
    mqMobile.addEventListener('change', sync);
    mqTablet.addEventListener('change', sync);
    rm.addEventListener('change', sync);

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true), { timeout: 900 })
      : window.setTimeout(() => setReady(true), 300);

    return () => {
      mqMobile.removeEventListener('change', sync);
      mqTablet.removeEventListener('change', sync);
      rm.removeEventListener('change', sync);
      if (window.cancelIdleCallback && typeof idle === 'number') {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current || !ready) return;

    const metricsForScroll = metrics
      .map((m, i) => {
        const el = metricRefs.current[i];
        if (!el) return null;
        return { el, value: m.value, decimals: m.decimals };
      })
      .filter(Boolean) as Array<{ el: HTMLElement; value: number; decimals: number }>;

    const controller = createScrollController({
      wrapper: wrapperRef.current,
      scroll,
      progressBar: progressBarRef.current,
      reducedMotion,
      isRTL,
      onProgress: (_p, chapterIndex) => setActiveChapter(chapterIndex),
      metrics: metricsForScroll,
    });

    return () => controller.destroy();
  }, [ready, reducedMotion, metrics, language, isRTL]);

  useEffect(() => {
    if (!ready) return;
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  }, [ready]);

  return (
    <>
      <Head>
        <title>Dragify AI - Deployment Made Intelligent</title>
        <meta
          name="description"
          content="Dragify AI - Deployment: Drag, Drop, and Drive Intelligent Decisions"
        />
        <meta name="theme-color" content="#0b1220" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <NLThemeStyle />

      <div
        id="nl-root"
        data-nl-theme="dark"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          position: 'relative',
          width: '100%',
          color: 'var(--nl-text)',
          backgroundColor: 'var(--nl-bg)',
          WebkitFontSmoothing: 'antialiased',
          fontFamily: 'var(--nl-font)',
        }}
      >
        {/* Persistent 3D stage */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {ready && !reducedMotion ? (
            <LandingScene
              scroll={scroll}
              bus={bus}
              quality={quality}
              isMobile={isMobile}
              reducedMotion={reducedMotion}
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 40%, #1a2744 0%, #0b1220 70%)',
              }}
            />
          )}
        </div>

        <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(11,18,32,0.55)_100%)]" />
        <div className="pointer-events-none fixed inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#0b1220]/90 to-transparent" />
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#0b1220]/80 to-transparent" />

        <NLNav variant="cinematic" />

        {/* Scroll progress */}
        <div className="fixed inset-x-0 top-0 z-[210] h-px bg-white/5">
          <div
            ref={progressBarRef}
            className="h-px origin-left scale-x-0 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]"
            style={{ transformOrigin: isRTL ? 'right' : 'left' }}
          />
        </div>

        {/* Section awareness dots */}
        <nav
          aria-label="Section progress"
          className="pointer-events-none fixed end-4 top-1/2 z-[200] hidden -translate-y-1/2 flex-col gap-2 md:flex"
        >
          {CHAPTERS.map((ch, i) => (
            <a
              key={ch.id}
              href={`#${ch.id === 'how' ? 'how-it-works' : ch.id}`}
              className="pointer-events-auto block h-1.5 w-1.5 rounded-full transition-all duration-300"
              style={{
                background:
                  i === activeChapter
                    ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                    : 'rgba(255,255,255,0.25)',
                transform: i === activeChapter ? 'scale(1.6)' : 'scale(1)',
              }}
              title={ch.id}
            />
          ))}
        </nav>

        <div ref={wrapperRef} className="relative z-20">
          {/* —— HERO —— */}
          <section
            id="hero"
            data-ih-panel
            className="relative flex min-h-screen items-center justify-center px-6 pb-24 pt-32"
          >
            <TextPanel>
              <div data-ih-line className="mb-6 flex justify-center">
                <Image
                  src="/logo3.png"
                  alt="Dragify"
                  width={140}
                  height={45}
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h1
                data-ih-line
                className="ih-hero-title text-3xl font-semibold leading-[1.15] tracking-tight text-white md:text-6xl"
              >
                <span dangerouslySetInnerHTML={{ __html: heroTitleHtml }} />
                <span className="opacity-70">|</span>
              </h1>
              <p
                data-ih-line
                className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-white/65 md:text-lg"
              >
                {t('hero.subtitle')}
              </p>
              <div
                data-ih-line
                className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <a
                  href="https://console.dragify.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.04]"
                >
                  {t('hero.getStarted')}
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center rounded-full border border-white/18 px-8 text-sm font-medium text-white/80 transition hover:border-white/45 hover:text-white"
                >
                  {t('hero.requestDemo')}
                </a>
              </div>
              <div
                data-ih-line
                className="mt-10 flex flex-wrap items-center justify-center gap-4 opacity-80"
              >
                <Image src="/placee.png" alt="" width={140} height={56} style={{ objectFit: 'contain' }} />
                <Image src="/topLight.png" alt="" width={180} height={64} style={{ objectFit: 'contain' }} />
              </div>
              <div
                data-ih-line
                className="mt-12 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/35"
              >
                <span>Scroll</span>
                <span className="h-12 w-px bg-gradient-to-b from-[#3b82f6]/70 to-transparent" />
              </div>
            </TextPanel>
          </section>

          {/* —— PARTNERS —— */}
          <section
            id="partners"
            data-ih-panel
            className="relative flex min-h-[70vh] items-center justify-center px-6 py-20"
          >
            <TextPanel>
              <p
                data-ih-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                Partners
              </p>
              <h2
                data-ih-line
                className="text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl"
              >
                {t('partners.title')}
              </h2>
              <div
                data-ih-line
                className="mt-10 flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale"
              >
                {['/itida1.png', '/TIEC1.png', '/nvidia.png', '/qater.png'].map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={100}
                    height={40}
                    style={{ objectFit: 'contain' }}
                  />
                ))}
              </div>
            </TextPanel>
          </section>

          {/* —— FEATURES —— */}
          <section
            id="features"
            data-ih-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-start md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'start'}>
              <p
                data-ih-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                01 — Features
              </p>
              <h2
                data-ih-line
                className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl"
                dangerouslySetInnerHTML={{
                  __html: String(t('features.title') || '')
                    .replace(/<highlight>/g, '<span class="ih-grad">')
                    .replace(/<\/highlight>/g, '</span>'),
                }}
              />
              <p
                data-ih-line
                className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
              >
                {t('features.description')}
              </p>
              <div
                data-ih-line
                className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                {features.map((f) => (
                  <div
                    key={f.icon}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-start"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#93c5fd]">
                      {f.icon}
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">{f.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          {/* —— AGENTS —— */}
          <section
            id="agents"
            data-ih-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-end md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'end'}>
              <p
                data-ih-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                02 — Agents
              </p>
              <h2
                data-ih-line
                className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl"
              >
                {t('agents.title')}
              </h2>
              <p
                data-ih-line
                className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
              >
                {t('agents.description')}
              </p>
              <div
                data-ih-line
                className="mt-10 flex flex-wrap items-center gap-3 md:justify-end"
              >
                {agents.map((a) => (
                  <span
                    key={a.title}
                    className="rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-[11px] font-medium tracking-[0.04em] text-white/75"
                    title={a.description}
                  >
                    {a.title}
                  </span>
                ))}
              </div>
            </TextPanel>
          </section>

          {/* —— INTEGRATIONS —— */}
          <section
            id="integrations"
            data-ih-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-start md:px-12"
          >
            <TextPanel align={isMobile ? 'center' : 'start'}>
              <p
                data-ih-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                03 — Integrations
              </p>
              <h2
                data-ih-line
                className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl"
              >
                {t('integrations.title')}
              </h2>
              <p
                data-ih-line
                className="mt-7 max-w-lg text-base leading-relaxed text-white/65 md:text-lg"
              >
                {t('integrations.description')}
              </p>
              <div data-ih-line className="mt-10 flex flex-wrap gap-3">
                {integrations.map((item) => (
                  <span
                    key={item.name}
                    className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/80"
                  >
                    {item.name}
                    {item.connected ? (
                      <span className="ms-2 text-[10px] uppercase tracking-wider text-[#34d399]">
                        {t('integrations.connected')}
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
              <a
                data-ih-line
                href="/resources/integrations"
                className="mt-8 inline-flex text-sm font-medium text-[#93c5fd] underline-offset-4 hover:underline"
              >
                {t('integrations.seeAll')} →
              </a>
            </TextPanel>
          </section>

          {/* —— STATISTICS —— */}
          <section
            id="statistics"
            data-ih-panel
            className="relative flex min-h-screen items-end justify-center px-6 pb-[9vh] pt-24"
          >
            <TextPanel wide>
              <p
                data-ih-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                04 — Impact
              </p>
              <h2
                data-ih-line
                className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl"
                dangerouslySetInnerHTML={{
                  __html: String(t('statistics.title') || ''),
                }}
              />
              <p
                data-ih-line
                className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55"
              >
                {t('statistics.subtitle')}
              </p>
              <div
                data-ih-line
                className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4"
              >
                {metrics.map((metric, i) => (
                  <div key={metric.label} className="text-center">
                    <div className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                      <span ref={setMetricRef(i)}>0</span>
                      <GradientWord>{metric.suffix}</GradientWord>
                    </div>
                    <p className="mt-3 text-[10px] uppercase leading-relaxed tracking-[0.14em] text-white/45">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          {/* —— HOW IT WORKS —— */}
          <section
            id="how-it-works"
            data-ih-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-end md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'end'}>
              <p
                data-ih-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#93c5fd]"
              >
                05 — {t('howItWorks.sectionLabel')}
              </p>
              <h2
                data-ih-line
                className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl"
              >
                {t('howItWorks.title')}
              </h2>
              <div
                data-ih-line
                className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
              >
                {howSteps.map((step) => (
                  <div key={step.number} className="text-start">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#93c5fd]">
                      {String(step.number).padStart(2, '0')}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white md:text-xl">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          {/* —— FAQ —— */}
          <section
            id="faq"
            data-ih-panel
            className="relative flex min-h-screen items-center justify-center px-6 py-24 md:justify-start md:px-12"
          >
            <TextPanel wide align={isMobile ? 'center' : 'start'}>
              <p
                data-ih-line
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c4b5fd]"
              >
                06 — FAQ
              </p>
              <h2
                data-ih-line
                className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl"
              >
                {t('faq.title')}
              </h2>
              <p
                data-ih-line
                className="mt-4 max-w-xl text-base text-white/55"
              >
                {t('faq.description')}
              </p>
              <div data-ih-line className="mt-12 space-y-4 text-start">
                {faqItems.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
                  >
                    <p className="text-sm font-semibold text-white md:text-base">{item.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{item.a}</p>
                  </div>
                ))}
              </div>
            </TextPanel>
          </section>

          {/* —— CTA —— */}
          <section
            id="cta"
            data-ih-panel
            data-ih-stay
            className="relative flex min-h-screen items-center justify-center px-6 py-28"
          >
            <TextPanel strong>
              <h2
                data-ih-line
                className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
              >
                {t('hero.getStarted')}
              </h2>
              <p
                data-ih-line
                className="mx-auto mt-7 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
              >
                {t('hero.subtitle')}
              </p>
              <div
                data-ih-line
                className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <a
                  href="https://console.dragify.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-9 text-sm font-semibold tracking-wide text-white transition-transform duration-300 hover:scale-[1.04]"
                >
                  <span className="relative z-10">{t('hero.getStarted')}</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href="/contact"
                  className="inline-flex h-12 items-center rounded-full border border-white/18 px-9 text-sm font-medium tracking-wide text-white/80 transition hover:border-white/45 hover:text-white"
                >
                  {t('hero.requestDemo')}
                </a>
              </div>
            </TextPanel>
          </section>
        </div>

        <div className="relative z-30 bg-[var(--nl-bg)]">
          <NLFooter />
        </div>

        <style jsx global>{`
          #nl-root .ih-hero-title .ih-grad,
          #nl-root .ih-grad,
          #nl-root .gradient-text {
            background: linear-gradient(100deg, #eef2ff 0%, #93c5fd 40%, #c4b5fd 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        `}</style>
      </div>
    </>
  );
}
