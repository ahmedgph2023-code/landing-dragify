import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Section, SectionHeader, Eyebrow, SectionTitle, SectionDescription, ease } from './shared';

const Wrap = styled(Section)`
  background: ${({ theme }) => theme.colors.background};
`;

const Stage = styled.div`
  position: relative;
  height: 340px;
  max-width: 720px;
  margin: 0 auto;

  @media (max-width: 640px) { height: 420px; }
`;

const CardEl = styled(motion.div)`
  position: absolute;
  inset: 0;
  padding: 2.5rem;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.large};
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: grab;
  &:active { cursor: grabbing; }

  @media (max-width: 640px) { padding: 1.75rem; }
`;

const QuoteMark = styled.div`
  font-size: 2.75rem;
  line-height: 1;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent.blue};
  opacity: 0.45;
  margin-bottom: 1rem;
`;

const Quote = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.75rem;

  @media (max-width: 640px) { font-size: 1.02rem; }
`;

const Attribution = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
`;

const Name = styled.span`
  display: block;
  font-weight: 700;
  font-size: 0.98rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Role = styled.span`
  display: block;
  font-size: 0.86rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.25rem;
`;

const ArrowBtn = styled.button<{ $flip?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  transform: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'none')};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent.blue};
    color: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  background: ${({ theme }) => theme.colors.border};

  &.active {
    width: 22px;
    border-radius: 100px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  }
`;

export default function Testimonials() {
  const { t, isRTL } = useLocalization();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const testimonials = t('landing2.testimonials.items') as { quote: string; name: string; role: string }[];
  const count = Array.isArray(testimonials) ? testimonials.length : 0;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((v) => (v + 1) % count), 5500);
    return () => clearInterval(id);
  }, [paused, count]);

  const go = (delta: number) => setIndex((v) => (v + delta + count) % count);

  const onDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -80) go(isRTL ? -1 : 1);
    else if (info.offset.x > 80) go(isRTL ? 1 : -1);
  };

  if (!Array.isArray(testimonials) || count === 0) return null;

  return (
    <Wrap onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Container>
        <SectionHeader>
          <Eyebrow style={{ justifyContent: 'center' }}>{t('landing2.testimonials.eyebrow')}</Eyebrow>
          <SectionTitle>{t('landing2.testimonials.title')}</SectionTitle>
          <SectionDescription>{t('landing2.testimonials.description')}</SectionDescription>
        </SectionHeader>

        <Stage>
          {testimonials.map((item, i) => {
            const offset = i - index;
            const abs = Math.abs(offset);
            if (abs > 1) return null;
            return (
              <CardEl
                key={i}
                drag={offset === 0 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
                animate={{
                  x: offset * 26,
                  scale: 1 - abs * 0.07,
                  opacity: abs === 0 ? 1 : 0.35,
                  zIndex: 10 - abs,
                  rotate: offset * 2,
                }}
                initial={false}
                transition={{ duration: 0.6, ease: ease.out }}
              >
                <QuoteMark>&ldquo;</QuoteMark>
                <Quote>{item.quote}</Quote>
                <Attribution>
                  <Avatar />
                  <div>
                    <Name>{item.name}</Name>
                    <Role>{item.role}</Role>
                  </div>
                </Attribution>
              </CardEl>
            );
          })}
        </Stage>

        <Controls>
          <ArrowBtn onClick={() => go(-1)} $flip={isRTL} aria-label="Previous testimonial">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </ArrowBtn>
          <Dots>
            {testimonials.map((_, i) => (
              <Dot key={i} className={i === index ? 'active' : undefined} onClick={() => setIndex(i)} aria-label={`Go to testimonial ${i + 1}`} />
            ))}
          </Dots>
          <ArrowBtn onClick={() => go(1)} $flip={isRTL} aria-label="Next testimonial">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </ArrowBtn>
        </Controls>
      </Container>
    </Wrap>
  );
}
