import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Arrow,
  Container,
  GhostCTA,
  PrimaryCTA,
  getGsap,
  useL3,
  usePrefersReducedMotion,
} from './shared';

export default function L3Close() {
  const { c, language } = useL3();
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced || !root.current) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await getGsap();
      if (cancelled || !root.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          '[data-close]',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
          }
        );
      }, root);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, language]);

  return (
    <Wrap ref={root} id="close">
      <Glow aria-hidden />
      <Container>
        <Brand data-close>Dragify</Brand>
        <Title data-close>
          {c('close.titlePre')}{' '}
          <em>{c('close.titleEm')}</em>
          {c('close.titlePost')}
        </Title>
        <Sub data-close>{c('close.sub')}</Sub>
        <CTAs data-close>
          <PrimaryCTA href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer">
            {c('close.primary')} <Arrow />
          </PrimaryCTA>
          <GhostCTA href="https://calendly.com/cloudilic" target="_blank" rel="noopener noreferrer">
            {c('close.secondary')}
          </GhostCTA>
        </CTAs>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  padding-block: clamp(6rem, 14vw, 10rem);
  background: var(--l3-bg);
  overflow: hidden;
  text-align: center;
`;

const Glow = styled.div`
  position: absolute;
  inset: 20% 10% auto;
  height: 50%;
  background: radial-gradient(ellipse at center, var(--l3-glow), transparent 65%);
  pointer-events: none;
`;

const Brand = styled.div`
  position: relative;
  font-family: inherit;
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 750;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--l3-cobalt);
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  position: relative;
  font-family: inherit;
  font-size: clamp(2.4rem, 6vw, 4.6rem);
  font-weight: 750;
  letter-spacing: -0.035em;
  line-height: 1.05;
  color: var(--l3-ink);
  margin: 0 auto 1.25rem;
  max-width: 14ch;
  em {
    font-style: normal;
    background: var(--l3-grad-text);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Sub = styled.p`
  position: relative;
  font-size: 1.1rem;
  color: var(--l3-muted);
  max-width: 32rem;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const CTAs = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;
