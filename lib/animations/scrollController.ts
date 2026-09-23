import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { CHAPTERS, SCENE_TUNING } from '../../config/landingScene';
import type { ScrollState } from './scrollState';

export type ScrollControllerOptions = {
  wrapper: HTMLElement;
  scroll: { current: ScrollState };
  progressBar?: HTMLElement | null;
  reducedMotion: boolean;
  isRTL?: boolean;
  onProgress?: (progress: number, chapterIndex: number) => void;
  /** Metric counters: [{ el, value, decimals }] */
  metrics?: Array<{ el: HTMLElement; value: number; decimals: number }>;
};

/**
 * Wires Lenis + GSAP ScrollTrigger:
 * - global scrubbed progress → scroll.current.progress
 * - per-panel typography enter/exit scrubbed to scroll
 * - optional metric counters
 */
export function createScrollController(opts: ScrollControllerOptions) {
  const {
    wrapper,
    scroll,
    progressBar,
    reducedMotion,
    onProgress,
    metrics = [],
  } = opts;

  gsap.registerPlugin(ScrollTrigger);

  let lenis: Lenis | null = null;
  let rafId = 0;
  let tickerCb: ((time: number) => void) | null = null;

  const enableLenis =
    SCENE_TUNING.scroll.lenisEnabled && !reducedMotion;

  if (enableLenis) {
    lenis = new Lenis({
      duration: SCENE_TUNING.scroll.lenisDuration,
      smoothWheel: true,
      touchMultiplier: 1.1,
      // Keep native keyboard / accessibility paths intact.
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    tickerCb = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);
  }

  const ctx = gsap.context(() => {
    const proxy = { p: 0 };

    gsap.to(proxy, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: reducedMotion ? SCENE_TUNING.scroll.scrubReduced : SCENE_TUNING.scroll.scrub,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressBar) {
            progressBar.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
      onUpdate: () => {
        const p = proxy.p;
        scroll.current.progress = p;
        const n = CHAPTERS.length;
        const idx = Math.min(n - 1, Math.floor(p * (n - 0.0001)));
        scroll.current.chapterIndex = idx;
        scroll.current.sectionId = CHAPTERS[idx]?.id || 'hero';
        onProgress?.(p, idx);
      },
    });

    const panels = gsap.utils.toArray<HTMLElement>('[data-ih-panel]');
    panels.forEach((panel, index) => {
      const lines = panel.querySelectorAll<HTMLElement>('[data-ih-line]');
      if (!lines.length) return;

      const stay =
        panel.hasAttribute('data-ih-stay') || index === panels.length - 1;
      const scrub = reducedMotion ? true : SCENE_TUNING.scroll.typographyScrub;

      gsap.fromTo(
        lines,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            end: 'top 55%',
            scrub,
            immediateRender: false,
          },
        },
      );

      if (stay) return;

      gsap.to(lines, {
        opacity: 0,
        y: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          start: 'bottom 28%',
          end: 'bottom top',
          scrub,
          immediateRender: false,
        },
      });
    });

    metrics.forEach((metric, i) => {
      const counter = { v: 0 };
      gsap.to(counter, {
        v: metric.value,
        duration: 1.8,
        delay: i * 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: metric.el,
          start: 'top 82%',
          once: true,
        },
        onUpdate: () => {
          metric.el.textContent = counter.v.toFixed(metric.decimals);
        },
      });
    });
  }, wrapper);

  ScrollTrigger.refresh();

  return {
    lenis,
    refresh: () => ScrollTrigger.refresh(),
    destroy: () => {
      ctx.revert();
      if (tickerCb) gsap.ticker.remove(tickerCb);
      lenis?.destroy();
      lenis = null;
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}
