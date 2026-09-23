import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Eyebrow, SectionTitle, SectionDescription, Reveal, getGsap, usePrefersReducedMotion } from './shared';

type NodeDef = {
  id: string;
  x: number; // percent
  y: number; // percent
  titleKey: string;
  descKey?: string;
  isTrigger?: boolean;
};

const nodes: NodeDef[] = [
  { id: 'trigger', x: 50, y: 8, titleKey: 'workflow.trigger', isTrigger: true },
  { id: 'ceo', x: 50, y: 30, titleKey: 'workflow.agents.ceo.title', descKey: 'workflow.agents.ceo.description' },
  { id: 'ops', x: 50, y: 54, titleKey: 'workflow.agents.operations.title', descKey: 'workflow.agents.operations.description' },
  { id: 'customer', x: 18, y: 84, titleKey: 'workflow.agents.customer.title', descKey: 'workflow.agents.customer.description' },
  { id: 'product', x: 50, y: 84, titleKey: 'workflow.agents.product.title', descKey: 'workflow.agents.product.description' },
  { id: 'marketing', x: 82, y: 84, titleKey: 'workflow.agents.marketing.title', descKey: 'workflow.agents.marketing.description' },
];

const edges: [string, string][] = [
  ['trigger', 'ceo'],
  ['ceo', 'ops'],
  ['ops', 'customer'],
  ['ops', 'product'],
  ['ops', 'marketing'],
];

const Pin = styled.section`
  position: relative;
  height: 380vh;
  background: ${({ theme }) => theme.colors.cardBackground};

  @media (max-width: 900px) {
    height: auto;
  }
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 900px) {
    position: static;
    height: auto;
    padding-block: 5rem 3rem;
  }
`;

const Head = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
`;

const Stage = styled.div`
  position: relative;
  width: min(920px, 92vw);
  aspect-ratio: 10 / 9;
  margin: 0 auto;

  @media (max-width: 900px) {
    aspect-ratio: 10 / 13;
  }
`;

const EdgeSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const NodeCard = styled.div<{ $x: number; $y: number; $trigger?: boolean }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  width: ${({ $trigger }) => ($trigger ? '150px' : '220px')};
  padding: ${({ $trigger }) => ($trigger ? '0.6rem 1rem' : '1rem 1.1rem')};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  text-align: center;
  opacity: 0;
  will-change: transform, opacity;

  @media (max-width: 900px) {
    width: ${({ $trigger }) => ($trigger ? '120px' : '150px')};
    padding: ${({ $trigger }) => ($trigger ? '0.5rem 0.7rem' : '0.7rem 0.8rem')};
  }
`;

const NodeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent.blue};
  background: ${({ theme }) => theme.colors.accent.blue}18;
  padding: 0.2rem 0.55rem;
  border-radius: 50px;
  margin-bottom: 0.5rem;
`;

const NodeTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: 900px) { font-size: 0.8rem; }
`;

const NodeDesc = styled.div`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.2rem;

  @media (max-width: 900px) { display: none; }
`;

export default function WorkflowScroll() {
  const { t } = useLocalization();
  const reduced = usePrefersReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});

  useEffect(() => {
    if (reduced) return;
    let ctx: any;

    (async () => {
      const { gsap, ScrollTrigger } = await getGsap();
      ctx = gsap.context(() => {
        Object.values(pathRefs.current).forEach((path) => {
          if (!path) return;
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        });
        Object.values(nodeRefs.current).forEach((el) => gsap.set(el, { opacity: 0, y: 16, scale: 0.94 }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
          },
        });

        const revealNode = (id: string) => {
          tl.to(nodeRefs.current[id], { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '>-0.1');
        };
        const drawEdge = (key: string) => {
          const path = pathRefs.current[key];
          if (!path) return;
          tl.to(path, { strokeDashoffset: 0, duration: 0.6 }, '<');
        };

        revealNode('trigger');
        tl.to({}, { duration: 0.3 });
        drawEdge('trigger-ceo');
        revealNode('ceo');
        tl.to({}, { duration: 0.3 });
        drawEdge('ceo-ops');
        revealNode('ops');
        tl.to({}, { duration: 0.4 });
        drawEdge('ops-customer');
        drawEdge('ops-product');
        drawEdge('ops-marketing');
        tl.to(nodeRefs.current['customer'], { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '<');
        tl.to(nodeRefs.current['product'], { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '<');
        tl.to(nodeRefs.current['marketing'], { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '<');
        tl.to({}, { duration: 0.6 });
      }, pinRef);
    })();

    return () => ctx?.revert();
  }, [reduced]);

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  const pathD = (fromId: string, toId: string) => {
    const from = getNode(fromId);
    const to = getNode(toId);
    const midY = (from.y + to.y) / 2;
    return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
  };

  return (
    <Pin>
      <Sticky>
        <Container>
          <Head>
            <Eyebrow style={{ justifyContent: 'center' }}>{t('howItWorks.sectionLabel')}</Eyebrow>
            <SectionTitle style={{ marginBottom: '0.5rem' }}>{t('howItWorks.title')}</SectionTitle>
            <SectionDescription style={{ maxWidth: 560, margin: '0 auto' }}>
              {t('landing2.workflowSubtitle')}
            </SectionDescription>
          </Head>

          <Stage>
            <EdgeSvg viewBox="0 0 100 90" preserveAspectRatio="none">
              {edges.map(([from, to]) => (
                <path
                  key={`${from}-${to}`}
                  ref={(el) => { pathRefs.current[`${from}-${to}`] = el; }}
                  d={pathD(from, to)}
                  fill="none"
                  stroke="url(#nl-edge-gradient)"
                  strokeWidth={0.35}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <defs>
                <linearGradient id="nl-edge-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </EdgeSvg>

            {reduced
              ? nodes.map((n) => (
                  <Reveal key={n.id}>
                    <NodeCard $x={n.x} $y={n.y} $trigger={n.isTrigger} style={{ opacity: 1 }}>
                      {n.isTrigger ? (
                        <NodeTitle>{t(n.titleKey)}</NodeTitle>
                      ) : (
                        <>
                          <NodeBadge>{t('workflow.aiAgent')}</NodeBadge>
                          <NodeTitle>{t(n.titleKey)}</NodeTitle>
                          {n.descKey && <NodeDesc>{t(n.descKey)}</NodeDesc>}
                        </>
                      )}
                    </NodeCard>
                  </Reveal>
                ))
              : nodes.map((n) => (
                  <NodeCard key={n.id} $x={n.x} $y={n.y} $trigger={n.isTrigger} ref={(el) => { nodeRefs.current[n.id] = el; }}>
                    {n.isTrigger ? (
                      <NodeTitle>{t(n.titleKey)}</NodeTitle>
                    ) : (
                      <>
                        <NodeBadge>{t('workflow.aiAgent')}</NodeBadge>
                        <NodeTitle>{t(n.titleKey)}</NodeTitle>
                        {n.descKey && <NodeDesc>{t(n.descKey)}</NodeDesc>}
                      </>
                    )}
                  </NodeCard>
                ))}
          </Stage>
        </Container>
      </Sticky>
    </Pin>
  );
}
