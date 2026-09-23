import Image from 'next/image';
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

const IMAGES = [
  '/images/services/ai_agent_working_autonomously.png',
  '/images/services/multiple_ai_agents_collaborating.png',
  '/images/services/one-click_launch_deployment.png',
  '/images/services/scalable_api_network_connections.png',
];

export default function L3Pillars() {
  const { c } = useL3();
  const items = (c('pillars.items') as { tag: string; title: string; description: string }[]) || [];

  return (
    <Wrap id="pillars">
      <Container>
        <Header>
          <Reveal>
            <Kicker>{c('pillars.kicker')}</Kicker>
            <Display>
              {c('pillars.titlePre')}{' '}
              <GradientWord>{c('pillars.titleGrad')}</GradientWord>
            </Display>
            <Lead>{c('pillars.sub')}</Lead>
          </Reveal>
        </Header>

        <Grid>
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <Card>
                <Media>
                  <Image src={IMAGES[i % IMAGES.length]} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                </Media>
                <Body>
                  <Tag>{it.tag}</Tag>
                  <Title>{it.title}</Title>
                  <Desc>{it.description}</Desc>
                </Body>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  padding-block: clamp(4.5rem, 10vw, 7.5rem);
  background: var(--l3-bg-deep);
`;

const Header = styled.div`
  max-width: 700px;
  margin-bottom: 2.75rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  border-radius: 20px;
  border: 1px solid var(--l3-line);
  background: var(--l3-elevated);
  overflow: hidden;
  box-shadow: var(--l3-shadow);
  transition: transform 0.35s var(--l3-ease), border-color 0.35s ease;
  &:hover {
    transform: translateY(-4px);
    border-color: color-mix(in srgb, var(--l3-blue) 40%, var(--l3-line));
  }
`;

const Media = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--l3-surface);
`;

const Body = styled.div`
  padding: 1.35rem 1.4rem 1.5rem;
`;

const Tag = styled.div`
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--l3-blue);
  margin-bottom: 0.55rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--l3-ink);
  margin: 0 0 0.55rem;
`;

const Desc = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--l3-muted);
`;
