import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLocalization } from '../../context/LocalizationContext';
import {
  Container, Eyebrow, GhostLink, PrimaryLink, Magnetic, WordReveal, splitHighlightedWords,
  ease, usePrefersReducedMotion, getGsap,
} from './shared';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const Wrap = styled.section`
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-block: 8.5rem 4rem;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 900px) {
    min-height: auto;
    padding-block: 7.5rem 3rem;
  }
`;

const MeshLayer = styled.div`
  position: absolute;
  inset: -10%;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(38% 32% at 18% 22%, ${({ theme }) => theme.colors.accent.blue}2e, transparent 70%),
    radial-gradient(34% 30% at 82% 18%, ${({ theme }) => theme.colors.accent.purple}2e, transparent 70%),
    radial-gradient(42% 38% at 50% 92%, ${({ theme }) => theme.colors.accent.blue}22, transparent 72%);
  animation: nl-mesh-drift 22s ease-in-out infinite alternate;
  filter: blur(10px);

  @media (prefers-reduced-motion: reduce) { animation: none; }

  @keyframes nl-mesh-drift {
    0% { transform: translate3d(0, 0, 0) scale(1); }
    100% { transform: translate3d(2%, -3%, 0) scale(1.06); }
  }
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(${({ theme }) => theme.colors.border} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.colors.border} 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(58% 50% at 50% 22%, black, transparent 78%);
  opacity: 0.55;
  pointer-events: none;
`;

const SceneLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.85;
  mask-image: radial-gradient(55% 55% at 50% 38%, black 35%, transparent 82%);
  @media (max-width: 720px) { opacity: 0.5; }
`;

const Center = styled.div`
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4.85rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.6rem;

  .blinker {
    color: ${({ theme }) => theme.colors.accent.blue};
    animation: blink 1s step-start infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.08rem, 1.6vw, 1.3rem);
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 640px;
  margin: 0 0 2.4rem;
`;

const CTARow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    a { width: 100%; }
  }
`;

const FinePrint = styled(motion.div)`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.8;
  margin-bottom: 3.5rem;
`;

const ScrollCue = styled(motion.button)`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  svg { color: ${({ theme }) => theme.colors.accent.blue}; }
`;

export default function Hero() {
  const { t, language } = useLocalization();
  const { isDarkMode } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const writerTexts: string[] = t('hero.writerTexts') || ['Acts', 'Thinks', 'Leaps'];

  useEffect(() => {
    setDisplayedText('');
    setCharIndex(0);
    setTextIndex(0);
  }, [writerTexts.length, language]);

  useEffect(() => {
    const currentText = writerTexts[textIndex] ?? '';
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 85);
      return () => clearTimeout(timeout);
    }
    const pause = setTimeout(() => {
      setDisplayedText('');
      setCharIndex(0);
      setTextIndex((prev) => (prev + 1) % writerTexts.length);
    }, 1700);
    return () => clearTimeout(pause);
  }, [charIndex, textIndex, writerTexts]);

  // Gentle parallax: the ambient 3D scene drifts slower than scroll.
  useEffect(() => {
    if (reduced) return;
    let ctx: any;
    (async () => {
      const { gsap, ScrollTrigger } = await getGsap();
      ctx = gsap.context(() => {
        gsap.to(sceneRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: wrapRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
      }, wrapRef);
    })();
    return () => ctx?.revert();
  }, [reduced]);

  const accentBlue = isDarkMode ? '#4a89dc' : '#3b82f6';
  const accentPurple = isDarkMode ? '#8c7df7' : '#8b5cf6';

  const titleRaw = t('hero.title').replace('{displayedText}', displayedText);
  const words = splitHighlightedWords(titleRaw);

  const scrollToNext = () => {
    wrapRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Wrap ref={wrapRef as any}>
      <MeshLayer />
      <Grid />
      <SceneLayer ref={sceneRef}>{!reduced && <HeroScene colorA={accentBlue} colorB={accentPurple} reducedMotion={reduced} />}</SceneLayer>

      <Container>
        <Center>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Eyebrow>{t('workflow.aiAgent')} · {t('landing2.eyebrows.aiPlatform')}</Eyebrow>
          </motion.div>

          <Title>
            <WordReveal words={words} />
            <span className="blinker">|</span>
          </Title>

          <Subtitle initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: ease.out }}>
            {t('hero.subtitle')}
          </Subtitle>

          <CTARow initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65, ease: ease.out }}>
            <Magnetic>
              <PrimaryLink href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer">
                {t('hero.getStarted')}
              </PrimaryLink>
            </Magnetic>
            <Magnetic>
              <GhostLink href="https://calendly.com/cloudilic" target="_blank" rel="noopener noreferrer">
                {t('hero.requestDemo')}
              </GhostLink>
            </Magnetic>
          </CTARow>

          <FinePrint initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.8 }}>
            {t('landing2.finePrint')}
          </FinePrint>

          <ScrollCue
            onClick={scrollToNext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 1.1, duration: 0.6 }, y: { delay: 1.4, duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
          >
            {t('landing2.scrollCue')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </ScrollCue>
        </Center>
      </Container>
    </Wrap>
  );
}
