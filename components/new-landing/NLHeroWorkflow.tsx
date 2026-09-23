import { useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useContent, WorkflowBrandIcon, type WorkflowIconName } from './shared';

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

type FlowNode = {
  id: NodeId;
  x: number;
  y: number;
  background: string;
  kind: Kind;
  icon: WorkflowIconName;
};

const BLUE = '#3b82f6';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#1fac57';
const CYAN = '#06b6d4';
const SLACK = '#8a3e9e';

/** Same branching story as before — styled like the real workflow-builder cards. */
const FLOW: FlowNode[] = [
  { id: 'trigger', x: 50, y: 5, background: GREEN, kind: 'trigger', icon: 'whatsapp' },
  { id: 'classifier', x: 50, y: 25, background: CYAN, kind: 'core', icon: 'robot' },

  { id: 'support', x: 16, y: 45, background: BLUE, kind: 'branch', icon: 'headset' },
  { id: 'salesLead', x: 50, y: 45, background: AMBER, kind: 'branch', icon: 'crm' },
  { id: 'complaint', x: 84, y: 45, background: RED, kind: 'branch', icon: 'alert' },

  { id: 'knowledge', x: 16, y: 64, background: BLUE, kind: 'branch', icon: 'doc' },
  { id: 'crmCreate', x: 50, y: 64, background: AMBER, kind: 'branch', icon: 'crm' },
  { id: 'createTicket', x: 84, y: 64, background: RED, kind: 'branch', icon: 'ticket' },

  { id: 'aiResponse', x: 16, y: 83, background: BLUE, kind: 'branch', icon: 'chat' },
  { id: 'notifySales', x: 50, y: 83, background: AMBER, kind: 'branch', icon: 'bell' },
  { id: 'notifySlack', x: 84, y: 83, background: SLACK, kind: 'branch', icon: 'slack' },

  { id: 'final', x: 50, y: 97, background: GREEN, kind: 'final', icon: 'whatsapp' },
];

const byId = (id: NodeId) => FLOW.find((n) => n.id === id)!;

const BRANCH1: NodeId[] = ['support', 'salesLead', 'complaint'];
const BRANCH2: NodeId[] = ['knowledge', 'crmCreate', 'createTicket'];
const BRANCH3: NodeId[] = ['aiResponse', 'notifySales', 'notifySlack'];
const TIERS: NodeId[][] = [['trigger'], ['classifier'], BRANCH1, BRANCH2, BRANCH3, ['final']];

/** Matches workflow-builder edge color (`theme.colors.primaryHover`). */
const EDGE_COLOR = '#8172FF';
/** One consistent card size for every non-core node — trigger, branch and
 * final all read as the same real "node" now, just the AI Classifier core
 * gets a little extra presence. */
const NODE_HALF_H = 6.3;
const CORE_HALF_H = 6.9;
const DASH = 160;

function halfHeightOf(kind: Kind) {
  return kind === 'core' ? CORE_HALF_H : NODE_HALF_H;
}

type EdgeSeg = { id: string; d: string };

/** Smooth-step path — same family as React Flow `getSmoothStepPath` in the builder. */
function stepCurve(x1: number, y1: number, x2: number, y2: number) {
  const midY = (y1 + y2) / 2;
  return `M${x1} ${y1} L${x1} ${midY} L${x2} ${midY} L${x2} ${y2}`;
}

function edgeBetween(aId: NodeId, bId: NodeId): EdgeSeg {
  const a = byId(aId);
  const b = byId(bId);
  return {
    id: `${aId}-${bId}`,
    d: stepCurve(a.x, a.y + halfHeightOf(a.kind), b.x, b.y - halfHeightOf(b.kind)),
  };
}

function buildEdgeGroups(): EdgeSeg[][] {
  return [
    [edgeBetween('trigger', 'classifier')],
    BRANCH1.map((id) => edgeBetween('classifier', id)),
    [
      edgeBetween('support', 'knowledge'),
      edgeBetween('salesLead', 'crmCreate'),
      edgeBetween('complaint', 'createTicket'),
    ],
    [
      edgeBetween('knowledge', 'aiResponse'),
      edgeBetween('crmCreate', 'notifySales'),
      edgeBetween('createTicket', 'notifySlack'),
    ],
    BRANCH3.map((id) => edgeBetween(id, 'final')),
  ];
}

const EDGE_GROUPS = buildEdgeGroups();
const ALL_EDGES = EDGE_GROUPS.flat();

/** Slowed to a deliberate ~4s-per-node cadence — this is a demo reel, not a
 * race. Every tier gets real dwell time so each node is clearly watched
 * activating instead of flickering past. */
const D = 2.6;
const INTRO = 2.0;
const HOLD = 1.6;

function ChromeIcons() {
  return (
    <Chrome>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" strokeLinecap="round" />
      </svg>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Chrome>
  );
}

export default function NLHeroWorkflow({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { c } = useContent();
  const label = (id: NodeId) => c(`hero.workflow.${id}`);
  const sparkleLabel = c('hero.workflow.newMessage');

  const overlayRefs = useRef<Record<string, SVGPathElement | null>>({});
  const cometRefs = useRef<Record<string, SVGPathElement | null>>({});
  const flashRefs = useRef<Record<NodeId, HTMLSpanElement | null>>({} as Record<NodeId, HTMLSpanElement | null>);
  const boxRefs = useRef<Record<NodeId, HTMLDivElement | null>>({} as Record<NodeId, HTMLDivElement | null>);
  const sparkleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    let ctx: any;
    let cancelled = false;

    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.gsap ?? gsapModule.default;
      if (cancelled) return;

      ctx = gsap.context(() => {
        const overlays = ALL_EDGES.map((e) => overlayRefs.current[e.id]).filter(Boolean);
        const comets = ALL_EDGES.map((e) => cometRefs.current[e.id]).filter(Boolean);
        const flashes = FLOW.map((n) => flashRefs.current[n.id]).filter(Boolean);

        gsap.set(overlays, { opacity: 0, strokeDashoffset: DASH });
        gsap.set(comets, { opacity: 0, strokeDashoffset: DASH + 6 });
        gsap.set(flashes, { opacity: 0 });
        gsap.set(sparkleRef.current, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' });

        const pulse = (id: NodeId, at: number, strong = false) => {
          const flash = flashRefs.current[id];
          const box = boxRefs.current[id];
          if (flash) {
            tl.to(flash, { opacity: strong ? 0.45 : 0.3, duration: 0.85, ease: 'power2.out' }, at);
            tl.to(flash, { opacity: 0, duration: 2.1, ease: 'power2.out' }, at + 0.85);
          }
          if (box) {
            tl.to(box, { scale: strong ? 1.05 : 1.03, duration: 0.85, ease: 'power2.out' }, at);
            tl.to(box, { scale: 1, duration: 1.7, ease: 'power2.out' }, at + 0.85);
          }
        };

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.3, defaults: { ease: 'power2.out' } });
        let t = 0;

        pulse('trigger', t, true);
        tl.to(sparkleRef.current, { opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(2)' }, t + 0.25);
        tl.to(sparkleRef.current, { opacity: 0, duration: 1.1 }, t + 1.5);
        t += INTRO;

        EDGE_GROUPS.forEach((edges, gi) => {
          edges.forEach((edge, i) => {
            const at = t + i * 0.32;
            tl.to(overlayRefs.current[edge.id], { opacity: 1, strokeDashoffset: 0, duration: 1.8, ease: 'sine.inOut' }, at);
            tl.to(cometRefs.current[edge.id], { opacity: 1, duration: 0.35 }, at);
            tl.to(cometRefs.current[edge.id], { strokeDashoffset: -8, duration: 1.8, ease: 'sine.inOut' }, at);
            tl.to(cometRefs.current[edge.id], { opacity: 0, duration: 0.55 }, at + 1.4);
          });

          const nextTier = TIERS[gi + 1];
          nextTier.forEach((id, i) => {
            pulse(id, t + 1.5 + i * 0.32, id === 'classifier' || id === 'final');
          });

          t += D;
        });

        t += HOLD;
        tl.to(overlays, { opacity: 0, duration: 2.3 }, t);
        t += 2.7;
        tl.set(overlays, { strokeDashoffset: DASH }, t);
        tl.set(comets, { strokeDashoffset: DASH + 6 }, t);
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <Stage>
      <StageGlow />
      <Dots />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="edges">
        <defs>
          <filter id="heroEdgeGlowStrong" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="0.55" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="heroCometGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {ALL_EDGES.map((edge) => (
          <g key={edge.id}>
            {/* Idle dashed track — matches builder BaseEdge strokeDasharray="5 7" */}
            <path
              d={edge.d}
              fill="none"
              stroke={EDGE_COLOR}
              strokeWidth="0.55"
              strokeOpacity={0.55}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.4 1.9"
            />
            {!reducedMotion && (
              <>
                <path
                  ref={(el) => { overlayRefs.current[edge.id] = el; }}
                  d={edge.d}
                  fill="none"
                  stroke={EDGE_COLOR}
                  strokeOpacity={0.95}
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={DASH}
                  strokeDashoffset={DASH}
                  opacity={0}
                  filter="url(#heroEdgeGlowStrong)"
                />
                <path
                  ref={(el) => { cometRefs.current[edge.id] = el; }}
                  d={edge.d}
                  fill="none"
                  stroke="#F4F2FF"
                  strokeWidth="1.05"
                  strokeLinecap="round"
                  strokeDasharray="5 300"
                  strokeDashoffset={DASH + 6}
                  opacity={0}
                  filter="url(#heroCometGlow)"
                />
              </>
            )}
          </g>
        ))}
      </svg>

      <SparkleBadge ref={sparkleRef} $x={50} $y={14.5}>
        <span>✨</span>
        {sparkleLabel}
      </SparkleBadge>

      {FLOW.map((n, i) => (
        <NodeWrap
          key={n.id}
          $x={n.x}
          $y={n.y}
          $delay={0.25 + i * 0.04}
          $float={!reducedMotion}
          $core={n.kind === 'core'}
        >
          <BuilderCard
            ref={(el) => { boxRefs.current[n.id] = el; }}
            $core={n.kind === 'core'}
          >
            <IconTile style={{ background: n.background }}>
              <WorkflowBrandIcon name={n.icon} size={n.kind === 'core' ? 22 : 19} />
            </IconTile>
            <NodeMid aria-hidden>
              <NodeDivider />
            </NodeMid>
            <ChromeIcons />
            {n.kind !== 'trigger' && <Handle $side="top" />}
            {n.kind !== 'final' && <Handle $side="bottom" />}
            <FlashOverlay ref={(el) => { flashRefs.current[n.id] = el; }} />
          </BuilderCard>
          <NodeCaption $core={n.kind === 'core'}>{label(n.id)}</NodeCaption>
        </NodeWrap>
      ))}
    </Stage>
  );
}

const floatY = keyframes`
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(-3px); }
`;

const nodeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) translateY(14px) scale(0.94); }
  to { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); }
`;

const Stage = styled.div`
  position: relative;
  width: 100%;
  height: 740px;
  overflow: visible;

  .edges {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    height: 640px;
  }

  @media (max-width: 640px) {
    height: 560px;
  }
`;

const StageGlow = styled.div`
  position: absolute;
  inset: 8% 22%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(129, 114, 255, 0.18), transparent 70%);
  filter: blur(36px);
  pointer-events: none;
  z-index: 0;
`;

const Dots = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: radial-gradient(rgba(148, 163, 184, 0.26) 1.15px, transparent 1.15px);
  background-size: 17px 17px;
  opacity: 0.6;
  pointer-events: none;
  mask-image: radial-gradient(65% 60% at 50% 45%, black 40%, transparent 100%);

  [data-nl-theme='light'] & {
    background-image: radial-gradient(#cbd5e1 1.15px, transparent 1.15px);
    opacity: 0.75;
  }
`;

const sparklePulse = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const SparkleBadge = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.7rem;
  border-radius: 100px;
  font-size: 0.6rem;
  font-weight: 700;
  white-space: nowrap;
  color: #fff;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.5);
  animation: ${sparklePulse} 2.6s ease-in-out infinite;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const NodeWrap = styled.div<{
  $x: number;
  $y: number;
  $delay: number;
  $float: boolean;
  $core?: boolean;
}>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  z-index: ${({ $core }) => ($core ? 4 : 2)};
  opacity: 0;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: ${nodeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${({ $delay }) => $delay}s forwards;
  ${({ $float, $delay }) =>
    $float &&
    css`
      animation:
        ${nodeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${$delay}s forwards,
        ${floatY} 5.5s ease-in-out ${$delay + 0.8}s infinite;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: ${nodeIn} 0.01s linear ${({ $delay }) => $delay}s forwards !important;
  }
`;

/**
 * Minimized workflow-builder node chrome:
 * white card · brand icon tile · center divider · expand/delete actions.
 * One unified size for every node — trigger, branch and final all match;
 * only the AI Classifier core is a touch bigger.
 */
const BuilderCard = styled.div<{ $core?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ $core }) => ($core ? '148px' : '134px')};
  height: ${({ $core }) => ($core ? '82px' : '74px')};
  padding: 9px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1.5px solid #e6e2f6;
  border-radius: 16px;
  box-shadow:
    0 4px 8px rgba(29, 20, 70, 0.06),
    0 16px 28px -14px rgba(29, 20, 70, 0.22);
  transform-origin: center center;

  @media (max-width: 640px) {
    width: ${({ $core }) => ($core ? '124px' : '112px')};
    height: ${({ $core }) => ($core ? '68px' : '62px')};
    padding: 7px;
  }
`;

const IconTile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border-radius: 13px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.3) inset,
    0 -3px 6px rgba(0, 0, 0, 0.14) inset,
    0 8px 16px -6px rgba(0, 0, 0, 0.35);

  svg {
    display: block;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }

  @media (max-width: 640px) {
    flex-basis: 40px;
    width: 40px;
    height: 40px;
    border-radius: 11px;
  }
`;

const NodeMid = styled.div`
  flex: 1 1 auto;
  min-width: 8px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const NodeDivider = styled.div`
  width: 1px;
  height: 36px;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    rgba(230, 226, 246, 0) 0%,
    rgba(199, 191, 232, 0.95) 18%,
    rgba(129, 114, 255, 0.55) 50%,
    rgba(199, 191, 232, 0.95) 82%,
    rgba(230, 226, 246, 0) 100%
  );
  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.65);
`;

const Chrome = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 28px;
  width: 28px;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #9c97b3;
`;

const FlashOverlay = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: #8172ff;
  mix-blend-mode: soft-light;
  opacity: 0;
  pointer-events: none;
  z-index: 5;
`;

/** Same size for every node's caption; wraps instead of truncating so
 * longer labels ("Knowledge Base", "Notify Slack"…) never get clipped. */
const NodeCaption = styled.div<{ $core?: boolean }>`
  max-width: ${({ $core }) => ($core ? '156px' : '142px')};
  text-align: center;
  font-size: ${({ $core }) => ($core ? '0.76rem' : '0.7rem')};
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--nl-text);
  white-space: normal;
  overflow-wrap: break-word;
  text-shadow: 0 1px 8px rgba(15, 23, 42, 0.12);

  [data-nl-theme='dark'] & {
    color: rgba(248, 250, 252, 0.92);
  }
`;

/** Builder handle: white fill, muted purple-gray ring. */
const Handle = styled.span<{ $side: 'top' | 'bottom' }>`
  position: absolute;
  left: 50%;
  ${({ $side }) => ($side === 'top' ? 'top: -5px;' : 'bottom: -5px;')}
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #9c97b3;
  transform: translateX(-50%);
  z-index: 3;
  box-shadow: 0 2px 6px rgba(29, 20, 70, 0.15);
`;
