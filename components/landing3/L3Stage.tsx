import { useEffect, useRef, useState } from 'react';
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

export default function L3Stage() {
  const { c, language } = useL3();
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);
  const outputs = (c('stage.outputs') as string[]) || [];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (2 + outputs.length)), 1600);
    return () => clearInterval(id);
  }, [reduced, outputs.length, language]);

  useEffect(() => {
    if (reduced || !root.current) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await getGsap();
      if (cancelled || !root.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          '[data-stage-item]',
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
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
    <Wrap id="stage" ref={root}>
      <Container>
        <Header>
          <Reveal>
            <Kicker>{c('stage.kicker')}</Kicker>
            <Display>
              {c('stage.titlePre')}{' '}
              <GradientWord>{c('stage.titleGrad')}</GradientWord>
            </Display>
            <Lead>{c('stage.sub')}</Lead>
          </Reveal>
        </Header>

        <Board>
          <Top>
            <Live><Pulse />{c('stage.live')}</Live>
          </Top>

          <Steps>
            <Step data-stage-item $on={step === 0}>
              <Num>01</Num>
              <Tag>{c('stage.trigger.kicker')}</Tag>
              <Title>{c('stage.trigger.title')}</Title>
              <Hint>{c('stage.trigger.sub')}</Hint>
            </Step>

            <ArrowWrap data-stage-item aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ArrowWrap>

            <Step data-stage-item $on={step === 1} $accent>
              <Num>02</Num>
              <Tag>{c('stage.agent.kicker')}</Tag>
              <Title>{c('stage.agent.title')}</Title>
              <Hint>{c('stage.agent.sub')}</Hint>
            </Step>

            <ArrowWrap data-stage-item aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ArrowWrap>

            <OutCol>
              {outputs.map((o, i) => (
                <Out key={o} data-stage-item $on={step === i + 2}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {o}
                </Out>
              ))}
            </OutCol>
          </Steps>

          <Foot data-stage-item>
            <strong>12,480+</strong>
            <span>{c('stage.counterLabel')}</span>
          </Foot>
        </Board>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  padding-block: clamp(4.5rem, 10vw, 7.5rem);
  background: var(--l3-bg);
`;

const Header = styled.div`
  max-width: 700px;
  margin-bottom: 2.5rem;
`;

const Board = styled.div`
  border: 1px solid var(--l3-line);
  border-radius: 20px;
  background: var(--l3-bg-deep);
  overflow: hidden;
`;

const Top = styled.div`
  padding: 1rem 1.35rem;
  border-bottom: 1px solid var(--l3-line);
  background: var(--l3-elevated);
`;

const Live = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--l3-teal);
`;

const Pulse = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1.1fr auto 1fr;
  gap: 0.75rem;
  padding: 1.5rem;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.div<{ $on?: boolean; $accent?: boolean }>`
  padding: 1.2rem;
  border-radius: 16px;
  border: 1px solid ${({ $on, $accent }) => ($on || $accent ? 'transparent' : 'var(--l3-line)')};
  background: ${({ $accent }) => ($accent ? 'var(--l3-elevated)' : 'var(--l3-elevated)')};
  box-shadow: ${({ $on, $accent }) =>
    $on || $accent ? '0 0 0 2px color-mix(in srgb, var(--l3-blue) 55%, var(--l3-violet)), var(--l3-shadow)' : 'none'};
  transition: box-shadow 0.35s ease, border-color 0.35s ease;
`;

const Num = styled.div`
  font-size: 0.72rem;
  font-weight: 750;
  color: var(--l3-faint);
  margin-bottom: 0.65rem;
`;

const Tag = styled.div`
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--l3-blue);
  margin-bottom: 0.3rem;
`;

const Title = styled.div`
  font-size: 1.05rem;
  font-weight: 750;
  color: var(--l3-ink);
  margin-bottom: 0.35rem;
`;

const Hint = styled.div`
  font-size: 0.88rem;
  color: var(--l3-muted);
  line-height: 1.45;
`;

const ArrowWrap = styled.div`
  display: grid;
  place-items: center;
  color: var(--l3-faint);
  @media (max-width: 900px) {
    transform: rotate(90deg);
    padding: 0.25rem 0;
  }
`;

const OutCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Out = styled.div<{ $on?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ $on }) => ($on ? 'var(--l3-blue)' : 'var(--l3-line)')};
  background: ${({ $on }) => ($on ? 'color-mix(in srgb, var(--l3-blue) 8%, var(--l3-elevated))' : 'var(--l3-elevated)')};
  font-size: 0.9rem;
  font-weight: 650;
  color: var(--l3-ink);
  transition: border-color 0.3s ease, background 0.3s ease;
  span {
    font-size: 0.72rem;
    color: var(--l3-faint);
    font-variant-numeric: tabular-nums;
  }
`;

const Foot = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  flex-wrap: wrap;
  padding: 1.1rem 1.35rem;
  border-top: 1px solid var(--l3-line);
  background: var(--l3-elevated);
  color: var(--l3-muted);
  font-size: 0.92rem;
  strong {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--l3-ink);
    letter-spacing: -0.02em;
  }
`;
