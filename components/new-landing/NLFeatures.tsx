import styled from 'styled-components';
import { Container, Eyebrow, GradientSpan, Reveal, SectionSubtitle, SectionTitle, useContent } from './shared';

function AgentVisual() {
  return (
    <VisualBox $big>
      <OrbCore>
        <OrbRing $delay={0} />
        <OrbRing $delay={0.6} />
        <OrbRing $delay={1.2} />
        <OrbDot />
      </OrbCore>
      <OrbChip style={{ top: '10%', left: '12%' }} $delay={0}>Support</OrbChip>
      <OrbChip style={{ top: '14%', right: '10%' }} $delay={0.4}>Sales</OrbChip>
      <OrbChip style={{ bottom: '12%', left: '18%' }} $delay={0.8}>Ops</OrbChip>
      <OrbChip style={{ bottom: '10%', right: '14%' }} $delay={1.2}>Finance</OrbChip>
    </VisualBox>
  );
}

function OrchestrationVisual() {
  const nodes = [{ x: 50, y: 18 }, { x: 18, y: 72 }, { x: 82, y: 72 }];
  return (
    <VisualBox>
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ maxWidth: 200 }}>
        <line x1={nodes[0].x} y1={nodes[0].y} x2={nodes[1].x} y2={nodes[1].y} stroke="var(--nl-border-strong)" strokeWidth="1" />
        <line x1={nodes[0].x} y1={nodes[0].y} x2={nodes[2].x} y2={nodes[2].y} stroke="var(--nl-border-strong)" strokeWidth="1" />
        <line x1={nodes[1].x} y1={nodes[1].y} x2={nodes[2].x} y2={nodes[2].y} stroke="var(--nl-border-strong)" strokeWidth="1" />
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={i === 0 ? 7 : 5.5} fill={i === 0 ? 'var(--nl-blue)' : 'var(--nl-violet)'}>
            <animate attributeName="r" values={`${i === 0 ? 7 : 5.5};${i === 0 ? 8.5 : 6.8};${i === 0 ? 7 : 5.5}`} dur="2.4s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
          </circle>
        ))}
      </svg>
    </VisualBox>
  );
}

function DeployVisual() {
  const { c } = useContent();
  const lines: string[] = c('features.deployLines');
  return (
    <VisualBox>
      <Terminal>
        <TermChrome>
          <span /><span /><span />
        </TermChrome>
        {lines.map((l, i) => (
          <TermLine key={`${l}-${i}`} $delay={i * 0.5}>{l}</TermLine>
        ))}
        <TermCursor />
      </Terminal>
    </VisualBox>
  );
}

function APIVisual() {
  const { c } = useContent();
  const chips: string[] = c('features.apiChips');
  return (
    <VisualBox>
      <ChipStack>
        {chips.map((chip, i) => (
          <Chip key={chip} $i={i}>{chip}</Chip>
        ))}
        <ChipHub>API</ChipHub>
      </ChipStack>
    </VisualBox>
  );
}

export default function NLFeatures() {
  const { c } = useContent();
  const items: { tag: string; title: string; description: string }[] = c('features.items');
  if (!Array.isArray(items) || items.length < 4) return null;
  const [big, ...rest] = items;
  const smallVisuals = [OrchestrationVisual, DeployVisual, APIVisual];

  return (
    <Wrap>
      <Container>
        <Reveal>
          <Head>
            <Eyebrow>{c('features.eyebrow')}</Eyebrow>
            <SectionTitle style={{ textAlign: 'center' }}>
              {c('features.title')} <GradientSpan>{c('features.titleGradient')}</GradientSpan>
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto', textAlign: 'center' }}>{c('features.subtitle')}</SectionSubtitle>
          </Head>
        </Reveal>

        <Grid>
          <Reveal delay={0.05}>
            <BigCard>
              <BigVisualWrap>
                <AgentVisual />
              </BigVisualWrap>
              <CardText>
                <TagPill>{big.tag}</TagPill>
                <BigTitle>{big.title}</BigTitle>
                <Desc>{big.description}</Desc>
              </CardText>
            </BigCard>
          </Reveal>

          {rest.map((item, i) => {
            const Visual = smallVisuals[i];
            return (
              <Reveal key={item.title} delay={0.1 + i * 0.08}>
                <SmallCard>
                  <SmallVisualWrap>
                    <Visual />
                  </SmallVisualWrap>
                  <CardText>
                    <TagPill>{item.tag}</TagPill>
                    <SmallTitle>{item.title}</SmallTitle>
                    <Desc>{item.description}</Desc>
                  </CardText>
                </SmallCard>
              </Reveal>
            );
          })}
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

const Head = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
`;

const cardBase = `
  position: relative;
  border-radius: var(--nl-radius);
  border: 1px solid var(--nl-border);
  background:
    radial-gradient(90% 60% at 50% 0%, rgba(59,130,246,0.1), transparent 55%),
    var(--nl-bg-elevated);
  box-shadow: var(--nl-card-inset);
  overflow: hidden;
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: var(--nl-border-strong);
    transform: translateY(-3px);
    box-shadow: var(--nl-card-inset), var(--nl-shadow-md);
  }
`;

const BigCard = styled.div`
  ${cardBase}
  grid-row: 1 / 4;
  grid-column: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    grid-row: auto;
  }
`;

const SmallCard = styled.div`
  ${cardBase}
  grid-column: 2;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    grid-column: auto;
  }
`;

const BigVisualWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem 1rem;
  min-height: 260px;
`;

const SmallVisualWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.25rem 0.5rem;
  min-height: 140px;
`;

const CardText = styled.div`
  padding: 1.5rem 1.75rem 1.85rem;
  margin-top: auto;
`;

const TagPill = styled.div`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.28rem 0.7rem;
  border-radius: 100px;
  color: var(--nl-blue);
  background: var(--nl-surface);
  border: 1px solid var(--nl-border);
  margin-bottom: 0.9rem;
`;

const BigTitle = styled.h3`
  font-size: clamp(1.4rem, 2.2vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--nl-text);
  margin: 0 0 0.65rem;
`;

const SmallTitle = styled.h3`
  font-size: 1.08rem;
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--nl-text);
  margin: 0 0 0.5rem;
`;

const Desc = styled.p`
  font-size: 0.94rem;
  line-height: 1.6;
  color: var(--nl-text-dim);
  margin: 0;
`;

const VisualBox = styled.div<{ $big?: boolean }>`
  position: relative;
  width: 100%;
  max-width: ${({ $big }) => ($big ? '320px' : '220px')};
  aspect-ratio: ${({ $big }) => ($big ? '1 / 0.7' : '4 / 3')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrbCore = styled.div`
  position: relative;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrbDot = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--nl-gradient-brand);
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.55);
`;

const OrbRing = styled.div<{ $delay: number }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(139, 92, 246, 0.45);
  opacity: 0;
  animation: nlOrbRing 2.4s ease-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;

  @keyframes nlOrbRing {
    0% { transform: scale(0.4); opacity: 0.6; }
    100% { transform: scale(1.9); opacity: 0; }
  }
`;

const OrbChip = styled.div<{ $delay: number }>`
  position: absolute;
  font-size: 0.68rem;
  font-weight: 650;
  padding: 0.35rem 0.7rem;
  border-radius: 100px;
  background: var(--nl-bg-elevated);
  border: 1px solid var(--nl-border);
  color: var(--nl-text-dim);
  box-shadow: var(--nl-shadow-sm);
  animation: nlOrbChipFloat 3.8s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;

  @keyframes nlOrbChipFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
`;

const Terminal = styled.div`
  width: 92%;
  max-width: 220px;
  border-radius: 10px;
  padding: 0.85rem 1rem 1rem;
  background: var(--nl-bg);
  border: 1px solid var(--nl-border);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.72rem;
  line-height: 1.85;
  color: var(--nl-text-dim);
`;

const TermChrome = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 0.6rem;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--nl-border-strong);
  }
`;

const TermLine = styled.div<{ $delay: number }>`
  opacity: 0;
  animation: nlTermIn 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  white-space: nowrap;
  overflow: hidden;

  &:first-child { color: var(--nl-text); font-weight: 600; }
  &:last-child { color: var(--nl-green); }

  @keyframes nlTermIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const TermCursor = styled.div`
  width: 6px;
  height: 12px;
  background: var(--nl-text-dim);
  margin-top: 3px;
  animation: nlBlink 1s step-start infinite;
  @keyframes nlBlink { 50% { opacity: 0; } }
`;

const ChipStack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChipHub = styled.div`
  position: relative;
  z-index: 2;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.66rem;
  font-weight: 700;
  color: #fff;
  background: var(--nl-gradient-brand);
  box-shadow: var(--nl-shadow-md);
`;

const Chip = styled.div<{ $i: number }>`
  position: absolute;
  font-size: 0.66rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: 100px;
  background: var(--nl-bg-elevated);
  border: 1px solid var(--nl-border);
  color: var(--nl-text-dim);
  animation: nlFloatChip 3.6s ease-in-out infinite;
  animation-delay: ${({ $i }) => $i * 0.3}s;

  ${({ $i }) => {
    const positions = [
      'top: 6%; left: 4%;',
      'top: 6%; right: 4%;',
      'bottom: 8%; left: 6%;',
      'bottom: 8%; right: 6%;',
    ];
    return positions[$i];
  }}

  @keyframes nlFloatChip {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
`;
