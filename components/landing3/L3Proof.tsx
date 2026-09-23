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

export default function L3Proof() {
  const { c, language } = useL3();
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);
  const items = (c('proof.items') as { value: number; suffix: string; label: string }[]) || [];

  useEffect(() => {
    if (reduced || !root.current) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await getGsap();
      if (cancelled || !root.current) return;

      ctx = gsap.context(() => {
        const nums = gsap.utils.toArray<HTMLElement>('[data-num]', root.current!);
        nums.forEach((el) => {
          const target = Number(el.dataset.target || 0);
          const suffix = el.dataset.suffix || '';
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            onUpdate: () => {
              el.textContent = `${Math.round(obj.v)}${suffix}`;
            },
          });
        });
      }, root);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, language, items.length]);

  return (
    <Wrap ref={root} id="proof">
      <Container>
        <Header>
          <Reveal>
            <Kicker>{c('proof.kicker')}</Kicker>
            <Display>
              {c('proof.titlePre')}{' '}
              <GradientWord>{c('proof.titleGrad')}</GradientWord>
            </Display>
            <Lead>{c('proof.sub')}</Lead>
          </Reveal>
        </Header>

        <Grid>
          {items.map((it) => (
            <Cell key={it.label}>
              <Value data-num data-target={it.value} data-suffix={it.suffix}>
                0{it.suffix}
              </Value>
              <Label>{it.label}</Label>
            </Cell>
          ))}
        </Grid>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  padding-block: clamp(5rem, 11vw, 8.5rem);
  background: var(--l3-bg-deep);
`;

const Header = styled.div`
  max-width: 680px;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--l3-line);
  border: 1px solid var(--l3-line);
  border-radius: 22px;
  overflow: hidden;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div`
  background: var(--l3-elevated);
  padding: clamp(1.5rem, 3vw, 2.25rem);
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Value = styled.div`
  font-family: inherit;
  font-size: clamp(2.4rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--l3-ink);
  margin-bottom: 0.55rem;
  line-height: 1;
`;

const Label = styled.div`
  font-size: 0.95rem;
  color: var(--l3-muted);
  line-height: 1.45;
`;
