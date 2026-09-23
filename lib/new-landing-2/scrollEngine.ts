import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { NL2_TUNING } from '../../config/newLanding2Scene';

export type ProgressBus = {
  /** Scrubbed 0..1 across the pinned story */
  progress: number;
};

/**
 * Maps a tall sticky story container to progress 0..1.
 *
 * DOM shape:
 *   <div ref={story}>   <!-- height: N * 100vh -->
 *     <div class="sticky stage">...</div>
 *   </div>
 *
 * Scroll through the story → progress advances → reverses on scroll up.
 */
export function createPinnedScrollEngine(opts: {
  story: HTMLElement;
  bus: ProgressBus;
  reducedMotion: boolean;
  onProgress?: (p: number) => void;
}) {
  gsap.registerPlugin(ScrollTrigger);

  let lenis: Lenis | null = null;
  let tickerCb: ((time: number) => void) | null = null;

  if (NL2_TUNING.lenisEnabled && !opts.reducedMotion) {
    lenis = new Lenis({
      duration: NL2_TUNING.lenisDuration,
      smoothWheel: true,
      touchMultiplier: 1.05,
      syncTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    tickerCb = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);
  }

  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: opts.story,
      start: 'top top',
      end: 'bottom bottom',
      scrub: opts.reducedMotion ? NL2_TUNING.scrubReduced : NL2_TUNING.scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        opts.bus.progress = self.progress;
        opts.onProgress?.(self.progress);
      },
    });
  }, opts.story);

  ScrollTrigger.refresh();

  return {
    destroy: () => {
      ctx.revert();
      if (tickerCb) gsap.ticker.remove(tickerCb);
      lenis?.destroy();
    },
    refresh: () => ScrollTrigger.refresh(),
  };
}
