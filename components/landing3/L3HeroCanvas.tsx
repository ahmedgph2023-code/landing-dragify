import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { getGsap, useL3, usePrefersReducedMotion } from './shared';

/** Clean product canvas — CSS grid flow, no overlapping absolute chaos. */
export default function L3HeroCanvas() {
  const { c, language } = useL3();
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const outputs = ((c('stage.outputs') as string[]) || []).slice(0, 3);
  const logs = (c('opening.logs') as string[]) || [];

  useEffect(() => {
    if (reduced || !root.current) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await getGsap();
      if (cancelled || !root.current) return;

      ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>('[data-hn]', root.current!);
        const line = root.current!.querySelector('[data-flowline]') as SVGPathElement | null;
        gsap.set(items, { opacity: 0, y: 16 });
        if (line) {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        }

        const tl = gsap.timeline({ delay: 0.4 });
        tl.to(items, { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out' }, 0);
        if (line) tl.to(line, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.15);

        gsap.to('[data-signal]', {
          strokeDashoffset: -40,
          duration: 1.8,
          repeat: -1,
          ease: 'none',
          delay: 1.4,
        });
      }, root);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, language]);

  return (
    <Root ref={root}>
      <Chrome>
        <Traffic><i /><i /><i /></Traffic>
        <ChromeTitle>{c('opening.canvasTitle')}</ChromeTitle>
        <Live><span />{c('opening.canvasLive')}</Live>
      </Chrome>

      <Body>
        <Flow>
          <Card data-hn>
            <Tag>{c('stage.trigger.kicker')}</Tag>
            <Title>{c('stage.trigger.title')}</Title>
            <Hint>{c('stage.trigger.sub')}</Hint>
          </Card>

          <Connector aria-hidden>
            <svg viewBox="0 0 48 24" preserveAspectRatio="none">
              <path data-flowline d="M2 12 H46" fill="none" stroke="url(#l3flow)" strokeWidth="2" strokeLinecap="round" />
              <path data-signal d="M2 12 H46" fill="none" stroke="var(--l3-violet)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 10" opacity="0.7" />
              <defs>
                <linearGradient id="l3flow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--l3-blue)" />
                  <stop offset="100%" stopColor="var(--l3-violet)" />
                </linearGradient>
              </defs>
            </svg>
          </Connector>

          <AgentCard data-hn>
            <AgentTop>
              <Image src="/logo3.png" alt="" width={26} height={26} style={{ objectFit: 'contain' }} />
              <div>
                <Tag>{c('stage.agent.kicker')}</Tag>
                <Title>{c('stage.agent.title')}</Title>
              </div>
            </AgentTop>
            <Hint>{c('stage.agent.sub')}</Hint>
          </AgentCard>

          <Connector aria-hidden>
            <svg viewBox="0 0 48 24" preserveAspectRatio="none">
              <path d="M2 12 H46" fill="none" stroke="url(#l3flow2)" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="l3flow2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--l3-violet)" />
                  <stop offset="100%" stopColor="var(--l3-blue)" />
                </linearGradient>
              </defs>
            </svg>
          </Connector>

          <OutStack>
            {outputs.map((o) => (
              <Out key={o} data-hn>{o}</Out>
            ))}
          </OutStack>
        </Flow>

        {logs.length > 0 && (
          <Logs>
            {logs.map((log) => (
              <Log key={log} data-hn>✓ {log}</Log>
            ))}
          </Logs>
        )}
      </Body>
    </Root>
  );
}

const Root = styled.div`
  width: 100%;
  border-radius: 18px;
  border: 1px solid var(--l3-line);
  background: var(--l3-canvas);
  box-shadow: var(--l3-shadow);
  overflow: hidden;
`;

const Chrome = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--l3-line);
  background: var(--l3-elevated);
`;

const Traffic = styled.div`
  display: flex;
  gap: 5px;
  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--l3-line-strong);
    &:nth-child(1) { background: #f87171; }
    &:nth-child(2) { background: #fbbf24; }
    &:nth-child(3) { background: #34d399; }
  }
`;

const ChromeTitle = styled.div`
  flex: 1;
  font-size: 0.78rem;
  font-weight: 650;
  color: var(--l3-muted);
`;

const Live = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--l3-teal);
  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    animation: l3blink 1.4s ease infinite;
  }
  @keyframes l3blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
`;

const Body = styled.div`
  padding: 1.25rem;
  background-image: radial-gradient(var(--l3-line) 1px, transparent 1px);
  background-size: 16px 16px;
`;

const Flow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1.15fr auto 1fr;
  gap: 0.65rem;
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const Card = styled.div`
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid var(--l3-line);
  background: var(--l3-node);
  box-shadow: 0 8px 20px -14px rgba(0,0,0,0.25);
  min-height: 118px;
`;

const AgentCard = styled(Card)`
  border-color: color-mix(in srgb, var(--l3-blue) 45%, var(--l3-violet));
  box-shadow: 0 0 0 3px var(--l3-glow), 0 12px 28px -14px var(--l3-glow-violet);
`;

const AgentTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.35rem;
`;

const Tag = styled.div`
  font-size: 0.65rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--l3-blue);
  margin-bottom: 0.2rem;
`;

const Title = styled.div`
  font-size: 0.92rem;
  font-weight: 750;
  color: var(--l3-ink);
  line-height: 1.3;
`;

const Hint = styled.div`
  margin-top: 0.35rem;
  font-size: 0.78rem;
  color: var(--l3-muted);
  line-height: 1.4;
`;

const Connector = styled.div`
  width: 36px;
  height: 24px;
  svg { width: 100%; height: 100%; }
  @media (max-width: 720px) {
    width: 100%;
    height: 28px;
    transform: rotate(90deg);
    margin: -0.25rem 0;
  }
`;

const OutStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Out = styled.div`
  padding: 0.7rem 0.85rem;
  border-radius: 12px;
  border: 1px solid var(--l3-line);
  background: var(--l3-node);
  font-size: 0.8rem;
  font-weight: 650;
  color: var(--l3-ink);
`;

const Logs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--l3-line);
`;

const Log = styled.div`
  font-size: 0.72rem;
  font-weight: 650;
  color: var(--l3-ink-soft);
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: var(--l3-elevated);
  border: 1px solid var(--l3-line);
`;
