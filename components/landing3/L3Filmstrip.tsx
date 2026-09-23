import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Container,
  Display,
  GradientWord,
  Kicker,
  Lead,
  Reveal,
  getGsap,
  useL3,
  usePrefersReducedMotion,
} from './shared';

export default function L3Filmstrip() {
  const { c, language, isRTL } = useL3();
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = (c('teams.items') as { title: string; description: string; tags: string[] }[]) || [];

  useEffect(() => {
    if (reduced || !root.current || !track.current) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await getGsap();
      if (cancelled || !root.current || !track.current) return;
      if (window.matchMedia('(max-width: 800px)').matches) return;

      const getScroll = () => {
        const distance = track.current!.scrollWidth - window.innerWidth + 80;
        return Math.max(distance, 0);
      };

      ctx = gsap.context(() => {
        gsap.to(track.current, {
          x: () => (isRTL ? getScroll() : -getScroll()),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${getScroll()}`,
            pin: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, root);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, language, isRTL, items.length]);

  return (
    <Wrap ref={root} id="teams">
      <Sticky>
        <Container>
          <Header>
            <Reveal>
              <Kicker>{c('teams.kicker')}</Kicker>
              <Display>
                {c('teams.titlePre')}{' '}
                <GradientWord>{c('teams.titleGrad')}</GradientWord>
                {c('teams.titlePost')}
              </Display>
              <Lead>{c('teams.sub')}</Lead>
            </Reveal>
          </Header>
        </Container>

        <TrackWrap>
          <Track ref={track}>
            {items.map((it, i) => (
              <Card key={it.title}>
                <Num>{String(i + 1).padStart(2, '0')}</Num>
                <Title>{it.title}</Title>
                <Desc>{it.description}</Desc>
                <Tags>
                  {it.tags?.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </Tags>
              </Card>
            ))}
          </Track>
        </TrackWrap>
      </Sticky>
    </Wrap>
  );
}

const Wrap = styled.section`
  background: var(--l3-bg-deep);
  @media (max-width: 800px) { height: auto !important; }
`;

const Sticky = styled.div`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: 4rem;
  overflow: hidden;
  @media (max-width: 800px) {
    min-height: auto;
    padding-block: 5rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  max-width: 720px;
`;

const TrackWrap = styled.div`
  overflow: visible;
`;

const Track = styled.div`
  display: flex;
  gap: 1.25rem;
  padding-inline: clamp(1.25rem, 3vw, 2rem);
  width: max-content;
  will-change: transform;

  @media (max-width: 800px) {
    width: 100%;
    flex-direction: column;
    transform: none !important;
  }
`;

const Card = styled.article`
  width: min(360px, 78vw);
  flex-shrink: 0;
  padding: 1.75rem;
  border-radius: 20px;
  border: 1px solid var(--l3-line);
  background: var(--l3-elevated);
  min-height: 280px;
  display: flex;
  flex-direction: column;

  @media (max-width: 800px) {
    width: 100%;
    min-height: auto;
  }
`;

const Num = styled.div`
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--l3-faint);
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-family: inherit;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--l3-ink);
  margin: 0 0 0.75rem;
`;

const Desc = styled.p`
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--l3-muted);
  margin: 0 0 auto;
  padding-bottom: 1.25rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding-top: 1rem;
  border-top: 1px solid var(--l3-line);
`;

const Tag = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--l3-ink-soft);
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: var(--l3-surface);
  border: 1px solid var(--l3-line);
`;
