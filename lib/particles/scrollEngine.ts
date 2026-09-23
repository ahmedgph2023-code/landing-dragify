import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { NL3_TUNING } from '../../config/newLanding3Scene';
import type { ProgressBus } from './types';

/**
 * Pins the stage for scrollVh worth of scroll distance.
 * Uses ScrollTrigger pin (not CSS sticky) so Framer/overflow ancestors can't break it.
 *
 * DOM:
 *   <div ref={story}>           <!-- tall spacer height -->
 *     <div ref={stage}>...</div> <!-- gets pinned -->
 *   </div>
 */
export function createPinnedScrollEngine(opts: {
  story: HTMLElement;
  stage: HTMLElement;
  bus: ProgressBus;
  reducedMotion: boolean;
  onProgress?: (p: number) => void;
}) {
  gsap.registerPlugin(ScrollTrigger);

  let lenis: Lenis | null = null;
  let tickerCb: ((time: number) => void) | null = null;

  // Ensure we start at the top so hero isn't mid-scrolled on load
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }

  if (NL3_TUNING.lenisEnabled && !opts.reducedMotion) {
    lenis = new Lenis({
      duration: NL3_TUNING.lenisDuration,
      smoothWheel: true,
      touchMultiplier: 1.05,
      syncTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    tickerCb = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);
    // Reset Lenis scroll too
    lenis.scrollTo(0, { immediate: true });
  }

  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: opts.story,
      start: 'top top',
      end: 'bottom bottom',
      pin: opts.stage,
      pinSpacing: false,
      scrub: opts.reducedMotion ? NL3_TUNING.scrubReduced : NL3_TUNING.scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        opts.bus.progress = self.progress;
        opts.onProgress?.(self.progress);
      },
      onRefresh: (self) => {
        opts.bus.progress = self.progress;
        opts.onProgress?.(self.progress);
      },
    });
  }, opts.story);

  // Double refresh after layout paints (fonts/canvas)
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  });
  window.setTimeout(() => ScrollTrigger.refresh(), 200);

  return {
    destroy: () => {
      ctx.revert();
      if (tickerCb) gsap.ticker.remove(tickerCb);
      lenis?.destroy();
    },
    refresh: () => ScrollTrigger.refresh(),
    /** Jump to normalized story progress 0–1 (dot nav). */
    scrollToProgress: (progress: number, immediate = false) => {
      const p = Math.min(1, Math.max(0, progress));
      const storyTop = opts.story.offsetTop;
      const storyH = opts.story.offsetHeight;
      const viewH = window.innerHeight;
      const maxScroll = Math.max(0, storyH - viewH);
      const y = storyTop + p * maxScroll;
      if (lenis) {
        lenis.scrollTo(y, { immediate, duration: immediate ? 0 : 1.1 });
      } else {
        window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
      }
    },
  };
}
