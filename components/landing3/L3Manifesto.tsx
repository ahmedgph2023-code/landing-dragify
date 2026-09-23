import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Container, useL3, usePrefersReducedMotion } from './shared';

const IMAGES = [
  '/images/services/ai_automation_building_solutions.png',
  '/images/services/workflow_instant_transformation.png',
  '/images/services/ai_agent_working_autonomously.png',
  '/images/services/ai_neural_network_decision_making.png',
];

// Quint ease-in-out: calm start, real acceleration through the middle, then
// a long, soft settle at the end — a "premium" curve, not a linear scrub.
const easeInOutQuint = (x: number) => (x < 0.5 ? 16 * x ** 5 : 1 - Math.pow(-2 * x + 2, 5) / 2);

/**
 * CSS sticky story — no GSAP pin. Avoids conflicts with other ScrollTrigger pins
 * on /landing (workflow demo, agents filmstrip).
 *
 * The image/text handoff is continuous and scroll-scrubbed: every frame we
 * compute exactly how far we are between beat N and beat N+1 and write the
 * interpolated transform straight to both elements' inline style. There is
 * no CSS transition and no "hide then show" — outgoing and incoming are
 * stacked and moving at the same time, driven purely by scroll position.
 */
export default function L3Manifesto() {
  const { c } = useL3();
  const reduced = usePrefersReducedMotion();
  const track = useRef<HTMLElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const beats = c('manifesto.beats') as { label: string; text: string }[];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced || !track.current || !Array.isArray(beats) || beats.length < 2) return;
    if (window.matchMedia('(max-width: 860px)').matches) return;

    const n = beats.length;
    const el = track.current;
    let ticking = false;

    // Distances are in vh on purpose: the stage for this handoff is the
    // viewport the sticky panel occupies, not the (much smaller) image
    // card — so a beat has to travel a real fraction of the screen to
    // leave, not a 40px nudge inside its own box.
    const applyImage = (i: number, tyVh: number, scale: number, rot: number, opacity: number, z: number) => {
      const node = imgRefs.current[i];
      if (!node) return;
      node.style.transform = `translateY(${tyVh}vh) scale(${scale}) rotateX(${rot}deg)`;
      node.style.opacity = String(opacity);
      node.style.zIndex = String(z);
    };

    const applyText = (i: number, tyVh: number, opacity: number) => {
      const node = textRefs.current[i];
      if (!node) return;
      node.style.transform = `translateY(${tyVh}vh)`;
      node.style.opacity = String(opacity);
      node.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    };

    const measure = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      const soft = Math.min(1, progress / 0.92);
      const beatProgress = soft * n;
      const idx = Math.min(n - 1, Math.floor(beatProgress));
      const rawT = idx < n - 1 ? Math.min(1, Math.max(0, beatProgress - idx)) : 0;
      const t = easeInOutQuint(rawT);

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }

      for (let i = 0; i < n; i++) {
        const delta = i - idx;
        if (delta === 0) {
          // Current beat handing off: a real camera move up and out of the
          // frame — not a nudge inside the card — tilting back, shrinking
          // and dimming as it recedes, but never disappearing outright.
          applyImage(i, -22 * t, 1 - 0.22 * t, -6 * t, 1 - 0.65 * t, 3);
          applyText(i, -16 * t, 1 - t);
        } else if (delta === 1) {
          // Next beat taking over: arrives from below the viewport, not
          // below the card, straightening and growing to full scale as it
          // settles dead-center — exactly as the current one leaves.
          applyImage(i, 22 * (1 - t), 0.78 + 0.22 * t, 6 * (1 - t), 0.08 + 0.92 * t, 4);
          applyText(i, 16 * (1 - t), t);
        } else if (delta < 0) {
          applyImage(i, -22, 0.78, -6, 0.35, 1);
          applyText(i, -16, 0);
        } else {
          applyImage(i, 22, 0.78, 6, 0.08, 0);
          applyText(i, 16, 0);
        }
      }

      if (fill.current) {
        fill.current.style.transform = `scaleX(${progress})`;
      }
    };

    // rAF-throttled: scroll fires far more often than the browser paints,
    // so batching to one measurement per frame keeps this buttery smooth.
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced, beats?.length]);

  if (!Array.isArray(beats)) return null;

  const steps = Math.max(beats.length, 1);

  return (
    <Track ref={track} id="story" style={{ ['--story-steps' as string]: steps }}>
      <Sticky>
        <ProgressTrack aria-hidden>
          <ProgressFill ref={fill} />
        </ProgressTrack>
        <Container $wide>
          <Grid>
            <Visual>
              {IMAGES.map((src, i) => (
                <ImgWrap key={src} ref={(el) => { imgRefs.current[i] = el; }} $pos={reduced ? 0 : i === active ? 0 : i < active ? -1 : 1}>
                  <Image src={src} alt="" fill sizes="(max-width: 900px) 100vw, 52vw" style={{ objectFit: 'cover' }} priority={i === 0} />
                </ImgWrap>
              ))}
              <Glow />
            </Visual>

            <Copy>
              {beats.map((b, i) => (
                <Beat key={i} ref={(el) => { textRefs.current[i] = el; }} $pos={reduced ? 0 : i === active ? 0 : i < active ? -1 : 1}>
                  <Label>
                    <Index>{String(i + 1).padStart(2, '0')}</Index>
                    <span>{b.label}</span>
                  </Label>
                  <Text dangerouslySetInnerHTML={{ __html: formatHighlight(b.text) }} />
                </Beat>
              ))}

              <Dots>
                {beats.map((_, i) => (
                  <Dot key={i} $on={i === active} />
                ))}
              </Dots>
            </Copy>
          </Grid>

          <Mobile>
            {beats.map((b, i) => (
              <MobileCard key={i}>
                <MobileImg>
                  <Image src={IMAGES[i % IMAGES.length]} alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                </MobileImg>
                <Label>
                  <Index>{String(i + 1).padStart(2, '0')}</Index>
                  <span>{b.label}</span>
                </Label>
                <Text dangerouslySetInnerHTML={{ __html: formatHighlight(b.text) }} />
              </MobileCard>
            ))}
          </Mobile>
        </Container>
      </Sticky>
    </Track>
  );
}

function formatHighlight(text: string) {
  return text.replace(/<highlight>/g, '<span class="hl">').replace(/<\/highlight>/g, '</span>');
}

const Track = styled.section`
  position: relative;
  /* Tall scroll runway; sticky panel rides through it — no GSAP pin spacer. */
  height: calc(var(--story-steps, 4) * 58vh);

  @media (max-width: 860px) {
    height: auto;
  }
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  min-height: 100svh;
  display: flex;
  align-items: center;
  background: var(--l3-bg-deep);
  padding-block: 4rem;

  @media (max-width: 860px) {
    position: relative;
    min-height: auto;
    padding-block: 4.5rem;
  }
`;

const ProgressTrack = styled.div`
  position: absolute;
  top: 0;
  inset-inline: 0;
  height: 2px;
  background: var(--l3-line);
  z-index: 5;
  @media (max-width: 860px) {
    display: none;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left center;
  background: var(--l3-grad-btn);
  [dir='rtl'] & {
    transform-origin: right center;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 3rem;
  align-items: center;
  @media (max-width: 860px) {
    display: none;
  }
`;

const Visual = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 22px;
  perspective: 1400px;
  /* No overflow:hidden here on purpose — the outgoing/incoming frames are
     allowed to move, tilt and scale past this box's own edge instead of
     being clipped at a hard boundary, so the handoff stays visible. */
  border: 1px solid var(--l3-line);
  background: var(--l3-elevated);
  box-shadow:
    0 0 0 1px rgba(255, 142, 93, 0.12) inset,
    var(--l3-shadow);
`;

/**
 * Continuous scroll-scrubbed stack — no CSS transition on purpose, the
 * transform/opacity above are written every frame from scroll position.
 * $pos only supplies the resting pose before JS takes over (first paint,
 * reduced motion, or the sub-860px breakpoint where this effect is off).
 */
const ImgWrap = styled.div<{ $pos: -1 | 0 | 1 }>`
  position: absolute;
  inset: 0;
  border-radius: 22px;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  z-index: ${({ $pos }) => ($pos === 0 ? 3 : $pos === 1 ? 0 : 1)};
  opacity: ${({ $pos }) => ($pos === 0 ? 1 : $pos === 1 ? 0.08 : 0.35)};
  transform: ${({ $pos }) =>
    $pos === 0
      ? 'translateY(0) scale(1) rotateX(0deg)'
      : $pos === -1
        ? 'translateY(-22vh) scale(0.78) rotateX(-6deg)'
        : 'translateY(22vh) scale(0.78) rotateX(6deg)'};
`;

const Glow = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  height: 40%;
  background: linear-gradient(to top, rgba(11, 18, 32, 0.55), transparent);
  pointer-events: none;
  z-index: 5;
`;

const Copy = styled.div`
  position: relative;
  min-height: 280px;
`;

/**
 * Same continuous, imperative handoff as the image — translateY + opacity
 * only (no scale/rotate on text), written every frame from scroll position.
 */
const Beat = styled.div<{ $pos: -1 | 0 | 1 }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  will-change: transform, opacity;
  opacity: ${({ $pos }) => ($pos === 0 ? 1 : 0)};
  pointer-events: ${({ $pos }) => ($pos === 0 ? 'auto' : 'none')};
  transform: ${({ $pos }) => `translateY(${$pos === 0 ? 0 : $pos === -1 ? -16 : 16}vh)`};
`;

const Label = styled.div`
  display: inline-flex;
  align-self: flex-start;
  width: fit-content;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.76rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--l3-blue);
  padding: 0.4rem 0.9rem 0.4rem 0.6rem;
  border-radius: 100px;
  background: var(--l3-grad-soft);
  border: 1px solid var(--l3-glow);
  margin-bottom: 1.5rem;
`;

const Index = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--l3-grad-btn);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;

const Text = styled.h2`
  position: relative;
  font-size: clamp(2.1rem, 4.4vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.14;
  color: var(--l3-ink);
  margin: 0;
  max-width: 15ch;
  .hl {
    background: var(--l3-grad-text);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  gap: 0.4rem;
`;

const Dot = styled.div<{ $on: boolean }>`
  width: ${({ $on }) => ($on ? '22px' : '7px')};
  height: 7px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? 'var(--l3-blue)' : 'var(--l3-line-strong)')};
  transition: width 0.3s ease, background 0.3s ease;
`;

const Mobile = styled.div`
  display: none;
  flex-direction: column;
  gap: 2rem;
  @media (max-width: 860px) {
    display: flex;
  }
`;

const MobileCard = styled.div``;

const MobileImg = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.1rem;
  border: 1px solid var(--l3-line);
`;
