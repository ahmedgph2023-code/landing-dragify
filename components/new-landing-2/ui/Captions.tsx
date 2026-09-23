import type { CSSProperties, ReactNode } from 'react';
import { captionVisibility, SCENE_STATES } from '../../../config/newLanding2Scene';

type CaptionAlign = 'center' | 'left' | 'right' | 'bottom';

const alignStyle = (align: CaptionAlign, isMobile: boolean): CSSProperties => {
  if (isMobile || align === 'center') {
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      width: 'min(640px, calc(100% - 2.5rem))',
    };
  }
  if (align === 'bottom') {
    return {
      left: '50%',
      bottom: '12%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      width: 'min(720px, calc(100% - 2.5rem))',
    };
  }
  if (align === 'left') {
    return {
      left: '6%',
      top: '50%',
      transform: 'translateY(-50%)',
      textAlign: 'start',
      width: 'min(420px, 38vw)',
    };
  }
  return {
    right: '6%',
    top: '50%',
    transform: 'translateY(-50%)',
    textAlign: 'start',
    width: 'min(420px, 38vw)',
  };
};

export function CaptionLayer({
  id,
  progress,
  isMobile,
  children,
}: {
  id: string;
  progress: number;
  isMobile: boolean;
  children: ReactNode;
}) {
  const state = SCENE_STATES.find((s) => s.id === id);
  if (!state) return null;
  const vis = captionVisibility(progress, id);
  if (vis < 0.02) return null;

  return (
    <div
      className="nl2-caption"
      style={{
        position: 'absolute',
        zIndex: 20,
        pointerEvents: vis > 0.55 ? 'auto' : 'none',
        opacity: vis,
        filter: `blur(${(1 - vis) * 8}px)`,
        transition: 'none',
        ...alignStyle(state.caption, isMobile),
      }}
    >
      {children}
    </div>
  );
}

export function Grad({ children }: { children: ReactNode }) {
  return <span className="nl2-grad">{children}</span>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="nl2-eyebrow">{children}</p>;
}
