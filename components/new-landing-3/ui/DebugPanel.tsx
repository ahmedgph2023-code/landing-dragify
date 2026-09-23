import { useEffect, useRef, useState } from 'react';
import { sampleMorphProgress, type ParticleStateId } from '../../../config/newLanding3Scene';
import { NL3_SECTIONS } from '../../../lib/particles/sections/registry';

type Props = {
  progress: number;
  particleCount: number;
  enabled: boolean;
  debugForceState: ParticleStateId | null;
  onForceState: (s: ParticleStateId | null) => void;
};

/**
 * Dev-only debug HUD. Toggle with `D`.
 */
export function DebugPanel({
  progress,
  particleCount,
  enabled,
  debugForceState,
  onForceState,
}: Props) {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const last = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const loop = (t: number) => {
      frames.current += 1;
      if (t - last.current >= 500) {
        setFps(Math.round((frames.current * 1000) / (t - last.current)));
        frames.current = 0;
        last.current = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;

  const morph = sampleMorphProgress(progress);
  const states: ParticleStateId[] = [
    ...NL3_SECTIONS.map((s) => s.id),
    'heroNode',
    'heroChain',
    'heroFlow',
    'dissolve',
    'transition',
  ];

  return (
    <aside className="nl3-debug" aria-hidden>
      <div className="nl3-debug-title">NL3 Particle Debug</div>
      <div>progress: {progress.toFixed(3)}</div>
      <div>state: {debugForceState ? `FORCE ${debugForceState}` : morph.label}</div>
      <div>kind: {morph.kind}</div>
      <div>localT: {morph.localT.toFixed(3)}</div>
      <div>particles: {particleCount.toLocaleString()}</div>
      <div>fps: {fps}</div>
      <div className="nl3-debug-section">Force target</div>
      <div className="nl3-debug-btns">
        <button type="button" className={!debugForceState ? 'is-on' : ''} onClick={() => onForceState(null)}>
          live
        </button>
        {states.map((s) => (
          <button
            key={s}
            type="button"
            className={debugForceState === s ? 'is-on' : ''}
            onClick={() => onForceState(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="nl3-debug-hint">Press D to hide</div>
    </aside>
  );
}
