import Image from 'next/image';
import styled from 'styled-components';
import { Container, Reveal, useContent } from './shared';

const logos = [
  { src: '/f6.png', alt: 'F6S', w: 110, h: 32 },
  { src: '/itida1.png', alt: 'ITIDA', w: 100, h: 46 },
  { src: '/amazon.png', alt: 'AWS Activate', w: 110, h: 32 },
  { src: '/qatarr.svg', alt: 'Qatar FinTech Hub', w: 170, h: 34 },
  { src: '/google.png', alt: 'Google for Startups', w: 100, h: 52 },
  { src: '/TIEC1.png', alt: 'TIEC', w: 110, h: 32 },
  { src: '/nvidia.png', alt: 'Nvidia Inception', w: 110, h: 32 },
];

export default function NLMarquee() {
  const { c } = useContent();
  const track = [...logos, ...logos];
  return (
    <Wrap>
      <Container>
        <Reveal>
          <Label>{c('marquee.label')}</Label>
        </Reveal>
      </Container>
      <Edge $side="start" />
      <Edge $side="end" />
      <Track>
        <Row>
          {track.map((l, i) => (
            <LogoBox key={i}>
              <Image src={l.src} alt={l.alt} width={l.w} height={l.h} style={{ objectFit: 'contain', width: 'auto', height: '100%', maxHeight: `${l.h}px` }} />
            </LogoBox>
          ))}
        </Row>
      </Track>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  padding: 3.5rem 0 5rem;
  background: var(--nl-bg);
`;

const Label = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: var(--nl-text-faint);
  margin: 0 0 2.25rem;
`;

const Edge = styled.div<{ $side: 'start' | 'end' }>`
  position: absolute;
  top: 4.5rem;
  bottom: 0;
  ${({ $side }) => ($side === 'start' ? 'inset-inline-start: 0;' : 'inset-inline-end: 0;')}
  width: 120px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    ${({ $side }) => ($side === 'start' ? '90deg' : '270deg')},
    var(--nl-bg),
    transparent
  );
  @media (max-width: 640px) {
    width: 48px;
  }
`;

const Track = styled.div`
  overflow: hidden;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  gap: 4rem;
  animation: nlMarquee 32s linear infinite;

  @keyframes nlMarquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  filter: var(--nl-logo-filter);
  transition: filter 0.3s ease;
  flex-shrink: 0;

  &:hover {
    filter: var(--nl-logo-filter-hover);
  }
`;
