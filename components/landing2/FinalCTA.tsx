import styled from 'styled-components';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Section, Reveal, PrimaryLink, GhostLink, Magnetic } from './shared';

const Banner = styled.div`
  position: relative;
  border-radius: 32px;
  padding: 5rem 3rem;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(120deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});

  @media (max-width: 768px) {
    padding: 3.5rem 1.75rem;
    border-radius: 24px;
  }
`;

const Blob = styled.div<{ $delay?: number }>`
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: rgba(255,255,255,0.14);
  filter: blur(50px);
  animation: nl-blob-float 12s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || 0}s;

  @media (prefers-reduced-motion: reduce) { animation: none; }

  @keyframes nl-blob-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -20px) scale(1.15); }
  }
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(70% 100% at 50% 0%, black, transparent 85%);
  pointer-events: none;
`;

const Title = styled.h2`
  position: relative;
  z-index: 1;
  font-size: clamp(1.95rem, 4.2vw, 2.9rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: white;
  margin: 0 0 1rem;
`;

const Subtitle = styled.p`
  position: relative;
  z-index: 1;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.9);
  max-width: 560px;
  margin: 0 auto 2.25rem;
  line-height: 1.6;
`;

const CTARow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    a { width: 100%; }
  }
`;

const WhiteLink = styled(PrimaryLink)`
  background: white;
  color: ${({ theme }) => theme.colors.accent.blue};
  box-shadow: 0 12px 32px -8px rgba(0,0,0,0.35);
`;

const OutlineLink = styled(GhostLink)`
  background: transparent;
  border-color: rgba(255,255,255,0.4);
  color: white;
`;

export default function FinalCTA() {
  const { t } = useLocalization();

  return (
    <Section $tight>
      <Container>
        <Reveal>
          <Banner>
            <Grid />
            <Blob style={{ top: '-8%', insetInlineStart: '-6%' }} />
            <Blob style={{ bottom: '-12%', insetInlineEnd: '-4%' }} $delay={4} />
            <Title>{t('landing2.finalCtaTitle')}</Title>
            <Subtitle>{t('hero.subtitle')}</Subtitle>
            <CTARow>
              <Magnetic>
                <WhiteLink href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer">
                  {t('hero.getStarted')}
                </WhiteLink>
              </Magnetic>
              <Magnetic>
                <OutlineLink href="https://calendly.com/cloudilic" target="_blank" rel="noopener noreferrer">
                  {t('hero.requestDemo')}
                </OutlineLink>
              </Magnetic>
            </CTARow>
          </Banner>
        </Reveal>
      </Container>
    </Section>
  );
}
