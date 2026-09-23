import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Arrow,
  GhostCTA,
  PrimaryCTA,
  getGsap,
  useL3,
  usePrefersReducedMotion,
} from './shared';
import L3HeroCanvas from './L3HeroCanvas';

export default function L3Opening() {
  const { c, language } = useL3();
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced || !root.current) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await getGsap();
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          '[data-hero-bit]',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out', delay: 0.05 }
        );
      }, root);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, language]);

  return (
    <Wrap ref={root}>
      <Glow aria-hidden />
      <Layout>
        <Copy>
          <Brand data-hero-bit>Dragify</Brand>
          <Headline data-hero-bit>{c('opening.headline')}</Headline>
          <Sub data-hero-bit>{c('opening.sub')}</Sub>
          <CTAs data-hero-bit>
            <PrimaryCTA href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer">
              {c('opening.ctaPrimary')} <Arrow />
            </PrimaryCTA>
            <GhostCTA href="#stage">{c('opening.ctaSecondary')}</GhostCTA>
          </CTAs>
          <Fine data-hero-bit>{c('opening.fine')}</Fine>
        </Copy>
        <CanvasCol data-hero-bit>
          <L3HeroCanvas />
        </CanvasCol>
      </Layout>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding: 7rem 0 4rem;
  overflow: hidden;
  background: var(--l3-bg);
`;

const Glow = styled.div`
  position: absolute;
  top: -10%;
  right: -10%;
  width: min(640px, 70vw);
  height: min(640px, 70vw);
  border-radius: 50%;
  background: var(--l3-grad-soft);
  filter: blur(40px);
  pointer-events: none;
  [dir='rtl'] & {
    right: auto;
    left: -10%;
  }
`;

const Layout = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding-inline: clamp(1.25rem, 3vw, 2rem);
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.18fr);
  gap: clamp(1.75rem, 4vw, 3rem);
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Copy = styled.div`
  max-width: 520px;
  @media (max-width: 980px) { max-width: none; }
`;

const Brand = styled.h1`
  font-size: clamp(2.8rem, 7vw, 4.6rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;
  margin: 0 0 1rem;
  background: var(--l3-grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Headline = styled.p`
  font-size: clamp(1.25rem, 2.4vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--l3-ink);
  margin: 0 0 0.9rem;
`;

const Sub = styled.p`
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--l3-muted);
  margin: 0 0 1.6rem;
`;

const CTAs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 0.85rem;
`;

const Fine = styled.p`
  font-size: 0.84rem;
  color: var(--l3-faint);
  margin: 0;
`;

const CanvasCol = styled.div`
  @media (max-width: 980px) {
    order: -1;
  }
`;
