import type { ReactNode } from 'react';

/** Soft plate so copy stays readable without burying the 3D scene. */
export function TextPanel({
  children,
  align = 'center',
  wide = false,
  strong = false,
}: {
  children: ReactNode;
  align?: 'center' | 'start' | 'end';
  wide?: boolean;
  strong?: boolean;
}) {
  const alignClass =
    align === 'start'
      ? 'text-start me-auto'
      : align === 'end'
        ? 'text-start ms-auto'
        : 'text-center mx-auto';

  return (
    <div className={`relative w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} ${alignClass}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -inset-y-8 md:-inset-x-12 md:-inset-y-12"
        style={{
          background: strong
            ? 'radial-gradient(ellipse 78% 72% at 50% 50%, rgba(7,10,18,0.92) 0%, rgba(7,10,18,0.72) 46%, rgba(7,10,18,0) 76%)'
            : 'radial-gradient(ellipse 72% 68% at 50% 50%, rgba(11,18,32,0.62) 0%, rgba(11,18,32,0.28) 48%, rgba(11,18,32,0) 74%)',
        }}
      />
      <div
        className="relative rounded-[1.75rem] border border-white/[0.12] px-6 py-8 shadow-[0_24px_80px_-28px_rgba(59,130,246,0.35)] backdrop-blur-[10px] md:px-10 md:py-11"
        style={{
          background: strong
            ? 'linear-gradient(155deg, rgba(11,18,32,0.88) 0%, rgba(11,18,32,0.78) 55%, rgba(17,24,39,0.84) 100%)'
            : 'linear-gradient(155deg, rgba(17,24,39,0.55) 0%, rgba(11,18,32,0.38) 55%, rgba(17,24,39,0.42) 100%)',
          boxShadow: strong
            ? '0 0 0 1px rgba(59,130,246,0.22) inset, 0 28px 90px -24px rgba(0,0,0,0.7)'
            : '0 0 0 1px rgba(59,130,246,0.12) inset, 0 24px 80px -28px rgba(139,92,246,0.28)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function GradientWord({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#3b82f6] via-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">
      {children}
    </span>
  );
}
