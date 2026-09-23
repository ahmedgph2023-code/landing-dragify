import styled from 'styled-components';
import { Container, Eyebrow, GradientSpan, Reveal, SectionSubtitle, SectionTitle, useContent } from './shared';

export default function NLSecurity() {
  const { c } = useContent();
  const points: { title: string; desc: string }[] = c('security.points');

  return (
    <Wrap>
      <Container>
        <Grid>
          <Reveal>
            <Copy>
              <Eyebrow>{c('security.eyebrow')}</Eyebrow>
              <SectionTitle $size="clamp(2rem, 3.4vw, 2.9rem)">
                {c('security.title')} <GradientSpan>{c('security.titleGradient')}</GradientSpan>{c('security.titlePost')}
              </SectionTitle>
              <SectionSubtitle>{c('security.subtitle')}</SectionSubtitle>

              <List>
                {points.map((p) => (
                  <Item key={p.title}>
                    <Check>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Check>
                    <div>
                      <ItemTitle>{p.title}</ItemTitle>
                      <ItemDesc>{p.desc}</ItemDesc>
                    </div>
                  </Item>
                ))}
              </List>
            </Copy>
          </Reveal>

          <Reveal delay={0.15}>
            <Visual>
              <Scanline />
              <ShieldIcon>
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z" stroke="url(#nlShieldGrad)" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M8.5 12.5l2.4 2.4L16 9.6" stroke="url(#nlShieldGrad)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="nlShieldGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4d7fff" />
                      <stop offset="100%" stopColor="#9b6bff" />
                    </linearGradient>
                  </defs>
                </svg>
              </ShieldIcon>
              <VisualRow>
                <VisualLine $w="86%" />
                <VisualLine $w="62%" />
                <VisualLine $w="74%" />
              </VisualRow>
              <VisualFoot>{c('security.footBadge')}</VisualFoot>
            </Visual>
          </Reveal>
        </Grid>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  padding: 8rem 0;
  background: var(--nl-bg);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 3.5rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Copy = styled.div`
  max-width: 560px;
`;

const List = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Item = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const Check = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.15rem;
  background: var(--nl-gradient-brand);
`;

const ItemTitle = styled.div`
  font-weight: 650;
  color: var(--nl-text);
  margin-bottom: 0.25rem;
`;

const ItemDesc = styled.div`
  font-size: 0.92rem;
  color: var(--nl-text-dim);
  line-height: 1.55;
`;

const Visual = styled.div`
  position: relative;
  border-radius: 24px;
  border: 1px solid var(--nl-border);
  background: radial-gradient(80% 80% at 50% 0%, rgba(77,127,255,0.1), transparent), var(--nl-bg-elevated);
  padding: 3rem 2.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  box-shadow: var(--nl-shadow-md);
`;

const Scanline = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--nl-blue), transparent);
  opacity: 0.7;
  animation: nlScan 3.2s ease-in-out infinite;

  @keyframes nlScan {
    0% { top: 8%; opacity: 0; }
    15% { opacity: 0.8; }
    50% { top: 92%; opacity: 0.8; }
    65% { opacity: 0; }
    100% { top: 92%; opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    display: none;
  }
`;

const ShieldIcon = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--nl-surface);
  border: 1px solid var(--nl-border);
`;

const VisualRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const VisualLine = styled.div<{ $w: string }>`
  height: 8px;
  width: ${({ $w }) => $w};
  border-radius: 100px;
  background: var(--nl-surface-strong);
`;

const VisualFoot = styled.div`
  font-size: 0.78rem;
  color: var(--nl-text-faint);
  text-align: center;
`;
