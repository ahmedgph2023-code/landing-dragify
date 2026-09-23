import React, { useRef, useState, ReactNode, CSSProperties } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring, MotionProps } from 'framer-motion';
import { useLocalization } from '../../context/LocalizationContext';

// ---------------------------------------------------------------------------
// Content: thin wrapper over the site's i18n so every new-landing component
// reads translated copy from locales/*.json under the "landing" namespace.
// ---------------------------------------------------------------------------
export function useContent() {
  const { t, language, isRTL } = useLocalization();
  const c = (key: string) => t(`landing.${key}`);
  return { c, language, isRTL };
}

/** Brand wordmark — use instead of the plain text "Dragify". */
export function BrandLogo({
  height = 36,
  width,
  priority = false,
  className,
}: {
  height?: number;
  width?: number;
  priority?: boolean;
  className?: string;
}) {
  const w = width ?? Math.round(height * (118 / 38));
  return (
    <BrandLogoWrap className={className} style={{ height, width: w }}>
      <Image
        src="/logo3.png"
        alt="Dragify"
        width={w}
        height={height}
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        priority={priority}
      />
    </BrandLogoWrap>
  );
}

const BrandLogoWrap = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 0;
  flex-shrink: 0;
`;

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------
export const Section = styled.section<{ $pad?: string }>`
  position: relative;
  padding: ${({ $pad }) => $pad || '9rem 0'};
  @media (max-width: 900px) {
    padding: ${({ $pad }) => ($pad ? $pad : '5.5rem 0')};
  }
`;

export const Container = styled.div<{ $width?: number }>`
  max-width: ${({ $width }) => $width || 1280}px;
  margin: 0 auto;
  padding-inline: 1.75rem;
  position: relative;
  @media (max-width: 640px) {
    padding-inline: 1.25rem;
  }
`;

export const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--nl-text-dim);
  padding: 0.35rem 0.75rem 0.35rem 0.45rem;
  border: 1px solid var(--nl-border);
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  margin-bottom: 1.5rem;

  [data-nl-theme='light'] & {
    background: var(--nl-surface);
  }

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--nl-gradient-brand);
    box-shadow: 0 0 12px var(--nl-blue);
    flex-shrink: 0;
  }
`;

export const SectionTitle = styled.h2<{ $size?: string }>`
  font-family: inherit;
  font-size: ${({ $size }) => $size || 'clamp(2rem, 4.2vw, 3.4rem)'};
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--nl-text);
  margin: 0 0 1.25rem;

  html[lang='ar'] &,
  html[dir='rtl'] & {
    letter-spacing: 0;
  }

  > span {
    vertical-align: middle;
    margin-inline: 0.15em;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: clamp(1rem, 1.4vw, 1.15rem);
  line-height: 1.65;
  color: var(--nl-text-dim);
  max-width: 620px;
  margin: 0;
`;

export const GradientSpan = styled.span`
  background: var(--nl-gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
`;

export const GlassCard = styled.div<{ $hoverLift?: boolean }>`
  position: relative;
  background: var(--nl-bg-elevated);
  border: 1px solid var(--nl-border);
  border-radius: var(--nl-radius);
  box-shadow: var(--nl-card-inset), var(--nl-shadow-sm);
  backdrop-filter: blur(var(--nl-glass-blur));
  -webkit-backdrop-filter: blur(var(--nl-glass-blur));
  transition: border-color 0.4s var(--nl-ease-out), transform 0.4s var(--nl-ease-out), box-shadow 0.4s var(--nl-ease-out);

  [data-nl-theme='dark'] & {
    background:
      radial-gradient(55% 100% at 55% 2%, rgba(59, 130, 246, 0.16) 0%, transparent),
      linear-gradient(180deg, transparent, rgba(11, 18, 32, 0.35)),
      var(--nl-bg-elevated);
  }

  ${({ $hoverLift }) =>
    $hoverLift &&
    `
    &:hover {
      border-color: var(--nl-border-strong);
      box-shadow: var(--nl-card-inset), var(--nl-shadow-md);
      transform: translateY(-4px);
    }
  `}
`;

// ---------------------------------------------------------------------------
// Reveal: scroll-triggered fade/rise wrapper used throughout every section.
// ---------------------------------------------------------------------------
export function Reveal({
  children,
  delay = 0,
  y = 28,
  once = true,
  amount = 0.2,
  style,
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  style?: CSSProperties;
  className?: string;
} & MotionProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// MagneticButton: premium hover-follows-cursor button used for primary CTAs.
// Solid saturated gradient + white text so it reads on both themes.
// ---------------------------------------------------------------------------
const MagWrap = styled(motion.button)<{ $variant: 'primary' | 'ghost' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  height: 40px;
  padding: 0 1.15rem;
  border-radius: 10px;
  box-sizing: border-box;
  white-space: nowrap;
  letter-spacing: -0.01em;
  overflow: hidden;
  transition: filter 0.25s ease, box-shadow 0.3s ease;

  ${({ $variant }) =>
    $variant === 'primary'
      ? `
    color: #fff;
    background: var(--nl-gradient-brand);
    box-shadow:
      inset 0 1px 1px rgba(255,255,255,0.22),
      0 8px 28px -10px rgba(37, 99, 235, 0.5);

    &:hover {
      filter: brightness(1.06);
      box-shadow:
        inset 0 1px 1px rgba(255,255,255,0.28),
        0 12px 36px -8px rgba(124, 58, 237, 0.55);
    }
  `
      : `
    color: var(--nl-text);
    background: rgba(163, 163, 163, 0.18);
    border: 1px solid var(--nl-border);

    &:hover {
      background: rgba(188, 188, 188, 0.22);
    }
  `}
`;

export function MagneticButton({
  children,
  variant = 'primary',
  onClick,
  href,
  target,
  style,
}: {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
  href?: string;
  target?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <MagWrap
      ref={ref}
      $variant={variant}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </MagWrap>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={target ? 'noopener noreferrer' : undefined} style={{ display: 'inline-block' }}>
        {content}
      </a>
    );
  }
  return content;
}

// ---------------------------------------------------------------------------
// WorkflowBrandIcon: shared node iconography for the hero workflow and the
// "see it run" diagram, so every workflow visual on the page reads as one
// consistent system instead of two different icon sets.
// ---------------------------------------------------------------------------
export type WorkflowIconName =
  | 'whatsapp'
  | 'gmail'
  | 'shopify'
  | 'slack'
  | 'robot'
  | 'crm'
  | 'headset'
  | 'alert'
  | 'doc'
  | 'ticket'
  | 'bell'
  | 'chat';

export function WorkflowBrandIcon({ name, size = 26 }: { name: WorkflowIconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: '#fff', 'aria-hidden': true as const };
  switch (name) {
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.99.58 3.84 1.6 5.4L2 22l4.92-1.61a9.86 9.86 0 0 0 5.12 1.41h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.73 13.98c-.24.67-1.4 1.24-1.93 1.32-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.93-4.36-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.14.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.28.37-.23.62-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.32.07.12.07.67-.17 1.34z" />
        </svg>
      );
    case 'gmail':
      return (
        <svg {...common}>
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.25L12 13.5 4 8.25V6.5l8 5.25L20 6.5v1.75z" />
        </svg>
      );
    case 'shopify':
      return (
        <svg {...common}>
          <path d="M15.337 3.034a.55.55 0 0 0-.345.134l-1.05.314a3.2 3.2 0 0 0-.58-.98C12.8 1.86 12.05 1.5 11.2 1.55c-.2.01-.39.06-.56.14L9.9 3.9l-1.75.4c-.35.08-.55.14-.55.14l.08.42s.38-.1.72-.18l2.95-.7.78-.2c.14.5.34 1.02.62 1.45.22.34.46.58.7.72L9.2 19.3a.2.2 0 0 0 .19.26h2.85a.2.2 0 0 0 .2-.14l3.15-9.55.95-.25-2.8 8.65a.2.2 0 0 0 .19.26h2.9a.2.2 0 0 0 .2-.14l3.35-10.5a.2.2 0 0 0-.1-.24l-1.4-.35v-.2c0-1.65-.9-3.05-2.35-3.7a2.4 2.4 0 0 0-1.15-.35zm-.85 1.5.95-.25c.85.45 1.4 1.35 1.4 2.35v.15l-1.65.4c-.2-.7-.55-1.45-1-2 .1-.2.2-.4.3-.65zM11.35 4c.35.02.65.22.9.55.25.35.4.8.5 1.25l-1.75.4c.1-.9.25-1.75.35-2.2z" />
        </svg>
      );
    case 'slack':
      return (
        <svg {...common}>
          <path d="M9.1 11.4a1.55 1.55 0 1 1-1.55-1.55h1.55v1.55zm.8 0A1.55 1.55 0 1 1 12.45 14.5v4.1a1.55 1.55 0 1 1-3.1 0v-4.1a1.55 1.55 0 0 1 .55-3.1zM11.4 9.1A1.55 1.55 0 1 1 12.95 7.55V9.1H11.4zm0 .8A1.55 1.55 0 1 1 8.3 12.45H4.2a1.55 1.55 0 1 1 0-3.1h4.1a1.55 1.55 0 0 1 3.1.55zm3.5 1.5a1.55 1.55 0 1 1 1.55 1.55H14.9v-1.55zm-.8 0A1.55 1.55 0 1 1 11.55 9.5V5.4a1.55 1.55 0 1 1 3.1 0v4.1a1.55 1.55 0 0 1-.55 3.1zM12.6 14.9a1.55 1.55 0 1 1 1.55 1.55V14.9H12.6zm0-.8A1.55 1.55 0 1 1 15.7 11.55h4.1a1.55 1.55 0 1 1 0 3.1h-4.1a1.55 1.55 0 0 1-3.1-.55z" />
        </svg>
      );
    case 'robot':
      return (
        <svg {...common}>
          <path d="M12 2a1 1 0 0 1 1 1v1.05A7.5 7.5 0 0 1 19.5 11.5V13a1.5 1.5 0 0 1-1.5 1.5h-1v1.75A2.75 2.75 0 0 1 14.25 19H13.5v1.25a.75.75 0 0 1-1.5 0V19h-1v1.25a.75.75 0 0 1-1.5 0V19H9.75A2.75 2.75 0 0 1 7 16.25V14.5H6A1.5 1.5 0 0 1 4.5 13v-1.5A7.5 7.5 0 0 1 11 4.05V3a1 1 0 0 1 1-1zM9.25 11a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm5.5 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5z" />
        </svg>
      );
    case 'crm':
      return (
        <svg {...common}>
          <path d="M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c-4.2 0-7.5 2.1-7.5 4.7V19a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-1.3c0-2.6-3.3-4.7-7.5-4.7Z" />
        </svg>
      );
    case 'headset':
      return (
        <svg {...common}>
          <path d="M12 3a7 7 0 0 0-7 7v5a2 2 0 0 0 2 2h1v-6H6v-1a6 6 0 0 1 12 0v1h-2v6h1a2 2 0 0 0 2-2v-5a7 7 0 0 0-7-7Zm-5 12v-4h1v4H7Zm10 0v-4h1v4h-1Z" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...common}>
          <path d="M12 2 1 21h22L12 2Zm0 6a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm0 9.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
        </svg>
      );
    case 'doc':
      return (
        <svg {...common}>
          <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5v-15Zm10-1.5h4.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H14V3Z" />
        </svg>
      );
    case 'ticket':
      return (
        <svg {...common}>
          <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8Zm8-1v2h2V7h-2Zm0 4v2h2v-2h-2Zm0 4v2h2v-2h-2Z" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M12 2a2 2 0 0 0-2 2v.6A6 6 0 0 0 6 10v4l-1.7 2.5A1 1 0 0 0 5.1 18h13.8a1 1 0 0 0 .8-1.5L18 14v-4a6 6 0 0 0-4-5.4V4a2 2 0 0 0-2-2Zm0 19a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 21Z" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.68 1.4 5.07 3.6 6.68L5 22l4.4-2.35c.83.18 1.7.28 2.6.28 5.52 0 10-3.94 10-8.93S17.52 2 12 2Z" />
        </svg>
      );
  }
}

// An inline arrow that mirrors for RTL automatically.
export function ArrowIcon({ size = 16 }: { size?: number }) {
  const { isRTL } = useContent();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isRTL ? 'scaleX(-1)' : undefined, flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// useInViewCounter: counts up when scrolled into view.
// ---------------------------------------------------------------------------
export function useInViewCounter(target: number, duration = 1.6) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  const start = () => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return { value, start };
}
