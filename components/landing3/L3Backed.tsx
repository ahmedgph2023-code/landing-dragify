import Image from 'next/image';
import styled from 'styled-components';
import { useL3 } from './shared';

const logos = [
  { src: '/f6.png', w: 110, h: 34 },
  { src: '/itida1.png', w: 110, h: 46 },
  { src: '/amazon.png', w: 110, h: 34 },
  { src: '/qatarr.svg', w: 160, h: 34 },
  { src: '/google.png', w: 100, h: 48 },
  { src: '/TIEC1.png', w: 110, h: 34 },
  { src: '/nvidia.png', w: 110, h: 34 },
];

export default function L3Backed() {
  const { c, isRTL } = useL3();
  const row = [...logos, ...logos];

  return (
    <Wrap>
      <Label>{c('backed.label')}</Label>
      <Mask>
        <Track $rtl={isRTL}>
          {row.map((logo, i) => (
            <Item key={`${logo.src}-${i}`}>
              <Image src={logo.src} alt="" width={logo.w} height={logo.h} style={{ objectFit: 'contain' }} />
            </Item>
          ))}
        </Track>
      </Mask>
    </Wrap>
  );
}

const Wrap = styled.section`
  padding: 2.25rem 0 2.75rem;
  border-block: 1px solid var(--l3-line);
  background: var(--l3-bg);
`;

const Label = styled.p`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--l3-faint);
  margin: 0 0 1.5rem;
`;

const Mask = styled.div`
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
`;

const Track = styled.div<{ $rtl: boolean }>`
  display: flex;
  align-items: center;
  gap: 3.5rem;
  width: max-content;
  animation: l3marquee 32s linear infinite;
  animation-direction: ${({ $rtl }) => ($rtl ? 'reverse' : 'normal')};
  @media (prefers-reduced-motion: reduce) { animation: none; }
  @keyframes l3marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
`;

const Item = styled.div`
  display: flex;
  filter: grayscale(1) opacity(0.45);
  transition: filter 0.3s ease;
  &:hover { filter: none; }
`;
