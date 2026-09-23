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

const tools = [
  { name: 'Slack', src: '/slack.png' },
  { name: 'Salesforce', src: '/salesforce.png' },
  { name: 'Outlook', src: '/outlook.png' },
  { name: 'OneDrive', src: '/onedrive.png' },
  { name: 'Google', src: '/google.png' },
  { name: 'Amazon', src: '/amazon.png' },
];

export default function L3Constellation() {
  const { c } = useL3();

  return (
    <Wrap id="stack">
      <Container>
        <Header>
          <Reveal>
            <Kicker>{c('stack.kicker')}</Kicker>
            <Display>
              {c('stack.titlePre')}{' '}
              <GradientWord>{c('stack.titleGrad')}</GradientWord>
            </Display>
            <Lead>{c('stack.sub')}</Lead>
          </Reveal>
        </Header>

        <Panel>
          <Ring aria-hidden />
          <Core>
            <Image src="/logo3.png" alt="Dragify" width={56} height={56} style={{ objectFit: 'contain' }} />
            <CoreLabel>Dragify</CoreLabel>
          </Core>

          <SatGrid>
            {tools.map((t) => (
              <Sat key={t.name}>
                <Image src={t.src} alt={t.name} width={32} height={32} style={{ objectFit: 'contain' }} />
                <span>{t.name}</span>
              </Sat>
            ))}
          </SatGrid>
        </Panel>

        <Stat>
          <strong>{c('stack.statNumber')}</strong>
          <span>{c('stack.statLabel')}</span>
        </Stat>
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

const Panel = styled.div`
  position: relative;
  max-width: 720px;
  margin: 0 auto 2rem;
  padding: 2.5rem 1.5rem 1.75rem;
  border-radius: 24px;
  border: 1px solid var(--l3-line);
  background: var(--l3-bg-deep);
  overflow: hidden;
`;

const Ring = styled.div`
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  border: 1px dashed var(--l3-line-strong);
  opacity: 0.55;
  pointer-events: none;
  @media (max-width: 640px) { display: none; }
`;

const Core = styled.div`
  position: relative;
  z-index: 2;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 28px;
  border: 1px solid var(--l3-line-strong);
  background: var(--l3-elevated);
  box-shadow: 0 0 0 6px var(--l3-glow), var(--l3-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
`;

const CoreLabel = styled.span`
  font-size: 0.68rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--l3-muted);
`;

const SatGrid = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  @media (max-width: 520px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Sat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.9rem 0.7rem;
  border-radius: 14px;
  border: 1px solid var(--l3-line);
  background: var(--l3-elevated);
  transition: transform 0.3s ease, border-color 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    border-color: var(--l3-blue);
  }
  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--l3-ink-soft);
  }
`;

const Stat = styled.div`
  text-align: center;
  max-width: 520px;
  margin: 0 auto;
  strong {
    display: block;
    font-size: clamp(2.2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--l3-ink);
    margin-bottom: 0.45rem;
  }
  span {
    color: var(--l3-muted);
    font-size: 0.98rem;
    line-height: 1.55;
  }
`;
