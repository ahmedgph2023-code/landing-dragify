import { createGlobalStyle } from 'styled-components';

// Premium design tokens for /landing — Dragify brand blue + violet.
// Scoped under [data-nl-theme]. Components read colors via var(--nl-*).
export const NLThemeStyle = createGlobalStyle`
  [data-nl-theme] {
    --nl-font: 'Outfit', 'Cairo', ui-sans-serif, system-ui, sans-serif;
    --nl-shadow-sm: 0 1px 2px rgba(16,24,40,0.04);
    --nl-shadow-md: 0 12px 28px -10px rgba(16,24,40,0.12);
    --nl-shadow-lg: 0 30px 60px -16px rgba(16,24,40,0.18);
    --nl-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --nl-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
    --nl-radius: 16px;
    --nl-radius-sm: 10px;
    --nl-max-width: 1280px;
    font-family: var(--nl-font);
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.45s ease, color 0.45s ease;
  }

  html[lang='ar'] [data-nl-theme],
  html[dir='rtl'] [data-nl-theme] {
    --nl-font: 'Cairo', 'Outfit', ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0;
  }

  [data-nl-theme="light"] {
    --nl-bg: #fbfbfe;
    --nl-bg-elevated: #ffffff;
    --nl-surface: rgba(10,14,30,0.028);
    --nl-surface-strong: rgba(10,14,30,0.055);
    --nl-border: rgba(10,14,30,0.09);
    --nl-border-strong: rgba(10,14,30,0.18);
    --nl-text: #0b0d16;
    --nl-text-dim: #545c74;
    --nl-text-faint: #868fa6;
    --nl-blue: #2563eb;
    --nl-violet: #7c3aed;
    --nl-pink: #d1259e;
    --nl-cyan: #0891b2;
    --nl-green: #049669;
    --nl-red: #dc2626;
    --nl-orange: #2563eb;
    --nl-gradient-text: linear-gradient(100deg, #1d4fe0 0%, #6f37d6 50%, #c221a0 100%);
    --nl-gradient-brand: linear-gradient(115deg, #2563eb 0%, #7c3aed 55%, #e8399e 100%);
    --nl-gradient-soft: linear-gradient(115deg, rgba(37,99,235,0.14) 0%, rgba(124,58,237,0.14) 55%, rgba(232,57,158,0.12) 100%);
    --nl-glass-blur: 20px;
    --nl-shadow-sm: 0 1px 2px rgba(16,24,40,0.05);
    --nl-shadow-md: 0 16px 32px -12px rgba(16,24,40,0.12);
    --nl-shadow-lg: 0 34px 64px -18px rgba(16,24,40,0.16);
    --nl-scrim: rgba(251,251,254,1);
    --nl-scrim-0: rgba(251,251,254,0);
    --nl-bg-translucent: rgba(251,251,254,0.78);
    --nl-grid-line: rgba(10,14,30,0.06);
    --nl-hero-glow-opacity: 0.22;
    --nl-logo-filter: grayscale(1) brightness(0) opacity(0.38);
    --nl-logo-filter-hover: grayscale(1) brightness(0) opacity(0.75);
    --nl-card-inset: 0 0 0 1px rgba(10,14,30,0.06) inset, 0 1px 0 0 rgba(37,99,235,0.18) inset;
  }

  [data-nl-theme="dark"] {
    --nl-bg: #0b1220;
    --nl-bg-elevated: #111827;
    --nl-surface: rgba(255,255,255,0.045);
    --nl-surface-strong: rgba(255,255,255,0.075);
    --nl-border: rgba(255,255,255,0.09);
    --nl-border-strong: rgba(255,255,255,0.18);
    --nl-text: #f4f6fb;
    --nl-text-dim: #a3abc2;
    --nl-text-faint: #666f8a;
    --nl-blue: #3b82f6;
    --nl-violet: #8b5cf6;
    --nl-pink: #f472b6;
    --nl-cyan: #22d3ee;
    --nl-green: #34d399;
    --nl-red: #f87171;
    --nl-orange: #3b82f6;
    --nl-gradient-text: linear-gradient(100deg, #eef2ff 0%, #93c5fd 40%, #c4b5fd 100%);
    --nl-gradient-brand: linear-gradient(115deg, #3b82f6 0%, #8b5cf6 55%, #f472b6 100%);
    --nl-gradient-soft: linear-gradient(115deg, rgba(59,130,246,0.32) 0%, rgba(139,92,246,0.32) 55%, rgba(244,114,182,0.28) 100%);
    --nl-glass-blur: 24px;
    --nl-shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
    --nl-shadow-md: 0 20px 50px -20px rgba(0,0,0,0.55);
    --nl-shadow-lg: 0 40px 90px -24px rgba(0,0,0,0.6);
    --nl-scrim: rgba(11,18,32,1);
    --nl-scrim-0: rgba(11,18,32,0);
    --nl-bg-translucent: rgba(11,18,32,0.72);
    --nl-grid-line: rgba(255,255,255,0.05);
    --nl-hero-glow-opacity: 0.35;
    --nl-logo-filter: grayscale(1) brightness(0) invert(1) opacity(0.45);
    --nl-logo-filter-hover: grayscale(1) brightness(0) invert(1) opacity(0.85);
    --nl-card-inset: 0 0 0 1px rgba(255,255,255,0.1) inset, 0 1px 0 0 rgba(59,130,246,0.28) inset;
  }

  [data-nl-theme] ::selection {
    background: var(--nl-blue);
    color: #fff;
  }
`;
