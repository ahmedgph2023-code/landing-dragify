import Image from 'next/image';
import styled from 'styled-components';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Reveal } from './shared';

const logos = [
  { src: '/f6.png', w: 120, h: 36 },
  { src: '/itida1.png', w: 120, h: 50 },
  { src: '/amazon.png', w: 120, h: 36 },
  { src: '/qatarr.svg', w: 180, h: 36 },
  { src: '/google.png', w: 110, h: 55 },
  { src: '/TIEC1.png', w: 120, h: 36 },
  { src: '/nvidia.png', w: 120, h: 36 },
];

const Wrap = styled.section`
  padding-block: 3rem;
  background: ${({ theme }) => theme.colors.background};
  border-block: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.p`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1.75rem;
  opacity: 0.75;
`;

const MarqueeMask = styled.div`
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
`;

const MarqueeTrack = styled.div<{ $reverse: boolean }>`
  display: flex;
  align-items: center;
  gap: 4rem;
  width: max-content;
  animation: ${({ $reverse }) => ($reverse ? 'nl-marquee-rev' : 'nl-marquee')} 30s linear infinite;

  @media (prefers-reduced-motion: reduce) { animation: none; }

  @keyframes nl-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes nl-marquee-rev {
    from { transform: translateX(-50%); }
    to { transform: translateX(0); }
  }
`;

const LogoItem = styled.div`
  display: flex;
  align-items: center;
  filter: grayscale(1) opacity(0.5);
  transition: filter 0.3s ease;
  &:hover { filter: grayscale(0) opacity(1); }
`;

export default function Partners() {
  const { t, isRTL } = useLocalization();
  const doubled = [...logos, ...logos];

  return (
    <Wrap>
      <Container>
        <Reveal y={12}>
          <Title>{t('partners.title')}</Title>
        </Reveal>
        <MarqueeMask>
          <MarqueeTrack $reverse={isRTL}>
            {doubled.map((logo, i) => (
              <LogoItem key={`${logo.src}-${i}`}>
                <Image src={logo.src} alt="" width={logo.w} height={logo.h} style={{ objectFit: 'contain' }} />
              </LogoItem>
            ))}
          </MarqueeTrack>
        </MarqueeMask>
      </Container>
    </Wrap>
  );
}
