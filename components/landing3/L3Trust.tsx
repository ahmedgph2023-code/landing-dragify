import styled from 'styled-components';
import {
  Container,
  Display,
  GradientWord,
  Kicker,
  Lead,
  Reveal,
  useL3,
} from './shared';

export default function L3Trust() {
  const { c } = useL3();
  const points = (c('trust.points') as { title: string; desc: string }[]) || [];

  return (
    <Wrap id="trust">
      <Container>
        <Layout>
          <Left>
            <Reveal>
              <Kicker>{c('trust.kicker')}</Kicker>
              <Display>
                {c('trust.titlePre')}{' '}
                <GradientWord>{c('trust.titleGrad')}</GradientWord>
                {c('trust.titlePost')}
              </Display>
              <Lead>{c('trust.sub')}</Lead>
              <Diff>
                <DiffLabel>{c('trust.diffLabel')}</DiffLabel>
                <DiffText>{c('trust.diffText')}</DiffText>
              </Diff>
            </Reveal>
          </Left>
          <Right>
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <Point>
                  <Index>{String(i + 1).padStart(2, '0')}</Index>
                  <div>
                    <PointTitle>{p.title}</PointTitle>
                    <PointDesc>{p.desc}</PointDesc>
                  </div>
                </Point>
              </Reveal>
            ))}
            <Badge>{c('trust.badge')}</Badge>
          </Right>
        </Layout>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  padding-block: clamp(5rem, 11vw, 8.5rem);
  background: var(--l3-bg);
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const Left = styled.div``;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Diff = styled.div`
  margin-top: 2rem;
  padding: 1.25rem 1.35rem;
  border-inline-start: 3px solid var(--l3-cobalt);
  background: var(--l3-surface);
  border-radius: 0 14px 14px 0;
  [dir='rtl'] & {
    border-radius: 14px 0 0 14px;
  }
`;

const DiffLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--l3-cobalt);
  margin-bottom: 0.45rem;
`;

const DiffText = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--l3-ink-soft);
`;

const Point = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 1rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--l3-line);
`;

const Index = styled.div`
  font-family: inherit;
  font-weight: 700;
  color: var(--l3-faint);
  padding-top: 0.15rem;
`;

const PointTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--l3-ink);
  margin: 0 0 0.35rem;
`;

const PointDesc = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--l3-muted);
`;

const Badge = styled.div`
  margin-top: 1.25rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--l3-muted);
  letter-spacing: 0.02em;
`;
