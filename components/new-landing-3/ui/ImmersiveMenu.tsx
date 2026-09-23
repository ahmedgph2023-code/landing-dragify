import { useEffect, useState } from 'react';
import { NL3_SECTIONS, type Nl3SectionId } from '../../../lib/particles/sections/registry';

type MenuItem = {
  labelKey: string;
  fallback: string;
  kicker: string;
  sectionId: Nl3SectionId;
};

const MENU_ITEMS: MenuItem[] = [
  { labelKey: 'header.home', fallback: 'Home', kicker: 'THE CORE', sectionId: 'hero' },
  { labelKey: 'header.features', fallback: 'Features', kicker: 'THE PLATFORM', sectionId: 'features' },
  { labelKey: 'agents.title', fallback: 'Agents', kicker: 'THE CREW', sectionId: 'agents' },
  { labelKey: 'integrations.title', fallback: 'Integrations', kicker: 'THE STACK', sectionId: 'integrations' },
  { labelKey: 'header.pricing', fallback: 'How it works', kicker: 'THE PATH', sectionId: 'how' },
];

function progressForSection(id: Nl3SectionId): number {
  const s = NL3_SECTIONS.find((x) => x.id === id);
  if (!s) return 0;
  const [a, b] = s.range;
  return a + (b - a) * 0.48;
}

function scrollToProgress(progress: number) {
  const story = document.querySelector('.nl3-story') as HTMLElement | null;
  if (!story) return;
  const rect = story.getBoundingClientRect();
  const top = window.scrollY + rect.top;
  const max = Math.max(1, story.offsetHeight - window.innerHeight);
  window.scrollTo({ top: top + progress * max, behavior: 'smooth' });
}

export function ImmersiveMenu({
  open,
  onClose,
  t,
  onJumpToSection,
}: {
  open: boolean;
  onClose: () => void;
  t: (key: string) => any;
  onJumpToSection?: (sectionId: Nl3SectionId) => void;
}) {
  const [hovered, setHovered] = useState<number>(1);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const go = (item: MenuItem) => {
    onClose();
    window.setTimeout(() => {
      if (onJumpToSection) onJumpToSection(item.sectionId);
      else scrollToProgress(progressForSection(item.sectionId));
    }, 80);
  };

  return (
    <div className="nl3-imenu" role="dialog" aria-modal="true" aria-label="Navigation">
      <div className="nl3-imenu-stars" aria-hidden />
      <div className="nl3-imenu-vignette" aria-hidden />

      <div className="nl3-imenu-top">
        <span className="nl3-imenu-mark" aria-hidden>
          <i />
          <i />
        </span>
        <button type="button" className="nl3-imenu-close" aria-label="Close menu" onClick={onClose}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M7 7l14 14M21 7L7 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="nl3-imenu-nav">
        {MENU_ITEMS.map((item, i) => {
          const active = hovered === i;
          const label =
            item.sectionId === 'agents'
              ? 'Agents'
              : item.sectionId === 'integrations'
                ? 'Integrations'
                : item.sectionId === 'how'
                  ? String(t('howItWorks.sectionLabel') || 'How it works').replace(/\?$/, '')
                  : String(t(item.labelKey) || item.fallback);
          return (
            <button
              key={item.sectionId}
              type="button"
              className={`nl3-imenu-item ${active ? 'is-on' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onClick={() => go(item)}
              style={{ animationDelay: `${0.05 + i * 0.06}s` }}
            >
              <span className="nl3-imenu-label">{label}</span>
              <span className="nl3-imenu-kicker">{item.kicker}</span>
            </button>
          );
        })}
      </nav>

      <div className="nl3-imenu-foot">
        <a href="https://console.dragify.ai/" target="_blank" rel="noreferrer" onClick={onClose}>
          {t('hero.getStarted')}
        </a>
        <span aria-hidden>·</span>
        <a href="https://calendly.com/cloudilic" target="_blank" rel="noreferrer" onClick={onClose}>
          {t('hero.requestDemo')}
        </a>
      </div>

      <style jsx>{`
        .nl3-imenu {
          position: fixed;
          inset: 0;
          z-index: 240;
          background: #02040a;
          color: #f4f7ff;
          display: grid;
          place-items: center;
          overflow: hidden;
          animation: nl3ImenuIn 0.45s ease both;
        }
        .nl3-imenu-stars {
          position: absolute;
          inset: -10%;
          background-image:
            radial-gradient(1.5px 1.5px at 12% 18%, rgba(255, 255, 255, 0.75), transparent),
            radial-gradient(1.2px 1.2px at 28% 62%, rgba(94, 220, 255, 0.7), transparent),
            radial-gradient(1px 1px at 44% 28%, rgba(255, 180, 140, 0.55), transparent),
            radial-gradient(1.4px 1.4px at 61% 74%, rgba(255, 255, 255, 0.55), transparent),
            radial-gradient(1px 1px at 78% 22%, rgba(120, 200, 255, 0.65), transparent),
            radial-gradient(1.3px 1.3px at 88% 58%, rgba(255, 255, 255, 0.45), transparent),
            radial-gradient(1px 1px at 18% 84%, rgba(255, 160, 120, 0.4), transparent),
            radial-gradient(1.2px 1.2px at 52% 12%, rgba(180, 230, 255, 0.55), transparent),
            radial-gradient(1px 1px at 70% 40%, rgba(255, 255, 255, 0.35), transparent),
            radial-gradient(1.5px 1.5px at 35% 48%, rgba(94, 220, 255, 0.5), transparent);
          background-size: 100% 100%;
          opacity: 0.9;
          animation: nl3StarsDrift 28s linear infinite;
          pointer-events: none;
        }
        .nl3-imenu-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 45%, rgba(8, 30, 50, 0.35) 0%, transparent 55%),
            radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.72) 100%);
          pointer-events: none;
        }
        .nl3-imenu-top {
          position: absolute;
          inset: 0 0 auto 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.35rem 1.5rem;
          z-index: 2;
        }
        .nl3-imenu-mark {
          display: grid;
          gap: 6px;
          padding-top: 0.35rem;
        }
        .nl3-imenu-mark i {
          display: block;
          width: 26px;
          height: 1.5px;
          background: #2EE6C5;
          box-shadow: 0 0 10px rgba(46, 230, 197, 0.85);
        }
        .nl3-imenu-close {
          width: 44px;
          height: 44px;
          border: 0;
          background: transparent;
          color: #2EE6C5;
          cursor: pointer;
          display: grid;
          place-items: center;
          filter: drop-shadow(0 0 10px rgba(46, 230, 197, 0.75));
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .nl3-imenu-close:hover {
          transform: rotate(90deg);
          filter: drop-shadow(0 0 16px rgba(46, 230, 197, 1));
        }
        .nl3-imenu-nav {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1.1rem, 3.2vh, 1.85rem);
          padding: 4rem 1.5rem;
          text-align: center;
        }
        .nl3-imenu-item {
          appearance: none;
          background: none;
          border: 0;
          padding: 0.15rem 0.75rem;
          cursor: pointer;
          color: rgba(244, 247, 255, 0.92);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.28rem;
          opacity: 0;
          transform: translateY(18px);
          animation: nl3ItemIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transition: color 0.25s ease, text-shadow 0.25s ease, transform 0.25s ease;
        }
        .nl3-imenu-label {
          font-family: 'Sora', 'Plus Jakarta Sans', 'Cairo', ui-sans-serif, system-ui, sans-serif;
          font-size: clamp(1.85rem, 4.6vw, 3.1rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.05;
        }
        .nl3-imenu-kicker {
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(180, 210, 230, 0.55);
          font-weight: 500;
        }
        .nl3-imenu-item.is-on,
        .nl3-imenu-item:hover {
          color: #2EE6C5;
          transform: translateY(0) scale(1.03);
          text-shadow:
            0 0 12px rgba(46, 230, 197, 0.95),
            0 0 28px rgba(46, 230, 197, 0.65),
            0 0 54px rgba(60, 190, 255, 0.45);
        }
        .nl3-imenu-item.is-on .nl3-imenu-kicker,
        .nl3-imenu-item:hover .nl3-imenu-kicker {
          color: rgba(126, 246, 255, 0.75);
        }
        .nl3-imenu-foot {
          position: absolute;
          bottom: 1.4rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          gap: 0.75rem;
          align-items: center;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(180, 200, 220, 0.55);
        }
        .nl3-imenu-foot a {
          color: rgba(200, 230, 255, 0.8);
          text-decoration: none;
        }
        .nl3-imenu-foot a:hover {
          color: #2EE6C5;
          text-shadow: 0 0 12px rgba(46, 230, 197, 0.7);
        }
        @keyframes nl3ImenuIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes nl3ItemIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes nl3StarsDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-1.5%, 1.2%, 0);
          }
        }
        :global(html[dir='rtl']) .nl3-imenu-label {
          font-family: 'Cairo', 'Outfit', ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}
