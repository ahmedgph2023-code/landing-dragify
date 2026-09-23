import { createGlobalStyle } from 'styled-components';

/**
 * Landing-3 tokens — Dragify brand colors from styles/theme.ts
 * (blue #2563eb / #3b82f6 + violet #7c3aed / #8b5cf6)
 */
export const L3ThemeStyle = createGlobalStyle`
  [data-l3-theme] {
    --l3-font: 'Outfit', 'Cairo', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
    --l3-ease: cubic-bezier(0.16, 1, 0.3, 1);
    --l3-max: 1200px;
    --l3-radius: 16px;
    font-family: var(--l3-font);
    transition: background-color 0.4s ease, color 0.4s ease;
    -webkit-font-smoothing: antialiased;
  }

  html[lang='ar'] [data-l3-theme],
  html[dir='rtl'] [data-l3-theme] {
    --l3-font: 'Cairo', 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
    letter-spacing: 0;
  }

  [data-l3-theme='light'] {
    --l3-bg: #ffffff;
    --l3-bg-deep: #f8f9fa;
    --l3-elevated: #ffffff;
    --l3-ink: #1e293b;
    --l3-ink-soft: #334155;
    --l3-muted: #64748b;
    --l3-faint: #94a3b8;
    --l3-line: #e2e8f0;
    --l3-line-strong: #cbd5e1;
    --l3-surface: #f1f5f9;
    --l3-blue: #2563eb;
    --l3-violet: #7c3aed;
    --l3-cobalt: #2563eb;
    --l3-teal: #0d9488;
    --l3-glow: rgba(37, 99, 235, 0.18);
    --l3-glow-violet: rgba(124, 58, 237, 0.14);
    --l3-mesh-a: rgba(37, 99, 235, 0.12);
    --l3-mesh-b: rgba(124, 58, 237, 0.1);
    --l3-scrim: rgba(255, 255, 255, 0.88);
    --l3-shadow: 0 16px 40px -20px rgba(30, 41, 59, 0.22);
    --l3-grad-text: linear-gradient(100deg, #2563eb 15%, #7c3aed 85%);
    --l3-grad-btn: linear-gradient(100deg, #2563eb 0%, #7c3aed 100%);
    --l3-grad-soft: linear-gradient(115deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.12) 100%);
    --l3-canvas: #f8fafc;
    --l3-node: #ffffff;
  }

  [data-l3-theme='dark'] {
    --l3-bg: #111827;
    --l3-bg-deep: #0b1220;
    --l3-elevated: #1f2937;
    --l3-ink: #f9fafb;
    --l3-ink-soft: #e5e7eb;
    --l3-muted: #9ca3af;
    --l3-faint: #6b7280;
    --l3-line: #374151;
    --l3-line-strong: #4b5563;
    --l3-surface: rgba(255, 255, 255, 0.04);
    --l3-blue: #3b82f6;
    --l3-violet: #8b5cf6;
    --l3-cobalt: #3b82f6;
    --l3-teal: #2dd4bf;
    --l3-glow: rgba(59, 130, 246, 0.25);
    --l3-glow-violet: rgba(139, 92, 246, 0.2);
    --l3-mesh-a: rgba(59, 130, 246, 0.18);
    --l3-mesh-b: rgba(139, 92, 246, 0.14);
    --l3-scrim: rgba(17, 24, 39, 0.86);
    --l3-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.55);
    --l3-grad-text: linear-gradient(100deg, #3b82f6 15%, #8b5cf6 85%);
    --l3-grad-btn: linear-gradient(100deg, #3b82f6 0%, #8b5cf6 100%);
    --l3-grad-soft: linear-gradient(115deg, rgba(59,130,246,0.22) 0%, rgba(139,92,246,0.2) 100%);
    --l3-canvas: #0f172a;
    --l3-node: #1f2937;
  }

  [data-l3-theme] * { box-sizing: border-box; }
  [data-l3-theme] ::selection {
    background: var(--l3-blue);
    color: #fff;
  }
`;
