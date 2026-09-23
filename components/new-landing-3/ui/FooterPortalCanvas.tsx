/**
 * Footer particle portal — dense "D" core · orbital rings · cyan/violet river.
 * Self-contained 2D canvas (footer sits outside the scroll morph scene).
 */

import { useEffect, useRef } from 'react';

type P = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  hue: number;
  kind: 'd' | 'ring' | 'wave' | 'dust';
  phase: number;
};

function hash(i: number, s: number) {
  const n = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function buildDSlots(cx: number, cy: number, s: number, n: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  // Vertical stem
  const stem = Math.floor(n * 0.28);
  for (let i = 0; i < stem; i++) {
    const t = i / Math.max(1, stem - 1);
    const j = (hash(i, 1) - 0.5) * 0.11 * s;
    out.push([cx - 0.28 * s + j, cy + (t - 0.5) * 0.92 * s]);
  }
  // Outer arc (right bowl)
  const arc = Math.floor(n * 0.42);
  for (let i = 0; i < arc; i++) {
    const t = i / Math.max(1, arc - 1);
    const a = -Math.PI / 2 + Math.PI * t;
    const rr = (0.34 + hash(i, 2) * 0.06) * s;
    const thick = (hash(i, 3) - 0.5) * 0.07 * s;
    out.push([cx - 0.08 * s + Math.cos(a) * (rr + thick), cy + Math.sin(a) * (rr * 1.15 + thick * 0.4)]);
  }
  // Inner fill
  const fill = n - stem - arc;
  for (let i = 0; i < fill; i++) {
    const t = hash(i, 4);
    const u = hash(i, 5);
    const a = -Math.PI / 2 + Math.PI * t;
    const rr = (0.08 + u * 0.28) * s;
    out.push([cx - 0.12 * s + Math.cos(a) * rr * 0.85, cy + Math.sin(a) * rr * 1.05]);
  }
  return out;
}

function buildParticles(w: number, h: number, reduced: boolean): P[] {
  const cx = w * 0.38;
  const cy = h * 0.46;
  const s = Math.min(w, h) * 0.28;
  const budget = reduced ? 900 : 2400;
  const nD = Math.floor(budget * 0.38);
  const nRing = Math.floor(budget * 0.22);
  const nWave = Math.floor(budget * 0.28);
  const nDust = budget - nD - nRing - nWave;
  const list: P[] = [];

  const dSlots = buildDSlots(cx, cy, s, nD);
  for (let i = 0; i < nD; i++) {
    const [x, y] = dSlots[i % dSlots.length];
    list.push({
      x,
      y,
      ox: x,
      oy: y,
      vx: 0,
      vy: 0,
      r: 0.7 + hash(i, 6) * 1.6,
      a: 0.45 + hash(i, 7) * 0.55,
      hue: 168 + hash(i, 8) * 40,
      kind: 'd',
      phase: hash(i, 9) * Math.PI * 2,
    });
  }

  const rings = [
    { rx: s * 1.55, ry: s * 1.35, tilt: 0.22 },
    { rx: s * 1.95, ry: s * 1.55, tilt: -0.35 },
    { rx: s * 2.35, ry: s * 1.75, tilt: 0.48 },
  ];
  for (let i = 0; i < nRing; i++) {
    const ring = rings[i % rings.length];
    const a0 = (i / nRing) * Math.PI * 2 + hash(i, 10);
    const x0 = Math.cos(a0) * ring.rx;
    const y0 = Math.sin(a0) * ring.ry;
    const y = y0 * Math.cos(ring.tilt);
    list.push({
      x: cx + x0,
      y: cy + y,
      ox: cx + x0,
      oy: cy + y,
      vx: 0,
      vy: 0,
      r: 0.5 + hash(i, 11) * 1.2,
      a: 0.35 + hash(i, 12) * 0.45,
      hue: hash(i, 13) > 0.55 ? 265 : 175,
      kind: 'ring',
      phase: a0,
    });
  }

  for (let i = 0; i < nWave; i++) {
    const t = i / nWave;
    const x = w * (-0.05 + t * 1.15);
    const baseY = h * 0.62 + Math.sin(t * Math.PI * 2.2) * h * 0.08;
    const spread = (hash(i, 14) - 0.5) * h * 0.22;
    list.push({
      x,
      y: baseY + spread,
      ox: x,
      oy: baseY + spread,
      vx: 0.15 + hash(i, 15) * 0.45,
      vy: (hash(i, 16) - 0.5) * 0.12,
      r: 0.6 + hash(i, 17) * 2.2,
      a: 0.18 + hash(i, 18) * 0.4,
      hue: hash(i, 19) > 0.45 ? 270 : 180,
      kind: 'wave',
      phase: hash(i, 20) * Math.PI * 2,
    });
  }

  for (let i = 0; i < nDust; i++) {
    list.push({
      x: hash(i, 21) * w,
      y: hash(i, 22) * h,
      ox: hash(i, 21) * w,
      oy: hash(i, 22) * h,
      vx: (hash(i, 23) - 0.5) * 0.2,
      vy: (hash(i, 24) - 0.5) * 0.15,
      r: 0.4 + hash(i, 25) * 1.1,
      a: 0.08 + hash(i, 26) * 0.22,
      hue: 190 + hash(i, 27) * 80,
      kind: 'dust',
      phase: hash(i, 28) * Math.PI * 2,
    });
  }

  return list;
}

export default function FooterPortalCanvas({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let particles: P[] = [];
    let w = 0;
    let h = 0;
    let t0 = performance.now();
    let running = true;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = buildParticles(w, h, reducedMotion);
    };

    const draw = (now: number) => {
      if (!running) return;
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      // Soft portal glow
      const cx = w * 0.38;
      const cy = h * 0.46;
      const g = ctx.createRadialGradient(cx, cy, 8, cx, cy, Math.min(w, h) * 0.42);
      g.addColorStop(0, 'rgba(46, 230, 197, 0.22)');
      g.addColorStop(0.35, 'rgba(90, 120, 255, 0.1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        if (p.kind === 'd') {
          const jx = Math.sin(t * 1.4 + p.phase) * 1.2;
          const jy = Math.cos(t * 1.1 + p.phase) * 1.1;
          p.x = p.ox + jx;
          p.y = p.oy + jy;
        } else if (p.kind === 'ring') {
          const spin = reducedMotion ? 0 : t * 0.35;
          const dx = p.ox - cx;
          const dy = p.oy - cy;
          const ringScale = 1 + Math.sin(t * 0.6 + p.phase) * 0.012;
          const rr = Math.hypot(dx, dy) * ringScale;
          const ang = Math.atan2(dy, dx) + spin * 0.15;
          p.x = cx + Math.cos(ang) * rr;
          p.y = cy + Math.sin(ang) * rr * 0.88;
        } else if (p.kind === 'wave') {
          p.x += p.vx * (reducedMotion ? 0.15 : 1);
          p.y = p.oy + Math.sin(t * 1.2 + p.phase + p.ox * 0.008) * 10;
          if (p.x > w + 40) p.x = -40;
        } else {
          p.x += p.vx * (reducedMotion ? 0.2 : 1);
          p.y += p.vy * (reducedMotion ? 0.2 : 1);
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }

        const pulse = 0.75 + Math.sin(t * 2 + p.phase) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, ${p.kind === 'd' ? 72 : 65}%, ${p.a * pulse})`;
        ctx.arc(p.x, p.y, p.r * (p.kind === 'd' ? 1.05 : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reducedMotion]);

  return <canvas ref={ref} className="nl3f-portal-canvas" aria-hidden />;
}
