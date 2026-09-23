import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Section, Eyebrow, SectionTitle, SectionDescription, Card, Reveal, ease } from './shared';

const icons = [
  <svg key="0" viewBox="0 0 24 24" fill="currentColor"><path d="M14.6253 4.49867C14.9986 4.37333 15.2493 4.37333 15.2493 4.37333L14.5026 22L3.25195 19.8747C3.25195 19.8747 4.75062 8.50134 4.75062 8.12534C4.75062 7.62666 4.75062 7.62666 5.37464 7.376C5.42904 7.376 5.57751 7.32872 5.80998 7.25472C6.11283 7.15828 6.55823 7.01647 7.12395 6.87466C7.49995 5.25066 8.75064 2 11.3746 2C11.7506 2 12.124 2.12267 12.3746 2.624H12.5C13.6253 2.624 14.2493 3.49867 14.6253 4.49867Z"/></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="currentColor"><path d="M9.35499 12.5484C8.22596 12.5484 7.25822 13.5162 7.25822 14.6452V19.871C7.25822 21 8.22596 21.9678 9.35499 21.9678C10.484 21.9678 11.4518 21 11.4518 19.871V14.6452C11.4518 13.4517 10.5485 12.5484 9.35499 12.5484Z"/><path d="M2 14.6452C2 15.7742 2.96774 16.742 4.09677 16.742C5.22581 16.742 6.19355 15.7742 6.19355 14.6452V12.5484H4.12903C2.96774 12.5484 2 13.4517 2 14.6452Z"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="currentColor"><path d="M12.9032 4.03223L7 9.129L2 18.1935H6.54839L12.9032 4.03223ZM13.7419 5.25803L11.2258 12.3548L16 18.3871L6.64516 19.9677H22L13.7419 5.25803Z"/></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5201 2.01562H4.51208C3.12721 2.01562 2 3.14284 2 4.5277C2 4.5277 2 4.33447 2 19.5035C2 20.8562 3.12721 21.9834 4.51208 21.9834H19.4879C20.8406 21.9834 22 20.8562 22 19.4713V4.5277C21.9678 3.14284 20.8728 2.01562 19.5201 2.01562Z"/></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.2581 14.2901L8.87097 3.25781H15.129L21.5484 14.2901H15.2581ZM9.87097 15.1933L6.74194 20.7417H18.871L22 15.1933H9.87097ZM8.03226 4.61265L2 15.1933L5.12903 20.7417L11.2258 10.161L8.03226 4.61265Z"/></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5939 11.0792H12.3209V13.8256H18.9768C18.6214 17.6382 15.5196 19.286 12.5148 19.286C8.70223 19.286 5.30969 16.3135 5.30969 12.0162C5.30969 7.88057 8.54068 4.74651 12.5148 4.74651C15.5519 4.74651 17.3936 6.71741 17.3936 6.71741L19.2676 4.74651C19.2676 4.74651 16.7474 2.00016 12.3856 2.00016C6.6344 1.96785 2.24023 6.78203 2.24023 11.9839C2.24023 17.0243 6.37592 22 12.4825 22C17.8783 22 21.7554 18.349 21.7554 12.8886C21.7877 11.7578 21.5939 11.0792 21.5939 11.0792Z"/></svg>,
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3.67188 17.3799L6.74178 15.0091C8.38312 17.1368 10.1156 18.1398 12.0305 18.1398C13.9454 18.1398 15.6476 17.1672 17.1977 15.0395L20.3284 17.3495C18.0792 20.3891 15.2828 22 12.0305 22C8.80865 22 5.98191 20.3891 3.67188 17.3799Z"/></svg>,
  <svg key="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>,
];

const Grid = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const Left = styled.div`
  flex: 1;
  max-width: 460px;
  @media (max-width: 992px) { max-width: 100%; text-align: center; }
`;

const SeeAll = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  margin-top: 1.75rem;
  color: ${({ theme }) => theme.colors.accent.blue};
`;

/* --------------------------------- orbit --------------------------------- */
const OrbitWrap = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 460px;
  aspect-ratio: 1;
  margin-inline: auto;

  @media (max-width: 992px) { max-width: 340px; }
`;

const OrbitPath = styled.div<{ $size: number }>`
  position: absolute;
  inset: 0;
  margin: auto;
  width: ${({ $size }) => $size}%;
  height: ${({ $size }) => $size}%;
  border-radius: 50%;
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const Ring = styled.div<{ $duration: number; $reverse?: boolean }>`
  position: absolute;
  inset: 0;
  animation: nl-orbit-spin ${({ $duration }) => $duration}s linear infinite ${({ $reverse }) => ($reverse ? 'reverse' : 'normal')};

  @media (prefers-reduced-motion: reduce) { animation: none; }

  @keyframes nl-orbit-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Slot = styled.div<{ $angle: number; $radius: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform: rotate(${({ $angle }) => $angle}deg) translateX(${({ $radius }) => $radius});
`;

const CounterSpin = styled.div<{ $duration: number; $reverse?: boolean }>`
  animation: nl-orbit-counterspin ${({ $duration }) => $duration}s linear infinite ${({ $reverse }) => ($reverse ? 'normal' : 'reverse')};
  transform: translate(-50%, -50%);

  @media (prefers-reduced-motion: reduce) { animation: none; }

  @keyframes nl-orbit-counterspin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const IconBubble = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.small};
  color: ${({ theme }) => theme.colors.text.primary};

  svg { width: 22px; height: 22px; }

  @media (max-width: 992px) {
    width: 40px; height: 40px;
    svg { width: 18px; height: 18px; }
  }
`;

const Hub = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 96px;
  height: 96px;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  box-shadow: 0 20px 45px -14px ${({ theme }) => theme.colors.accent.blue}77;

  @media (max-width: 992px) { width: 76px; height: 76px; border-radius: 20px; }
`;

function OrbitRing({ radius, size, duration, reverse, iconSlice }: { radius: string; size: number; duration: number; reverse?: boolean; iconSlice: React.ReactElement[] }) {
  const step = 360 / iconSlice.length;
  return (
    <>
      <OrbitPath $size={size} />
      <Ring $duration={duration} $reverse={reverse}>
        {iconSlice.map((icon, i) => (
          <Slot key={i} $angle={step * i} $radius={radius}>
            <CounterSpin $duration={duration} $reverse={reverse}>
              <IconBubble>{icon}</IconBubble>
            </CounterSpin>
          </Slot>
        ))}
      </Ring>
    </>
  );
}

export default function Integrations() {
  const { t } = useLocalization();
  const ring1 = icons.slice(0, 4);
  const ring2 = icons.slice(4, 8);

  return (
    <Section>
      <Container>
        <Grid>
          <Left>
            <Eyebrow>{t('landing2.eyebrows.integrations')}</Eyebrow>
            <SectionTitle style={{ textAlign: 'start' }}>{t('integrations.title')}</SectionTitle>
            <SectionDescription>{t('integrations.description')}</SectionDescription>
            <SeeAll href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer">
              {t('integrations.seeAll')}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 12.5l4 4 9-9" /></svg>
            </SeeAll>
          </Left>

          <Reveal>
            <OrbitWrap>
              <OrbitRing radius="clamp(85px, 15vw, 145px)" size={62} duration={34} iconSlice={ring1} />
              <OrbitRing radius="clamp(130px, 21vw, 230px)" size={100} duration={50} reverse iconSlice={ring2} />
              <Hub
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: ease.out }}
              >
                <Image src="/logo3.png" alt="Dragify" width={44} height={44} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </Hub>
            </OrbitWrap>
          </Reveal>
        </Grid>
      </Container>
    </Section>
  );
}
