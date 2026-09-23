import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { Container, Eyebrow, GradientSpan, Reveal, SectionSubtitle, SectionTitle, useContent, WorkflowBrandIcon, type WorkflowIconName } from './shared';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const VBW = 1300;
const VBH = 560;

type Kind = 'trigger' | 'core' | 'branch' | 'final';
type NodeId =
  | 'trigger'
  | 'classifier'
  | 'support'
  | 'salesLead'
  | 'complaint'
  | 'knowledge'
  | 'crmCreate'
  | 'createTicket'
  | 'aiResponse'
  | 'notifySales'
  | 'notifySlack'
  | 'final';

type FlowNode = { id: NodeId; x: number; y: number; w: number; h: number; background: string; kind: Kind; icon: WorkflowIconName };

const BLUE = '#3b82f6';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#1fac57';
const CYAN = '#06b6d4';

/** The same real automation as the hero — one WhatsApp message, classified
 * into 3 lanes that each do their own 2-step job, converging on one reply.
 * Laid out left-to-right here (vs. top-down in the hero) and scrubbed by
 * scroll instead of auto-looping, so it can be studied step by step. */
const FLOW: FlowNode[] = [
  { id: 'trigger', x: 95, y: 280, w: 160, h: 74, background: GREEN, kind: 'trigger', icon: 'whatsapp' },
  { id: 'classifier', x: 300, y: 280, w: 190, h: 104, background: CYAN, kind: 'core', icon: 'robot' },

  { id: 'support', x: 515, y: 100, w: 148, h: 60, background: BLUE, kind: 'branch', icon: 'headset' },
  { id: 'salesLead', x: 515, y: 280, w: 148, h: 60, background: AMBER, kind: 'branch', icon: 'crm' },
  { id: 'complaint', x: 515, y: 460, w: 148, h: 60, background: RED, kind: 'branch', icon: 'alert' },

  { id: 'knowledge', x: 730, y: 100, w: 148, h: 60, background: BLUE, kind: 'branch', icon: 'doc' },
  { id: 'crmCreate', x: 730, y: 280, w: 148, h: 60, background: AMBER, kind: 'branch', icon: 'crm' },
  { id: 'createTicket', x: 730, y: 460, w: 148, h: 60, background: RED, kind: 'branch', icon: 'ticket' },

  { id: 'aiResponse', x: 945, y: 100, w: 148, h: 60, background: BLUE, kind: 'branch', icon: 'chat' },
  { id: 'notifySales', x: 945, y: 280, w: 148, h: 60, background: AMBER, kind: 'branch', icon: 'bell' },
  { id: 'notifySlack', x: 945, y: 460, w: 148, h: 60, background: '#8a3e9e', kind: 'branch', icon: 'slack' },

  { id: 'final', x: 1170, y: 280, w: 160, h: 74, background: GREEN, kind: 'final', icon: 'whatsapp' },
];

const byId = (id: NodeId) => FLOW.find((n) => n.id === id)!;
const BRANCH1: NodeId[] = ['support', 'salesLead', 'complaint'];
const BRANCH2: NodeId[] = ['knowledge', 'crmCreate', 'createTicket'];
const BRANCH3: NodeId[] = ['aiResponse', 'notifySales', 'notifySlack'];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

function edgePath(x1: number, y1: number, x2: number, y2: number) {
  const midX = (x1 + x2) / 2;
  return `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
}

type EdgeSeg = { id: string; d: string; tone: string };

function edgeBetween(aId: NodeId, bId: NodeId): EdgeSeg {
  const a = byId(aId);
  const b = byId(bId);
  return { id: `${aId}-${bId}`, d: edgePath(a.x + a.w / 2, a.y, b.x - b.w / 2, b.y), tone: b.background };
}

const EDGE_GROUPS: EdgeSeg[][] = [
  [edgeBetween('trigger', 'classifier')],
  BRANCH1.map((id) => edgeBetween('classifier', id)),
  [edgeBetween('support', 'knowledge'), edgeBetween('salesLead', 'crmCreate'), edgeBetween('complaint', 'createTicket')],
  [edgeBetween('knowledge', 'aiResponse'), edgeBetween('crmCreate', 'notifySales'), edgeBetween('createTicket', 'notifySlack')],
  BRANCH3.map((id) => edgeBetween(id, 'final')),
];
const ALL_EDGES = EDGE_GROUPS.flat();
const TIERS: NodeId[][] = [['trigger'], ['classifier'], BRANCH1, BRANCH2, BRANCH3, ['final']];

function ChromeDots() {
  return (
    <Chrome>
      <span />
      <span />
      <span />
    </Chrome>
  );
}

export default function NLWorkflowDemo() {
  const { c } = useContent();
  const reduced = usePrefersReducedMotion();
  const label = (id: NodeId) => c(`hero.workflow.${id}`);
  const inputLabel = c('hero.workflow.input');
  const outputLabel = c('hero.workflow.output');

  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<NodeId, HTMLDivElement | null>>({} as Record<NodeId, HTMLDivElement | null>);
  const edgeRefs = useRef<Record<string, SVGPathElement | null>>({});
  const counterRef = useRef<HTMLSpanElement>(null);
  const liveDotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    (async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !wrapRef.current || !pinRef.current) return;
      const canPin = !window.matchMedia('(max-width: 860px)').matches;

      ctx = gsap.context(() => {
        const edgeEls = ALL_EDGES.map((e) => edgeRefs.current[e.id]).filter(Boolean) as SVGPathElement[];
        edgeEls.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(FLOW.map((n) => nodeRefs.current[n.id]), { opacity: 0, y: 14 });
        if (counterRef.current) counterRef.current.textContent = '0';

        const tl = gsap.timeline({
          scrollTrigger: canPin
            ? { trigger: pinRef.current, start: 'top top+=88', end: '+=180%', scrub: 0.65, pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true }
            : { trigger: wrapRef.current, start: 'top 70%', end: 'bottom 30%', scrub: 0.65, invalidateOnRefresh: true },
        });

        let t = 0;
        tl.to(nodeRefs.current['trigger'], { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, t);
        t += 0.5;

        EDGE_GROUPS.forEach((edges, gi) => {
          edges.forEach((edge, i) => {
            tl.to(edgeRefs.current[edge.id], { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' }, t + i * 0.25);
          });
          const nextTier = TIERS[gi + 1];
          nextTier.forEach((id, i) => {
            tl.to(nodeRefs.current[id], { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, t + 0.5 + i * 0.25);
          });
          t += 1.5;
        });

        const counterObj = { val: 0 };
        tl.to(counterObj, {
          val: 12480,
          duration: 1.6,
          ease: 'power1.out',
          onUpdate: () => {
            if (counterRef.current) counterRef.current.textContent = Math.round(counterObj.val).toLocaleString();
          },
        }, t + 0.3);

        gsap.to(liveDotRef.current, { scale: 1.4, opacity: 0, repeat: -1, duration: 1.6, ease: 'power1.out' });
      }, wrapRef);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <Wrap id="workflow" ref={wrapRef}>
      <Container>
        <Reveal>
          <Head>
            <Eyebrow>{c('workflow.eyebrow')}</Eyebrow>
            <SectionTitle>
              {c('workflow.title')} <GradientSpan>{c('workflow.titleGradient')}</GradientSpan>
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>{c('workflow.subtitle')}</SectionSubtitle>
          </Head>
        </Reveal>
      </Container>

      <Stage ref={pinRef}>
        <Container>
          <DiagramScroller>
            <Diagram dir="ltr">
              <DiagramDots />
              <LiveBadge>
                <PulseDotWrap>
                  <PulseDot />
                  <PulseDotGhost ref={liveDotRef} />
                </PulseDotWrap>
                {c('workflow.live')}
              </LiveBadge>

              <svg viewBox={`0 0 ${VBW} ${VBH}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <defs>
                  <filter id="wfEdgeGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {ALL_EDGES.map((edge) => (
                  <path key={edge.id} d={edge.d} fill="none" stroke={edge.tone} strokeOpacity={0.18} strokeWidth={2.5} />
                ))}
                {ALL_EDGES.map((edge) => (
                  <path
                    key={`${edge.id}-live`}
                    ref={(el) => { edgeRefs.current[edge.id] = el; }}
                    d={edge.d}
                    stroke={edge.tone}
                    strokeWidth={2.25}
                    fill="none"
                    opacity={0.9}
                    filter="url(#wfEdgeGlow)"
                  />
                ))}
              </svg>

              {FLOW.map((n) => (
                <NodeBox
                  key={n.id}
                  ref={(el) => { nodeRefs.current[n.id] = el; }}
                  $core={n.kind === 'core'}
                  $branch={n.kind === 'branch'}
                  style={{
                    left: pct(n.x - n.w / 2, VBW),
                    top: pct(n.y - n.h / 2, VBH),
                    width: pct(n.w, VBW),
                    height: pct(n.h, VBH),
                    background: n.background,
                  }}
                >
                  {n.kind === 'core' && <CoreGlow />}
                  {n.kind === 'branch' ? (
                    <BranchInner>
                      <IconWrap $sm>
                        <WorkflowBrandIcon name={n.icon} size={16} />
                      </IconWrap>
                      <NodeName $sm>{label(n.id)}</NodeName>
                    </BranchInner>
                  ) : (
                    <>
                      <CardTop>
                        <IconWrap $core={n.kind === 'core'}>
                          <WorkflowBrandIcon name={n.icon} size={n.kind === 'core' ? 24 : 20} />
                        </IconWrap>
                        <ChromeDots />
                      </CardTop>
                      <NodeName $core={n.kind === 'core'}>{label(n.id)}</NodeName>
                      {n.kind === 'core' && (
                        <PortLabels>
                          <span>{inputLabel}</span>
                          <span>{outputLabel}</span>
                        </PortLabels>
                      )}
                    </>
                  )}
                  {n.kind !== 'trigger' && <Handle $side="left" />}
                  {n.kind !== 'final' && <Handle $side="right" />}
                </NodeBox>
              ))}
            </Diagram>
          </DiagramScroller>

          <CounterRow>
            <CounterValue ref={counterRef}>0</CounterValue>
            <span>{c('workflow.counterLabel')}</span>
          </CounterRow>
        </Container>
      </Stage>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  padding: 7rem 0 5rem;
  background: var(--nl-bg);

  @media (max-width: 899px) {
    padding: 5rem 0 3.5rem;
  }
`;

const Stage = styled.div`
  padding-block: 1rem 0;
`;

const Head = styled.div`
  text-align: center;
  max-width: 720px;
  margin: 0 auto 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DiagramScroller = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const Diagram = styled.div`
  position: relative;
  width: 100%;
  min-width: 980px;
  aspect-ratio: ${VBW} / ${VBH};
  border-radius: 20px;
  border: 1px solid var(--nl-border);
  background:
    radial-gradient(55% 70% at 12% 50%, rgba(59,130,246,0.1), transparent),
    radial-gradient(50% 60% at 92% 50%, rgba(6,182,212,0.1), transparent),
    var(--nl-bg-elevated);
  overflow: hidden;
  box-shadow: var(--nl-card-inset), var(--nl-shadow-md);
`;

const DiagramDots = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: radial-gradient(var(--nl-border-strong) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.5;
  mask-image: radial-gradient(80% 85% at 50% 50%, black 30%, transparent 100%);
  pointer-events: none;
`;

const LiveBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  inset-inline-end: 1.75rem;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--nl-text-dim);
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  background: var(--nl-surface);
  border: 1px solid var(--nl-border);
`;

const PulseDotWrap = styled.span`
  position: relative;
  width: 7px;
  height: 7px;
  display: inline-block;
`;

const PulseDot = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #34d399;
`;

const PulseDotGhost = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #34d399;
`;

/** Same single-box card language as the hero workflow — real nodes, not
 * decorative placeholders. */
const NodeBox = styled.div<{ $core?: boolean; $branch?: boolean }>`
  position: absolute;
  z-index: ${({ $core }) => ($core ? 3 : 2)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ $core, $branch }) => ($core ? '12px 14px' : $branch ? '8px 12px' : '11px 14px')};
  border-radius: ${({ $branch }) => ($branch ? '12px' : '15px')};
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 16px 32px -16px rgba(0,0,0,0.55);
`;

const BranchInner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const CoreGlow = styled.div`
  position: absolute;
  inset: -26%;
  z-index: -1;
  background: radial-gradient(circle, rgba(6,182,212,0.35), transparent 70%);
  filter: blur(20px);
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
`;

const IconWrap = styled.div<{ $core?: boolean; $sm?: boolean }>`
  flex-shrink: 0;
  width: ${({ $core, $sm }) => ($core ? '34px' : $sm ? '26px' : '30px')};
  height: ${({ $core, $sm }) => ($core ? '34px' : $sm ? '26px' : '30px')};
  display: flex;
  align-items: center;
  justify-content: center;

  svg { display: block; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25)); }
`;

const Chrome = styled.div`
  display: flex;
  gap: 4px;

  span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.55);
  }
`;

const NodeName = styled.span<{ $core?: boolean; $sm?: boolean }>`
  display: block;
  font-size: ${({ $core, $sm }) => ($core ? '0.92rem' : $sm ? '0.82rem' : '0.88rem')};
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.35);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PortLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(255,255,255,0.75);
`;

const Handle = styled.span<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === 'left' ? 'left: -6px;' : 'right: -6px;')}
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.15);
  transform: translateY(-50%);
  z-index: 3;
  box-shadow: 0 1px 4px rgba(0,0,0,0.35);
`;

const CounterRow = styled.div`
  margin-top: 3rem;
  text-align: center;
  color: var(--nl-text-dim);
  font-size: 1.02rem;

  span { margin-inline-start: 0.5rem; }
`;

const CounterValue = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--nl-text);
`;
