import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import gsap from 'gsap';
import { useTheme } from '../../context/ThemeContext';
import { Eyebrow, GradientSpan, MagneticButton, BrandLogo, useContent } from './shared';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import NLHeroWorkflow from './NLHeroWorkflow';

const NLHeroScene = dynamic(() => import('./NLHeroScene'), { ssr: false });

export default function NLHero() {
  const reduced = usePrefersReducedMotion();
  const { isDarkMode } = useTheme();
  const { c, language } = useContent();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scope = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let split: any;
    let ctx: gsap.Context;
    (async () => {
      if (reduced || !titleRef.current) return;
      const { SplitText } = await import('gsap/SplitText');
      gsap.registerPlugin(SplitText);
      ctx = gsap.context(() => {
        split = new SplitText(titleRef.current, { type: 'words', wordsClass: 'nl-word', ignore: '.nl-gradient-word' });
        gsap.set(split.words, { yPercent: 130, opacity: 0 });
        gsap.set('.nl-gradient-word', { yPercent: 130, opacity: 0 });
        const tl = gsap.timeline({ delay: 0.15 });
        tl.to(split.words, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0);
        tl.to('.nl-gradient-word', { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out' }, 0.1);
      }, scope);
    })();

    return () => {
      ctx?.revert();
      split?.revert();
    };
  }, [reduced, language]);

  useEffect(() => {
    if (reduced) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    (async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.to(gridRef.current, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.5 } });
        gsap.to(glowRef.current, { yPercent: 28, ease: 'none', scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.5 } });
        gsap.to(sceneRef.current, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.5 } });
        gsap.to(visualRef.current, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.5 } });
      }, scope);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <Wrap ref={scope}>
      <SceneLayer ref={sceneRef}>{!reduced && <NLHeroScene reducedMotion={reduced} isDarkMode={isDarkMode} />}</SceneLayer>
      <Atmosphere />
      <Grid ref={gridRef} />
      <Glow ref={glowRef} />
      <Cover />

      <Container>
        <Layout>
          <Copy>
            <BrandMark style={{ opacity: 0, animation: 'nlFadeIn 0.55s ease 0.05s forwards' }}>
              <BrandLogo height={52} priority />
            </BrandMark>

            <Eyebrow style={{ opacity: 0, animation: 'nlFadeIn 0.6s ease 0.12s forwards' }}>
              {c('hero.eyebrow')}
            </Eyebrow>

            <Title ref={titleRef}>
              {c('hero.titlePre')}{' '}
              <GradientSpan className="nl-gradient-word" style={{ display: 'inline-block' }}>{c('hero.titleGradient')}</GradientSpan>
              {c('hero.titlePost')}
            </Title>

            <Subtitle style={{ opacity: 0, animation: 'nlFadeIn 0.7s ease 0.9s forwards' }}>
              {c('hero.subtitle')}
            </Subtitle>

            <CTARow style={{ opacity: 0, animation: 'nlFadeIn 0.7s ease 1.1s forwards' }}>
              <MagneticButton href="https://console.dragify.ai/" target="_blank" variant="primary">
                {c('hero.ctaPrimary')}
              </MagneticButton>
              <MagneticButton href="#workflow" variant="ghost">
                {c('hero.ctaSecondary')}
              </MagneticButton>
            </CTARow>

            <FinePrint style={{ opacity: 0, animation: 'nlFadeIn 0.7s ease 1.3s forwards' }}>
              {c('hero.finePrint')}
            </FinePrint>
          </Copy>

          <Visual ref={visualRef} aria-hidden style={{ opacity: 0, animation: 'nlFadeIn 0.9s ease 0.45s forwards' }}>
            <NLHeroWorkflow reducedMotion={reduced} />
          </Visual>
        </Layout>
      </Container>

      <ScrollCue style={{ opacity: 0, animation: 'nlFadeIn 0.7s ease 1.6s forwards' }}>
        <ScrollCueDot />
      </ScrollCue>

      <Fade />
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 8.5rem 0 5.5rem;
  overflow: hidden;
  background: var(--nl-bg);

  @keyframes nlFadeIn {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    min-height: auto;
    padding: 7.5rem 0 4rem;
  }
`;

const SceneLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.4;
  mask-image: radial-gradient(50% 55% at 78% 45%, black 20%, transparent 75%);
  @media (max-width: 900px) {
    opacity: 0.22;
    mask-image: radial-gradient(70% 50% at 50% 20%, black 20%, transparent 80%);
  }
`;

const Atmosphere = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 45% 40% at 78% 40%, rgba(59, 130, 246, 0.18), transparent 70%),
    radial-gradient(ellipse 35% 30% at 18% 65%, rgba(139, 92, 246, 0.1), transparent 65%);
`;

const Grid = styled.div`
  position: absolute;
  inset: -5% -5%;
  z-index: 1;
  background-image:
    linear-gradient(var(--nl-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--nl-grid-line) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(50% 50% at 70% 40%, black, transparent 78%);
  pointer-events: none;
`;

const Glow = styled.div`
  position: absolute;
  top: -6%;
  left: 72%;
  transform: translateX(-50%);
  width: 640px;
  height: 480px;
  z-index: 1;
  background: var(--nl-gradient-soft);
  filter: blur(100px);
  opacity: var(--nl-hero-glow-opacity);
  pointer-events: none;

  @media (max-width: 900px) {
    left: 50%;
    width: 90vw;
    opacity: 0.35;
  }
`;

const Cover = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(180deg, var(--nl-bg) 0%, transparent 18%, transparent 82%, var(--nl-bg) 100%);
`;

const Fade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 140px;
  z-index: 2;
  background: linear-gradient(to bottom, transparent, var(--nl-bg));
  pointer-events: none;
`;

const Container = styled.div`
  max-width: var(--nl-max-width);
  margin: 0 auto;
  padding-inline: 1.75rem;
  width: 100%;
  position: relative;
  z-index: 3;
  @media (max-width: 640px) {
    padding-inline: 1.25rem;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 2.5rem;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 2.75rem;
  }
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;
  max-width: 540px;

  @media (max-width: 980px) {
    max-width: 480px;
    margin: 0 auto;
    align-items: center;
    text-align: center;
  }
`;

const BrandMark = styled.div`
  margin-bottom: 1.25rem;
  line-height: 0;
`;

const Title = styled.h1`
  font-size: clamp(1.85rem, 3.6vw, 2.85rem);
  line-height: 1.15;
  letter-spacing: -0.025em;
  font-weight: 650;
  color: var(--nl-text-dim);
  margin: 0 0 1.35rem;

  .nl-word { display: inline-block; will-change: transform, opacity; }
  .nl-gradient-word {
    color: var(--nl-text);
    -webkit-text-fill-color: unset;
    background: none;
  }

  @media (max-width: 900px) {
    font-size: clamp(1.7rem, 6vw, 2.35rem);
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 1.4vw, 1.12rem);
  line-height: 1.65;
  color: var(--nl-text-dim);
  max-width: 480px;
  margin: 0 0 2rem;
`;

const CTARow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;

  @media (max-width: 980px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    a { width: 100%; }
    button { width: 100%; }
  }
`;

const FinePrint = styled.div`
  font-size: 0.82rem;
  color: var(--nl-text-faint);
`;

const Visual = styled.div`
  position: relative;
  width: 100%;
  max-width: 620px;
  margin-inline-start: auto;

  @media (max-width: 980px) {
    max-width: 520px;
    margin-inline: auto;
  }
`;

const ScrollCue = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  width: 24px;
  height: 38px;
  border-radius: 100px;
  border: 1.5px solid var(--nl-border-strong);
  display: flex;
  justify-content: center;
  padding-top: 7px;
  @media (max-width: 640px) {
    display: none;
  }
`;

const ScrollCueDot = styled.div`
  width: 4px;
  height: 8px;
  border-radius: 100px;
  background: var(--nl-blue);
  animation: nlScrollCue 1.8s ease-in-out infinite;

  @keyframes nlScrollCue {
    0% { transform: translateY(0); opacity: 1; }
    60% { transform: translateY(12px); opacity: 0; }
    61% { transform: translateY(0); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
`;
