import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Display,
  GradientWord,
  Kicker,
  Lead,
  Reveal,
  useL3,
  usePrefersReducedMotion,
} from './shared';

export default function L3Voices() {
  const { c } = useL3();
  const reduced = usePrefersReducedMotion();
  const items = (c('voices.items') as { text: string; name: string; role: string }[]) || [];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 5200);
    return () => clearInterval(id);
  }, [reduced, items.length]);

  const current = items[i] || items[0];
  if (!current) return null;

  return (
    <Wrap id="voices">
      <Container>
        <Header>
          <Reveal>
            <Kicker>{c('voices.kicker')}</Kicker>
            <Display>
              {c('voices.titlePre')}{' '}
              <GradientWord>{c('voices.titleGrad')}</GradientWord>
              {c('voices.titlePost')}
            </Display>
            <Lead>{c('voices.sub')}</Lead>
          </Reveal>
        </Header>

        <Stage>
          <Quote key={i}>“{current.text}”</Quote>
          <Meta>
            <Name>{current.name}</Name>
            <Role>{current.role}</Role>
          </Meta>
          <Dots>
            {items.map((_, idx) => (
              <Dot key={idx} type="button" $on={idx === i} onClick={() => setI(idx)} aria-label={`Quote ${idx + 1}`} />
            ))}
          </Dots>
        </Stage>
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

const Stage = styled.div`
  max-width: 860px;
`;

const Quote = styled.blockquote`
  font-family: inherit;
  font-size: clamp(1.45rem, 3.4vw, 2.35rem);
  font-weight: 650;
  letter-spacing: -0.025em;
  line-height: 1.3;
  color: var(--l3-ink);
  margin: 0 0 1.75rem;
  animation: l3fade 0.55s var(--l3-ease);
  @keyframes l3fade {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }
`;

const Meta = styled.div`
  margin-bottom: 1.75rem;
`;

const Name = styled.div`
  font-weight: 700;
  color: var(--l3-ink);
  margin-bottom: 0.2rem;
`;

const Role = styled.div`
  font-size: 0.92rem;
  color: var(--l3-muted);
`;

const Dots = styled.div`
  display: flex;
  gap: 0.45rem;
`;

const Dot = styled.button<{ $on: boolean }>`
  width: ${({ $on }) => ($on ? '28px' : '8px')};
  height: 8px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  background: ${({ $on }) => ($on ? 'var(--l3-cobalt)' : 'var(--l3-line-strong)')};
  transition: width 0.3s var(--l3-ease), background 0.3s ease;
`;
