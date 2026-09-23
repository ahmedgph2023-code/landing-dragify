import { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, Variants, useMotionValue, useSpring } from 'framer-motion';

export const MAX_WIDTH = 1240;

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: 'spring' as const, stiffness: 120, damping: 18 },
};

/* ---------------------------------- gsap ---------------------------------- */
// Central, idempotent ScrollTrigger registration — safe to call from every
// component; gsap no-ops a duplicate registerPlugin call.
export async function getGsap() {
  const gsapModule = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsapModule.gsap.registerPlugin(ScrollTrigger);
  return { gsap: gsapModule.gsap, ScrollTrigger };
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ------------------------------- word reveal ------------------------------- */
// Splits localized copy (which may contain "<highlight>…</highlight>" markers)
// into whole-word tokens for stagger animation. Word-level ONLY: Arabic script
// requires contextual letter joining, so splitting into individual characters
// (a common western-only reveal trick) would visibly break Arabic glyph
// shaping. Every reveal in this file therefore animates whole words.
export function splitHighlightedWords(raw: string): { text: string; highlight: boolean }[] {
  const tokens: { text: string; highlight: boolean }[] = [];
  const parts = raw.split(/<highlight>|<\/highlight>/);
  let highlighted = false;
  for (const part of parts) {
    if (part === '') {
      highlighted = !highlighted;
      continue;
    }
    part.split(/\s+/).filter(Boolean).forEach((word) => {
      tokens.push({ text: word, highlight: highlighted });
    });
    highlighted = !highlighted;
  }
  return tokens;
}

const wordWrapVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

const wordVariants: Variants = {
  hidden: { y: '110%', opacity: 0, rotateZ: 4 },
  visible: { y: '0%', opacity: 1, rotateZ: 0, transition: { duration: 0.85, ease: ease.out } },
};

export function WordReveal({
  words,
  as: Tag = 'span',
  delay = 0,
  className,
}: {
  words: { text: string; highlight: boolean }[];
  as?: 'span' | 'h1' | 'h2';
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      style={{ display: 'inline' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={wordWrapVariants}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', marginInlineEnd: '0.28em' }}>
          <motion.span
            variants={wordVariants}
            style={{ display: 'inline-block' }}
            className={w.highlight ? 'gradient-word' : undefined}
          >
            {w.text}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* --------------------------------- layout --------------------------------- */
export const Container = styled.div`
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  padding-inline: 1.5rem;
`;

export const Section = styled.section<{ $tight?: boolean }>`
  position: relative;
  padding-block: ${({ $tight }) => ($tight ? '4rem' : '8rem')};

  @media (max-width: 768px) {
    padding-block: ${({ $tight }) => ($tight ? '3rem' : '5rem')};
  }
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent.blue};
  margin-bottom: 1.1rem;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  }
`;

export const GradientText = styled.span`
  --g-blue: ${({ theme }) => theme.colors.accent.blue};
  --g-purple: ${({ theme }) => theme.colors.accent.purple};
  background: linear-gradient(100deg, var(--g-blue) 15%, var(--g-purple) 85%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const SectionHeader = styled.div<{ $align?: 'start' | 'center' }>`
  max-width: 660px;
  margin-block-end: 4rem;
  margin-inline: ${({ $align }) => ($align === 'start' ? '0' : 'auto')};
  text-align: ${({ $align }) => $align || 'center'};
`;

export const SectionTitle = styled.h2`
  --g-blue: ${({ theme }) => theme.colors.accent.blue};
  --g-purple: ${({ theme }) => theme.colors.accent.purple};
  font-size: clamp(2.1rem, 3.8vw, 3rem);
  line-height: 1.12;
  letter-spacing: -0.025em;
  font-weight: 800;
  margin: 0 0 1.1rem;
  color: ${({ theme }) => theme.colors.text.primary};

  .gradient-word {
    background: linear-gradient(100deg, var(--g-blue) 15%, var(--g-purple) 85%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

export const SectionDescription = styled.p`
  font-size: 1.15rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

/* --------------------------------- buttons --------------------------------- */
const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 100px;
  text-decoration: none;
  white-space: nowrap;
  will-change: transform;
`;

export const PrimaryLink = styled(ButtonBase).attrs({ as: 'a' })`
  color: white;
  background: linear-gradient(100deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  box-shadow: 0 10px 30px -10px ${({ theme }) => theme.colors.accent.blue}77;
`;

export const GhostLink = styled(ButtonBase).attrs({ as: 'a' })`
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// A button that leans gently toward the cursor while hovered — the
// "magnetic" micro-interaction common to premium agency sites.
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactElement; strength?: number }) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * strength);
      y.set((e.clientY - rect.top - rect.height / 2) * strength);
    },
    [strength, x, y]
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.span
      ref={ref as any}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: 'inline-block', x: sx, y: sy }}
    >
      {children}
    </motion.span>
  );
}

/* ---------------------------------- cards ---------------------------------- */
export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

type TiltCardProps = Omit<React.ComponentProps<typeof motion.div>, 'children'> & {
  children: React.ReactNode;
  max?: number;
};

// Cursor-tracked 3D tilt + a soft spotlight highlight that follows the pointer.
// Forwards every other motion.div prop (variants, transition, whileInView, …)
// so it composes with framer-motion stagger/reveal patterns like any other
// motion component.
export function TiltCard({
  children,
  className,
  style,
  max = 8,
  ...motionProps
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });
  const [spot, setSpot] = useState({ x: 50, y: 50, active: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    setSpot({ x: px * 100, y: py * 100, active: 1 });
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    setSpot((s) => ({ ...s, active: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...motionProps}
      style={{
        ...style,
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 900,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <SpotlightLayer style={{ opacity: spot.active, background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, var(--spot-color, rgba(120,140,255,0.16)), transparent 70%)` }} />
      {children}
    </motion.div>
  );
}

const SpotlightLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 0;
`;

/* -------------------------------- reveal --------------------------------- */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export function Reveal({
  children,
  delay = 0,
  className,
  y = 32,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
