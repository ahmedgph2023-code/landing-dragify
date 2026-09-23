import { SO7BA_STORY, sectionAtProgress } from '../../../lib/so7ba-story';

/** Right-edge hollow/glow dots — VV-style section nav */
export function ProgressIndicator({
  progress,
  onJump,
}: {
  progress: number;
  onJump?: (sectionIndex: number) => void;
}) {
  const activeId = sectionAtProgress(progress).id;
  const active = SO7BA_STORY.sections.findIndex((s) => s.id === activeId);

  return (
    <nav className="nl3-ticks" aria-label="Section progress">
      {SO7BA_STORY.sections.map((s, i) => (
        <button
          key={s.id}
          type="button"
          className={`nl3-tick ${i === active ? 'is-on' : ''} ${i < active ? 'is-seen' : ''}`}
          title={s.label}
          aria-label={`Go to ${s.label}`}
          aria-current={i === active ? 'true' : undefined}
          onClick={() => onJump?.(i)}
        />
      ))}
    </nav>
  );
}
