import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  CSSProperties,
} from 'react';
import styled from 'styled-components';
import { useLocalization } from '../../context/LocalizationContext';

export function useL3() {
  const { t, language, isRTL, setLanguage } = useLocalization();
  const c = (key: string) => t(`landing3.${key}`);
  return { c, language, isRTL, setLanguage, t };
}

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
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export const Shell = styled.div.attrs({ suppressHydrationWarning: true })`
  background: var(--l3-bg);
  color: var(--l3-ink);
  overflow-x: clip;
  min-height: 100vh;
  font-family: var(--l3-font);
`;

export const Container = styled.div<{ $wide?: boolean }>`
  width: 100%;
  max-width: ${({ $wide }) => ($wide ? '1280px' : 'var(--l3-max)')};
  margin: 0 auto;
  padding-inline: clamp(1.25rem, 3vw, 2rem);
`;

export const Kicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--l3-blue);
  margin-bottom: 1.2rem;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--l3-grad-btn);
  }
`;

export const Display = styled.h2`
  font-family: inherit;
  font-weight: 800;
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--l3-ink);
  margin: 0 0 1.1rem;
`;

export const Lead = styled.p`
  font-size: clamp(1rem, 1.4vw, 1.15rem);
  line-height: 1.65;
  color: var(--l3-muted);
  max-width: 36rem;
  margin: 0;
`;

export const GradientWord = styled.span`
  background: var(--l3-grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const PrimaryCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.55rem;
  border-radius: 999px;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff !important;
  background: var(--l3-grad-btn);
  border: none;
  text-decoration: none !important;
  box-shadow: 0 10px 28px -12px var(--l3-glow);
  transition: transform 0.3s var(--l3-ease), box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px -12px var(--l3-glow-violet);
  }
`;

export const GhostCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.9rem 1.4rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--l3-ink) !important;
  background: transparent;
  border: 1px solid var(--l3-line-strong);
  text-decoration: none !important;
  transition: border-color 0.25s ease, background 0.25s ease;
  &:hover {
    border-color: var(--l3-blue);
    background: var(--l3-surface);
  }
`;

export function Arrow({ size = 16 }: { size?: number }) {
  const { isRTL } = useL3();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      style={{ transform: isRTL ? 'scaleX(-1)' : undefined, flexShrink: 0 }}
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
      return;
    }
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await getGsap();
      if (cancelled || !ref.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [delay, y, reduced]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, ...style }}>
      {children}
    </div>
  );
}
