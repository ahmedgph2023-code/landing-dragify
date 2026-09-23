import type { ReactElement } from 'react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Section, Eyebrow, SectionTitle, SectionDescription, TiltCard, Reveal, getGsap, usePrefersReducedMotion } from './shared';

const icons: ReactElement[] = [
  <svg key="0" width="28" height="28" viewBox="0 0 16 16" fill="currentColor"><path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/></svg>,
  <svg key="1" width="28" height="28" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5"/></svg>,
  <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H16L19 6V19C19 20.1046 18.1046 21 17 21H18Z"/><path d="M9 7H13"/><path d="M9 11H15"/><path d="M9 15H15"/></svg>,
  <svg key="3" width="28" height="28" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/></svg>,
  <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1V23"/><path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"/></svg>,
  <svg key="5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12H2"/><path d="M5.45 5.11L2 12V19C2 19.5304 2.21071 20.0391 2.58579 20.4142C2.96086 20.7893 3.46957 21 4 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11V5.11Z"/><path d="M6 16H6.01"/><path d="M10 16H10.01"/></svg>,
];

const Pin = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.background};
`;

const Sticky = styled.div`
  position: relative;
  height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
    padding-block: 5rem;
    overflow: visible;
  }
`;

const Head = styled.div`
  margin-bottom: 2.5rem;
  flex-shrink: 0;
`;

const Viewport = styled.div`
  overflow: hidden;
  @media (max-width: 768px) {
    overflow-x: auto;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
  }
`;

const Track = styled.div<{ $rtl: boolean }>`
  display: flex;
  flex-direction: ${({ $rtl }) => ($rtl ? 'row-reverse' : 'row')};
  gap: 1.5rem;
  width: max-content;
  padding-inline: 1.5rem;

  @media (max-width: 768px) {
    padding-inline-end: 3rem;
  }
`;

const UseCaseCard = styled(TiltCard)`
  width: min(380px, 78vw);
  flex-shrink: 0;
  padding: 2.25rem;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  scroll-snap-align: start;
  --spot-color: ${({ theme }) => theme.colors.accent.purple}22;
`;

const Index = styled.div`
  position: relative;
  z-index: 1;
  font-size: 0.85rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent.purple};
  margin-bottom: 1.25rem;
`;

const IconWrap = styled.div`
  position: relative;
  z-index: 1;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}20, ${({ theme }) => theme.colors.accent.purple}20);
  color: ${({ theme }) => theme.colors.accent.purple};
`;

const Title = styled.h3`
  position: relative;
  z-index: 1;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Desc = styled.p`
  position: relative;
  z-index: 1;
  font-size: 0.98rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.25rem;
`;

const Tags = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  padding: 0.3rem 0.65rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default function Agents() {
  const { t, isRTL } = useLocalization();
  const reduced = usePrefersReducedMotion();
  const items = t('agents.items') as { title: string; description: string; tags: string[] }[];
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !Array.isArray(items)) return;
    let ctx: any;
    let trigger: any;

    (async () => {
      const { gsap, ScrollTrigger } = await getGsap();
      ctx = gsap.context(() => {
        const track = trackRef.current;
        const wrap = pinRef.current;
        if (!track || !wrap) return;
        const distance = () => track.scrollWidth - wrap.offsetWidth;
        const dir = isRTL ? 1 : -1;

        trigger = ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: () => `+=${Math.max(distance(), 1)}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self: any) => {
            gsap.set(track, { x: dir * distance() * self.progress });
          },
        });
      }, pinRef);
    })();

    return () => {
      trigger?.kill();
      ctx?.revert();
    };
  }, [reduced, isRTL, items]);

  if (!Array.isArray(items)) return null;

  if (reduced) {
    return (
      <Pin>
        <Container>
          <div style={{ padding: '5rem 0' }}>
            <Head>
              <Eyebrow>{t('landing2.eyebrows.useCases')}</Eyebrow>
              <SectionTitle>{t('agents.title')}</SectionTitle>
              <SectionDescription>{t('agents.description')}</SectionDescription>
            </Head>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              {items.map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <UseCaseCard style={{ width: 'min(380px, 100%)' }}>
                    <Index>0{i + 1}</Index>
                    <IconWrap>{icons[i]}</IconWrap>
                    <Title>{item.title}</Title>
                    <Desc>{item.description}</Desc>
                    <Tags>{item.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}</Tags>
                  </UseCaseCard>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Pin>
    );
  }

  return (
    <Pin ref={pinRef}>
      <Sticky>
        <Container>
          <Head>
            <Eyebrow>{t('landing2.eyebrows.useCases')}</Eyebrow>
            <SectionTitle>{t('agents.title')}</SectionTitle>
            <SectionDescription>{t('agents.description')}</SectionDescription>
          </Head>
        </Container>

        <Viewport>
          <Track ref={trackRef} $rtl={isRTL}>
            {items.map((item, i) => (
              <UseCaseCard key={i}>
                <Index>0{i + 1}</Index>
                <IconWrap>{icons[i]}</IconWrap>
                <Title>{item.title}</Title>
                <Desc>{item.description}</Desc>
                <Tags>{item.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}</Tags>
              </UseCaseCard>
            ))}
          </Track>
        </Viewport>
      </Sticky>
    </Pin>
  );
}
