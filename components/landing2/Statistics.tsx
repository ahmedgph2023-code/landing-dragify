import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useInView } from 'framer-motion';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Section, SectionHeader, Eyebrow, SectionTitle, SectionDescription, TiltCard, Reveal, getGsap, usePrefersReducedMotion } from './shared';

const Wrap = styled(Section)`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.cardBackground};
`;

const GhostLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;

const GhostNumber = styled.div`
  position: absolute;
  font-size: clamp(6rem, 22vw, 16rem);
  font-weight: 800;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px ${({ theme }) => theme.colors.border};
  white-space: nowrap;
  user-select: none;
`;

const Grid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const StatCardEl = styled(TiltCard)`
  padding: 2rem;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  --spot-color: ${({ theme }) => theme.colors.accent.blue}1c;
`;

const Percentage = styled.h3`
  position: relative;
  z-index: 1;
  font-size: 2.85rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  background: linear-gradient(100deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Desc = styled.p`
  position: relative;
  z-index: 1;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Details = styled.p`
  position: relative;
  z-index: 1;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

function Counter({ percentage }: { percentage: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const isNumeric = !isNaN(parseInt(percentage));
  const numericValue = isNumeric ? parseInt(percentage) : 0;
  const suffix = percentage.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    let start = 0;
    const end = numericValue;
    const duration = 1500;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericValue, isNumeric]);

  return <Percentage ref={ref}>{isNumeric ? count + suffix : percentage}</Percentage>;
}

export default function Statistics() {
  const { t } = useLocalization();
  const reduced = usePrefersReducedMotion();
  const stats = t('statistics.items') as { id: string; percentage: string; description: string; details: string }[];
  const wrapRef = useRef<HTMLDivElement>(null);
  const ghost1 = useRef<HTMLDivElement>(null);
  const ghost2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let ctx: any;
    (async () => {
      const { gsap, ScrollTrigger } = await getGsap();
      ctx = gsap.context(() => {
        gsap.to(ghost1.current, { yPercent: -22, ease: 'none', scrollTrigger: { trigger: wrapRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        gsap.to(ghost2.current, { yPercent: 26, ease: 'none', scrollTrigger: { trigger: wrapRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
      }, wrapRef);
    })();
    return () => ctx?.revert();
  }, [reduced]);

  if (!Array.isArray(stats)) return null;

  return (
    <Wrap ref={wrapRef}>
      <GhostLayer>
        <GhostNumber ref={ghost1} style={{ top: '4%', insetInlineStart: '-4%' }}>93%</GhostNumber>
        <GhostNumber ref={ghost2} style={{ bottom: '2%', insetInlineEnd: '-6%' }}>300+</GhostNumber>
      </GhostLayer>

      <Container>
        <SectionHeader>
          <Eyebrow style={{ justifyContent: 'center' }}>{t('landing2.eyebrows.results')}</Eyebrow>
          <SectionTitle dangerouslySetInnerHTML={{
            __html: t('statistics.title').replace(/<span class="gradient-text">/g, '<span class="gradient-word">'),
          }} />
          <SectionDescription>{t('statistics.subtitle')}</SectionDescription>
        </SectionHeader>

        <Grid>
          {stats.map((stat, i) => (
            <Reveal key={stat.id} delay={i * 0.06}>
              <StatCardEl>
                <Counter percentage={stat.percentage} />
                <Desc>{stat.description}</Desc>
                <Details>{stat.details}</Details>
              </StatCardEl>
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Wrap>
  );
}
