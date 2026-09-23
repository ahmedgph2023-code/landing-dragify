import styled from 'styled-components';
import { Container, MagneticButton, Reveal, useContent } from './shared';

export default function NLCTA() {
  const { c } = useContent();
  return (
    <Wrap>
      <Container>
        <Reveal>
          <Banner>
            <Grid aria-hidden />
            <Blob style={{ top: '-10%', insetInlineStart: '-6%' }} />
            <Blob style={{ bottom: '-14%', insetInlineEnd: '-4%' }} $delay={4} />
            <Title>
              {c('cta.title')} {c('cta.titleGradient')}{c('cta.titlePost')}
            </Title>
            <Subtitle>{c('cta.subtitle')}</Subtitle>
            <CTARow>
              <MagneticButton href="https://console.dragify.ai/" target="_blank" variant="primary">
                {c('cta.primary')}
              </MagneticButton>
              <MagneticButton href="https://calendly.com/cloudilic" target="_blank" variant="ghost" style={{ border: '1px solid rgba(255,255,255,0.22)', color: '#fff', background: 'rgba(255,255,255,0.08)' }}>
                {c('cta.secondary')}
              </MagneticButton>
            </CTARow>
          </Banner>
        </Reveal>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  padding: 5rem 0 8rem;
  background: var(--nl-bg);

  @media (max-width: 768px) {
    padding: 3.5rem 0 5rem;
  }
`;

const Banner = styled.div`
  position: relative;
  border-radius: 24px;
  padding: 5rem 3rem;
  text-align: center;
  overflow: hidden;
  background:
    radial-gradient(60% 80% at 20% 120%, rgba(59, 130, 246, 0.4), transparent 55%),
    radial-gradient(50% 70% at 90% 10%, rgba(139, 92, 246, 0.35), transparent 50%),
    linear-gradient(160deg, #1f2937 0%, #0b1220 100%);
  box-shadow: var(--nl-card-inset);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 3.5rem 1.75rem;
    border-radius: 20px;
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

const Blob = styled.div<{ $delay?: number }>`
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: rgba(255,255,255,0.14);
  filter: blur(50px);
  animation: nlCtaBlob 12s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || 0}s;

  @media (prefers-reduced-motion: reduce) { animation: none; }

  @keyframes nlCtaBlob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -20px) scale(1.15); }
  }
`;

const Title = styled.h2`
  position: relative;
  z-index: 1;
  font-size: clamp(1.95rem, 4.2vw, 2.9rem);
  font-weight: 700;
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
