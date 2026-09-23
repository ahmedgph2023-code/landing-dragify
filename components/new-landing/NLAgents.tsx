import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Container, Eyebrow, GradientSpan, Reveal, SectionSubtitle, SectionTitle, useContent } from './shared';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const icons = [
  <path key="a" d="M3 11v2a2 2 0 0 0 2 2h1l3 5V4L6 9H5a2 2 0 0 0-2 2Z" strokeLinejoin="round" />,
  <path key="b" d="M12 21c-4.4-2-8-5.6-8-10a8 8 0 0 1 16 0c0 4.4-3.6 8-8 10Z" />,
  <path key="c" d="M4 19h16M4 19V9l5 4 4-8 4 6 3-2v10" strokeLinecap="round" strokeLinejoin="round" />,
  <path key="d" d="M12 2 3 7l9 5 9-5-9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" strokeLinejoin="round" />,
  <path key="e" d="M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M16 8.5a2.5 2.5 0 1 1 0-5M14.5 20a5.5 5.5 0 0 0-.4-2" strokeLinecap="round" />,
  <path key="f" d="M3 5h18v14H3V5ZM3 9h18M7 14h4" strokeLinecap="round" />,
];

const Pin = styled.section`
  position: relative;
  background: var(--nl-bg);
`;

const Sticky = styled.div`
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: 2rem;

  @media (max-width: 860px) {
    min-height: auto;
    padding-block: 5.5rem 3rem;
  }
`;

const Head = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const Viewport = styled.div`
  overflow: hidden;
  /* Soft edge fade instead of a hard clip line — cards that scale up while
     approaching the left/right edge fade out gracefully instead of getting
     guillotined by the boundary. */
  mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
  padding-block: 1.5rem;
  margin-block: -1.5rem;

  @media (max-width: 860px) {
    overflow-x: auto;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    mask-image: none;
    -webkit-mask-image: none;
  }
`;

const Track = styled.div<{ $rtl: boolean }>`
  display: flex;
  flex-direction: ${({ $rtl }) => ($rtl ? 'row-reverse' : 'row')};
  gap: 2.5rem;
  width: max-content;
  padding-inline: max(4rem, calc((100vw - 1280px) / 2 + 4rem));
`;

const Card = styled.div`
  width: min(400px, 80vw);
  flex-shrink: 0;
  padding: 2.25rem;
  border-radius: var(--nl-radius);
  background:
    radial-gradient(80% 60% at 50% 0%, rgba(59,130,246,0.12), transparent 55%),
    var(--nl-bg-elevated);
  border: 1px solid var(--nl-border);
  box-shadow: var(--nl-card-inset);
  scroll-snap-align: start;
  will-change: transform;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 860px) {
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      border-color: rgba(59, 130, 246, 0.4);
      transform: translateY(-4px);
      box-shadow: var(--nl-card-inset), var(--nl-shadow-md);
    }
  }
`;

const Index = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--nl-violet);
  margin-bottom: 1.25rem;
  font-variant-numeric: tabular-nums;
`;

const IconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.25);
  color: var(--nl-violet);
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 650;
  margin: 0 0 0.6rem;
  color: var(--nl-text);
`;

const Desc = styled.p`
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--nl-text-dim);
  margin: 0 0 1.25rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  padding: 0.3rem 0.65rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--nl-bg-elevated);
  border: 1px solid var(--nl-border);
  color: var(--nl-text-dim);
`;

export default function NLAgents() {
  const { c, isRTL } = useContent();
  const reduced = usePrefersReducedMotion();
  const items: { title: string; description: string; tags: string[] }[] = c('agents.items');
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced || !Array.isArray(items)) return;
    let ctx: { revert: () => void } | undefined;
    let trigger: { kill: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsapModule.gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;
      const gsap = gsapModule.gsap;

      if (window.matchMedia('(max-width: 860px)').matches) return;

      ctx = gsap.context(() => {
        const track = trackRef.current;
        const wrap = pinRef.current;
        if (!track || !wrap) return;
        const distance = () => track.scrollWidth - wrap.offsetWidth;
        const dir = isRTL ? 1 : -1;
        const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

        // Cards shrink slightly while still approaching center ("entering"),
        // sit at 1x through the middle, then grow as they pass center and
        // head toward the edge they're about to leave from — a soft
        // enter-small / exit-big rhythm instead of a flat side-scroll.
        const updateCardScales = () => {
          const wrapRect = wrap.getBoundingClientRect();
          const centerX = wrapRect.left + wrapRect.width / 2;
          const falloff = Math.max(wrapRect.width * 0.36, 1);
          cardRefs.current.forEach((card) => {
            if (!card) return;
            const r = card.getBoundingClientRect();
            const cardCenter = r.left + r.width / 2;
            const dx = cardCenter - centerX;
            const t = clamp((-dx * dir) / falloff, -1, 1); // >0 entering, <0 exiting
            const scale = t >= 0 ? 1 - 0.12 * t : 1 + 0.16 * Math.abs(t);
            gsap.set(card, { scale, zIndex: t < 0 ? 20 : Math.round(10 - t * 6) });
          });
        };

        trigger = ScrollTrigger.create({
          trigger: wrap,
          start: 'top top+=64',
          end: () => `+=${Math.max(distance(), 1)}`,
          scrub: 0.55,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          preventOverlaps: true,
          onUpdate: (self: { progress: number }) => {
            gsap.set(track, { x: dir * distance() * self.progress });
            updateCardScales();
          },
          onRefresh: updateCardScales,
        });
      }, pinRef);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    })();

    return () => {
      cancelled = true;
      trigger?.kill();
      ctx?.revert();
      cardRefs.current.forEach((card) => {
        if (card) card.style.transform = '';
      });
    };
  }, [reduced, isRTL, items]);

  if (!Array.isArray(items)) return null;

  return (
    <Pin ref={pinRef} id="agents">
      <Sticky>
        <Container>
          <Reveal>
            <Head>
              <Eyebrow>{c('agents.eyebrow')}</Eyebrow>
              <SectionTitle>
                {c('agents.title')} <GradientSpan>{c('agents.titleGradient')}</GradientSpan>{c('agents.titlePost')}
              </SectionTitle>
              <SectionSubtitle style={{ margin: '0 auto' }}>{c('agents.subtitle')}</SectionSubtitle>
            </Head>
          </Reveal>
        </Container>

        <Viewport>
          <Track ref={trackRef} $rtl={isRTL}>
            {items.map((item, i) => (
              <Card key={item.title} ref={(el) => { cardRefs.current[i] = el; }}>
                <Index>0{i + 1}</Index>
                <IconWrap>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{icons[i]}</svg>
                </IconWrap>
                <Title>{item.title}</Title>
                <Desc>{item.description}</Desc>
                <Tags>
                  {item.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </Tags>
              </Card>
            ))}
          </Track>
        </Viewport>
      </Sticky>
    </Pin>
  );
}
