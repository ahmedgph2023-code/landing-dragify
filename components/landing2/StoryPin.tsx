import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Eyebrow, WordReveal, splitHighlightedWords, Reveal, getGsap, usePrefersReducedMotion } from './shared';

const Pin = styled.section`
  position: relative;
  height: 320vh;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    position: static;
    height: auto;
    padding-block: 5rem;
    display: block;
  }
`;

const BeatsStack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }
`;

const Beat = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  will-change: transform, opacity;

  @media (max-width: 768px) {
    position: static;
    opacity: 1 !important;
    transform: none !important;
  }
`;

const BeatInner = styled.div`
  max-width: 780px;
`;

const BeatNumber = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent.blue};
  margin-bottom: 1.25rem;
`;

const BeatText = styled.h2`
  font-size: clamp(2rem, 4.6vw, 3.6rem);
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  .gradient-word {
    background: linear-gradient(100deg, ${({ theme }) => theme.colors.accent.blue} 15%, ${({ theme }) => theme.colors.accent.purple} 85%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Progress = styled.div`
  position: absolute;
  inset-inline-start: 0;
  bottom: 3rem;
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) { display: none; }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.border};
  transition: width 0.4s ease, background 0.4s ease;

  &.active {
    width: 28px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  }
`;

export default function StoryPin() {
  const { t, isRTL } = useLocalization();
  const reduced = usePrefersReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beats = [
    t('landing2.story.beat1') as { label: string; text: string },
    t('landing2.story.beat2') as { label: string; text: string },
    t('landing2.story.beat3') as { label: string; text: string },
  ];

  useEffect(() => {
    if (reduced) return;
    let ctx: any;
    const drift = isRTL ? -1 : 1;

    (async () => {
      const { gsap, ScrollTrigger } = await getGsap();
      ctx = gsap.context(() => {
        const els = beatRefs.current.filter(Boolean) as HTMLDivElement[];
        gsap.set(els.slice(1), { autoAlpha: 0, x: 40 * drift });
        gsap.set(els[0], { autoAlpha: 1, x: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
            onUpdate: (self) => {
              const idx = Math.min(els.length - 1, Math.floor(self.progress * els.length));
              dotRefs.current.forEach((d, i) => d?.classList.toggle('active', i === idx));
            },
          },
        });

        els.forEach((el, i) => {
          if (i > 0) {
            tl.to(els[i - 1], { autoAlpha: 0, x: -40 * drift, duration: 1 }, `beat${i}`);
            tl.fromTo(el, { autoAlpha: 0, x: 40 * drift }, { autoAlpha: 1, x: 0, duration: 1 }, `beat${i}`);
          }
          if (i < els.length - 1) tl.to({}, { duration: 1.4 });
        });
      }, pinRef);
    })();

    return () => ctx?.revert();
  }, [reduced, isRTL]);

  if (reduced) {
    return (
      <Pin style={{ height: 'auto' }}>
        <Sticky style={{ position: 'static', height: 'auto', display: 'block', padding: '5rem 0' }}>
          <Container>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              {beats.map((beat, i) => (
                <Reveal key={i}>
                  <BeatNumber>{beat.label}</BeatNumber>
                  <BeatText dangerouslySetInnerHTML={{ __html: beat.text.replace(/<highlight>/g, '<span class="gradient-word">').replace(/<\/highlight>/g, '</span>') }} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Sticky>
      </Pin>
    );
  }

  return (
    <Pin ref={pinRef}>
      <Sticky>
        <Container>
          <Eyebrow>{t('landing2.story.eyebrow')}</Eyebrow>
          <BeatsStack>
            {beats.map((beat, i) => (
              <Beat key={i} ref={(el) => { beatRefs.current[i] = el; }}>
                <BeatInner>
                  <BeatNumber>{beat.label}</BeatNumber>
                  <BeatText dangerouslySetInnerHTML={{ __html: beat.text.replace(/<highlight>/g, '<span class="gradient-word">').replace(/<\/highlight>/g, '</span>') }} />
                </BeatInner>
              </Beat>
            ))}
          </BeatsStack>
          <Progress>
            {beats.map((_, i) => (
              <Dot key={i} ref={(el) => { dotRefs.current[i] = el; }} className={i === 0 ? 'active' : undefined} />
            ))}
          </Progress>
        </Container>
      </Sticky>
    </Pin>
  );
}
