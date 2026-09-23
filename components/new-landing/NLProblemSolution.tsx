import styled from 'styled-components';
import { Container, Eyebrow, GradientSpan, Reveal, SectionSubtitle, SectionTitle, useContent } from './shared';

export default function NLProblemSolution() {
  const { c } = useContent();
  const beats: { before: string; after: string }[] = c('problem.beats');

  return (
    <Wrap>
      <Container $width={880}>
        <Reveal>
          <Head>
            <Eyebrow>{c('problem.eyebrow')}</Eyebrow>
            <SectionTitle style={{ textAlign: 'center' }}>
              {c('problem.title')}<br /><GradientSpan>{c('problem.titleGradient')}</GradientSpan>
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto', textAlign: 'center' }}>
              {c('problem.subtitle')}
            </SectionSubtitle>
          </Head>
        </Reveal>

        <List>
          {beats.map((beat, i) => (
            <Reveal key={i} delay={i * 0.08} y={22}>
              <Row>
                <Index>{String(i + 1).padStart(2, '0')}</Index>
                <Texts>
                  <Before>{beat.before}</Before>
                  <Connector>
                    <ConnectorLine />
                  </Connector>
                  <After>
                    <GradientSpan>{beat.after}</GradientSpan>
                  </After>
                </Texts>
              </Row>
            </Reveal>
          ))}
        </List>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  padding: 7rem 0;
  background: var(--nl-bg);
`;

const Head = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 2.25rem 0;
  border-bottom: 1px solid var(--nl-border);

  &:first-child {
    border-top: 1px solid var(--nl-border);
  }

  @media (max-width: 640px) {
    gap: 1.1rem;
  }
`;

const Index = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: var(--nl-text-faint);
  padding-top: 0.2rem;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const Before = styled.div`
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--nl-text-faint);
  text-decoration: line-through;
  text-decoration-color: var(--nl-border-strong);
  text-decoration-thickness: 1.5px;

  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
`;

const Connector = styled.div`
  display: flex;
  align-items: center;
  height: 14px;
`;

const ConnectorLine = styled.div`
  width: 1.5px;
  height: 100%;
  margin-inline-start: 0.4rem;
  background: linear-gradient(var(--nl-border-strong), var(--nl-blue));
`;

const After = styled.div`
  font-size: 1.3rem;
  font-weight: 650;
  line-height: 1.4;
  letter-spacing: -0.01em;

  @media (max-width: 640px) {
    font-size: 1.12rem;
  }
`;
