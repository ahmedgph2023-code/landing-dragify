import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { sampleHeroExit, sampleIntroStages, sampleSectionStages, CHOREO } from '../../../lib/particles/choreography';
import {
  AGENT_PORTRAITS,
  FEATURE_ICONS,
  INTEGRATION_LOGOS,
} from '../../../lib/particles/sections/homeAssets';
import { SO7BA_STORY } from '../../../lib/so7ba-story';
import type { So7baCopySide } from '../../../lib/so7ba-story';

type CopyFn = (key: string) => any;

/** Inline icons for agent category pills (ref order). */
const AGENT_CAT_ICONS = [
  // Marketing — bars
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12V8M7 12V4M11 12V6M14 12H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  // Support — headset
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8a4.5 4.5 0 0 1 9 0M3.5 8v2.2a1.3 1.3 0 0 0 1.3 1.3H5.5M12.5 8v2.2a1.3 1.3 0 0 1-1.3 1.3H10.5M8 12.5v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  // Sales — dollar
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.5v11M10.5 5.2c0-1.1-1.1-2-2.5-2s-2.5.9-2.5 2 1 1.6 2.5 2 2.5.9 2.5 2-1.1 2-2.5 2-2.5-.9-2.5-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  // Ops — gear
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke="currentColor" stroke-width="1.4"/><path d="M8 2.2v1.4M8 12.4v1.4M2.2 8h1.4M12.4 8h1.4M3.9 3.9l1 1M11.1 11.1l1 1M3.9 12.1l1-1M11.1 4.9l1-1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  // HR — people
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5.5" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 13c.4-2.2 1.9-3.4 3.5-3.4S9.1 10.8 9.5 13M11 7.2a1.7 1.7 0 1 0 0-3.4M13.5 13c-.3-1.7-1.3-2.7-2.5-2.9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  // Finance — wallet
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 5.5h9.5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 12V5.5Z" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 5.5V4.2A1.5 1.5 0 0 1 4 2.7h7.2M11.5 9.2h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
];

/** Home-style title: highlights + live typewriter word. */
function formatHeroTitleHtml(raw: string, displayedText: string, typing = false) {
  const typed = displayedText || '\u00a0';
  let highlightIndex = 0;
  return String(raw || '')
    .replace(/\{displayedText\}/g, typed)
    .replace(/<highlight>([\s\S]*?)<\/highlight>/gi, (_, inner: string) => {
      highlightIndex += 1;
      // Ref: Team Member? = violet/blue; AI Agent + typewriter = cyan/teal
      const tone = highlightIndex === 1 ? 'violet' : 'cyan';
      const typingCls = typing && highlightIndex === 3 ? ' is-typing' : '';
      return `<span class="nl3-write-mark nl3-write-mark--${tone}${typingCls}">${inner}</span>`;
    });
}

/** Split hero title into reference lines: Your Next / Team Member? / An AI Agent That Acts */
function splitHeroTitleLines(html: string): [string, string, string] {
  const en = html.match(/^(Your\s+Next)\s+(<span[\s\S]*?<\/span>)\s+(An[\s\S]*)$/i);
  if (en) {
    return [en[1].trim(), en[2].trim(), en[3].trim()];
  }
  // Fallback: first highlight on its own line, rest on third
  const firstClose = html.indexOf('</span>');
  if (firstClose > 0) {
    const before = html.slice(0, firstClose + '</span>'.length).trim();
    const after = html.slice(firstClose + '</span>'.length).trim();
    const lead = before.replace(/<span[\s\S]*$/, '').trim();
    const mid = before.slice(lead.length).trim() || before;
    if (lead && after) return [lead, mid, after];
    if (after) return [before, after, ''];
  }
  return [html, '', ''];
}

/** Staggered progress — always finishes at stage=1 (no stuck blur). */
function stagger(stage: number, index: number, step = 0.1) {
  if (stage >= 0.999) return 1;
  // Cap start so the last items still have room to land before 1
  const start = Math.min(0.45, Math.max(0, index * step));
  const span = Math.max(0.35, 1 - start);
  return Math.max(0, Math.min(1, (stage - start) / span));
}

/** Throw arc with overshoot — settles fully by end of stage. */
function slamEase(t: number) {
  const x = Math.max(0, Math.min(1, t));
  const c1 = 1.7;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/** Throw-in — action on enter, then hard settle (no leftover blur/glow). */
function throwIn(stage: number, fromX: number, distance = 130) {
  // Fully landed — never leave mid-throw when the section hold starts
  if (stage >= 0.98) {
    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
      filter: 'none',
    };
  }
  const gated = Math.max(0, Math.min(1, (stage - 0.02) / 0.96));
  const p = Math.min(1, slamEase(gated));
  const air = 1 - gated;
  const lift = air * air;
  const spin = air * fromX * 18;
  const y = air * 96 + lift * -40;
  const scale = 0.68 + p * 0.32;
  return {
    opacity: Math.min(1, gated * 1.15),
    transform: `translate3d(${fromX * air * distance}px, ${y}px, 0) scale(${scale}) rotate(${spin}deg)`,
    // Soft motion blur only early — never leave a rounded glow blob on the glyphs
    filter: gated < 0.55 ? `blur(${air * 4}px)` : 'none',
  };
}

/**
 * Classic home `/` content + images.
 * Copy side alternates per section (left ↔ right) with particles opposite.
 */
export function TextStates({
  progress,
  intro,
  mouse,
  t,
  isMobile,
  reducedMotion,
}: {
  progress: number;
  intro: number;
  mouse: { x: number; y: number };
  t: CopyFn;
  isMobile: boolean;
  reducedMotion: boolean;
}) {
  const heroExit = sampleHeroExit(progress);
  const introStages = sampleIntroStages(reducedMotion ? 1 : intro);
  const parallaxX = reducedMotion || isMobile ? 0 : mouse.x * CHOREO.mouse.textParallax;
  const parallaxY = reducedMotion || isMobile ? 0 : -mouse.y * CHOREO.mouse.textParallax * 0.55;
  const exitTitle = Math.min(1, heroExit * 1.05);
  const exitSub = Math.min(1, Math.max(0, (heroExit - 0.12) / 0.88));
  const exitCta = Math.min(1, Math.max(0, (heroExit - 0.22) / 0.78));
  const heroVisible = introStages.title > 0.02 && exitTitle < 0.98;

  const writerTexts: string[] = (t('hero.writerTexts') as string[]) || ['Acts', 'Thinks', 'Leaps'];
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCharIndex(0);
    setTextIndex(0);
  }, [writerTexts.join('|')]);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(writerTexts[0] || 'Acts');
      return;
    }
    if (!heroVisible) return;
    const currentText = writerTexts[textIndex] || '';
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText.charAt(charIndex));
        setCharIndex((c) => c + 1);
      }, 78);
      return () => clearTimeout(timeout);
    }
    const pause = setTimeout(() => {
      setDisplayedText('');
      setCharIndex(0);
      setTextIndex((i) => (i + 1) % writerTexts.length);
    }, 1700);
    return () => clearTimeout(pause);
  }, [charIndex, textIndex, writerTexts, reducedMotion, heroVisible]);

  const isTyping = !reducedMotion && heroVisible && charIndex < (writerTexts[textIndex] || '').length;
  const heroTitleHtml = useMemo(
    () => formatHeroTitleHtml(String(t('hero.title') || ''), displayedText, isTyping),
    [t, displayedText, isTyping],
  );
  const [heroLineA, heroLineB, heroLineC] = useMemo(() => splitHeroTitleLines(heroTitleHtml), [heroTitleHtml]);

  const featuresTitleHtml = String(t('features.title') || '')
    .replace(/<highlight>/gi, '<span class="nl3-how-mark">')
    .replace(/<\/highlight>/gi, '</span>');
  const statsTitleHtml = String(t('statistics.title') || '')
    .replace(/<highlight>/gi, '<span class="nl3-workflow-mark">')
    .replace(/<\/highlight>/gi, '</span>');

  const featureItems = (t('features.items') as Array<{ title: string; description: string }>) || [];
  const agentItems = (t('agents.items') as Array<{ title: string; description: string }>) || [];
  const integrationItems = (t('integrations.items') as Array<{ name: string; connected: boolean }>) || [];
  const howSteps = (t('howItWorks.steps') as Array<{ number: number; title: string; description: string }>) || [];
  const faqItems = ((t('faq.items') as Array<{ question: string; answer: string }>) || []).slice(0, 4);
  const statsItems =
    ((t('statistics.items') as Array<{ percentage: string; description: string }>) || []).slice(0, 3);

  const heroSide: So7baCopySide = 'left';
  const heroFrom = isMobile ? 0 : -1;
  const titleStage = introStages.title * (1 - exitTitle);
  const heroLineAIn = throwIn(stagger(titleStage, 0, 0.12), heroFrom, 150);
  const heroLineBIn = throwIn(stagger(titleStage, 1, 0.12), heroFrom, 160);
  const heroLineCIn = throwIn(stagger(titleStage, 2, 0.12), heroFrom, 170);
  const heroSubIn = throwIn(introStages.subtitle * (1 - exitSub), heroFrom, 120);
  const heroCtaIn = throwIn(introStages.cta * (1 - exitCta), heroFrom, 110);
  const heroAwardsIn = throwIn(stagger(introStages.cta * (1 - exitCta), 1, 0.14), heroFrom, 100);

  return (
    <div className={`nl3-copy ${isMobile ? 'is-mobile' : ''}`}>
      {/* HERO — robot orb + written title + feature cards that hide 1-by-1 into workflow */}
      <div
        className={`nl3-text-layer nl3-text-hero is-copy-${heroSide}`}
        style={{
          opacity: heroVisible ? 1 - exitTitle * 0.85 : 0,
          transform: `translate3d(${parallaxX * 0.35}px, ${exitTitle * -56 + parallaxY * 0.35}px, 0)`,
          pointerEvents: heroVisible && exitCta < 0.55 ? 'auto' : 'none',
        }}
        aria-hidden={!heroVisible}
      >
        <p className="nl3-eyebrow nl3-eyebrow-line" style={throwIn(stagger(introStages.title * (1 - exitTitle), 0, 0.08), heroFrom, 90)}>
          <span className="nl3-line" />
          {t('hero.sectionLabel') || 'Intelligent. Reliable. Built for Teams.'}
        </p>
        <h1 className="nl3-title nl3-title-written">
          <span className="nl3-title-line">
            <span className="nl3-title-line-inner" style={heroLineAIn} dangerouslySetInnerHTML={{ __html: heroLineA }} />
          </span>
          {heroLineB && heroLineC ? (
            <>
              <span className="nl3-title-line">
                <span
                  className="nl3-title-line-inner"
                  style={heroLineBIn}
                  dangerouslySetInnerHTML={{ __html: heroLineB }}
                />
              </span>
              <span className="nl3-title-line">
                <span className="nl3-title-line-inner" style={heroLineCIn}>
                  <span dangerouslySetInnerHTML={{ __html: heroLineC }} />
                  <span className="nl3-blinker" aria-hidden>
                    |
                  </span>
                </span>
              </span>
            </>
          ) : (
            <span className="nl3-title-line">
              <span className="nl3-title-line-inner" style={heroLineBIn}>
                <span dangerouslySetInnerHTML={{ __html: heroLineB || heroLineC }} />
                <span className="nl3-blinker" aria-hidden>
                  |
                </span>
              </span>
            </span>
          )}
        </h1>
        <p
          className="nl3-sub"
          style={heroSubIn}
          dangerouslySetInnerHTML={{
            __html: String(t('hero.subtitle') || '')
              .replace(/<highlight>/gi, '<span class="nl3-sub-mark">')
              .replace(/<\/highlight>/gi, '</span>'),
          }}
        />
        <div className="nl3-ctas" style={heroCtaIn}>
          <a className="nl3-btn nl3-btn-primary" href="https://console.dragify.ai/" target="_blank" rel="noreferrer">
            {t('hero.getStarted')}
            <span className="nl3-btn-ico" aria-hidden>
              →
            </span>
          </a>
          <a className="nl3-btn nl3-btn-ghost" href="#story-end">
            <span className="nl3-btn-play" aria-hidden />
            {t('hero.requestDemo')}
          </a>
        </div>
        <div className="nl3-hero-awards" style={heroAwardsIn}>
          <a className="nl3-award" href="#" aria-label="1st Place award">
            <Image src="/placee.png" alt="1st Place" width={170} height={80} style={{ objectFit: 'contain' }} />
          </a>
          <a
            className="nl3-award"
            href="https://www.f6s.com/cloudilic"
            target="_blank"
            rel="noreferrer"
            aria-label="F6S Top Company"
          >
            <Image src="/topLight.png" alt="F6S Top Company" width={225} height={90} style={{ objectFit: 'contain' }} />
          </a>
        </div>
      </div>

      {SO7BA_STORY.sections.filter((s) => s.id !== 'hero').map((section) => {
        const stages = sampleSectionStages(progress, section.id);
        const visible = stages.overall > 0.02;
        const side = isMobile ? 'left' : section.copySide;
        return (
          <SectionLayer
            key={section.id}
            id={section.id}
            copySide={side}
            visible={visible}
            stages={stages}
            parallaxX={parallaxX}
            parallaxY={parallaxY}
            isMobile={isMobile}
            t={t}
            featuresTitle={featuresTitleHtml}
            statsTitleHtml={statsTitleHtml}
            featureItems={featureItems}
            agentItems={agentItems}
            integrationItems={integrationItems}
            howSteps={howSteps}
            faqItems={faqItems}
            statsItems={statsItems}
          />
        );
      })}
    </div>
  );
}

function SectionLayer({
  id,
  copySide,
  visible,
  stages,
  parallaxX,
  parallaxY,
  isMobile,
  t,
  featuresTitle,
  statsTitleHtml,
  featureItems,
  agentItems,
  integrationItems,
  howSteps,
  faqItems,
  statsItems,
}: {
  id: string;
  copySide: So7baCopySide;
  visible: boolean;
  stages: { badge: number; title: number; subtitle: number; cta: number; overall: number };
  parallaxX: number;
  parallaxY: number;
  isMobile: boolean;
  t: CopyFn;
  featuresTitle: string;
  statsTitleHtml: string;
  featureItems: Array<{ title: string; description: string }>;
  agentItems: Array<{ title: string; description: string }>;
  integrationItems: Array<{ name: string; connected: boolean }>;
  howSteps: Array<{ number: number; title: string; description: string }>;
  faqItems: Array<{ question: string; answer: string }>;
  statsItems: Array<{ percentage: string; description: string }>;
}) {
  const fromX = isMobile ? 0 : copySide === 'right' ? 1 : -1;
  const exitLift = stages.overall < 0.99 ? (1 - stages.overall) * -48 : 0;
  const exitFade = Math.max(0.15, stages.overall);
  const badgeIn = throwIn(stages.badge, fromX, 140);
  const titleIn = throwIn(stages.title, fromX, 165);
  const subIn = throwIn(stages.subtitle, fromX, 120);
  const live = Math.max(stages.badge, stages.title, stages.subtitle, stages.cta);

  return (
    <div
      className={`nl3-text-layer nl3-text-${id} is-copy-${copySide}${id === 'stats' ? ' nl3-text-stats' : ''}`}
      style={{
        opacity: visible ? exitFade * Math.min(1, live * 1.2 + 0.05) : 0,
        transform: `translate3d(${parallaxX * 0.25}px, ${parallaxY * 0.25 + exitLift}px, 0)`,
        pointerEvents: stages.cta > 0.2 || stages.subtitle > 0.35 ? 'auto' : 'none',
        justifySelf: id === 'stats' ? 'center' : copySide === 'right' ? 'end' : 'start',
        textAlign: id === 'stats' ? 'center' : 'left',
      }}
      aria-hidden={!visible}
    >
      {id === 'partners' && (
        <>
          <p className="nl3-eyebrow nl3-eyebrow-line" style={badgeIn}>
            <span className="nl3-line" />
            TRUSTED BACKING
          </p>
          <h2
            className="nl3-title nl3-title-sm"
            style={{ ...titleIn, transformOrigin: 'left center' }}
            dangerouslySetInnerHTML={{
              __html: String(t('partners.title') || 'Backed by Visionaries')
                .replace(/Visionaries/gi, '<span class="nl3-how-mark">Visionaries</span>'),
            }}
          />
          <p className="nl3-sub nl3-partners-sub" style={subIn}>
            {t('partners.subtitle') ||
              'Built with support from global accelerators, cloud leaders, and national innovation programs.'}
          </p>
          {/* Logos live inside section-2 Studio particles (scene.png) — no HTML cards. */}
          <a
            className="nl3-btn nl3-btn-ghost nl3-btn-partners"
            href="/about"
            style={{
              ...throwIn(stages.cta, fromX, 80),
              marginTop: '1.35rem',
            }}
          >
            Know more about us →
          </a>
        </>
      )}

      {id === 'features' && (
        <>
          <p className="nl3-eyebrow nl3-eyebrow-line" style={badgeIn}>
            <span className="nl3-line" />
            PLATFORM CAPABILITIES
          </p>
          <h2
            className="nl3-title nl3-title-sm"
            style={{ ...titleIn, transformOrigin: 'left center' }}
            dangerouslySetInnerHTML={{ __html: featuresTitle }}
          />
          <p className="nl3-sub nl3-features-sub" style={subIn}>
            {t('features.description')}
          </p>
          <div className="nl3-feature-list">
            {featureItems.slice(0, 4).map((f, i) => {
              const s = stagger(stages.cta, i, 0.09);
              const icon = FEATURE_ICONS[i] || FEATURE_ICONS[0];
              return (
                <div
                  key={f.title}
                  className={`nl3-feature-row${i === 0 ? ' is-active' : ''}`}
                  style={throwIn(s, fromX, 100)}
                >
                  <span className="nl3-feature-icon" aria-hidden>
                    <Image src={icon.src} alt="" width={28} height={28} />
                  </span>
                  <div className="nl3-feature-copy">
                    <strong>{f.title}</strong>
                    <span className="nl3-feature-desc">{f.description}</span>
                  </div>
                  <span className="nl3-feature-go" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M5 3.2L8.8 7 5 10.8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {id === 'agents' && (
        <>
          <p className="nl3-eyebrow nl3-eyebrow-line" style={badgeIn}>
            <span className="nl3-line" />
            {t('agents.sectionLabel') || 'Intelligent. Adaptive. Built for Teams.'}
          </p>
          <h2
            className="nl3-title nl3-title-sm nl3-title-agents"
            style={{ ...titleIn, transformOrigin: 'left center' }}
            dangerouslySetInnerHTML={{
              __html: String(t('agents.title') || 'AI That Fits Every Team and Every Workflow')
                .replace(/\s+and\s+/i, '<br/>and ')
                .replace(/<highlight>/gi, '<span class="nl3-workflow-mark">')
                .replace(/<\/highlight>/gi, '</span>'),
            }}
          />
          <p
            className="nl3-sub nl3-agents-sub"
            style={subIn}
            dangerouslySetInnerHTML={{
              __html: String(t('agents.description') || '')
                .replace(/<highlight>/gi, '<span class="nl3-sub-mark">')
                .replace(/<\/highlight>/gi, '</span>'),
            }}
          />
          <div className="nl3-avatar-row" aria-label="AI agent team">
            {AGENT_PORTRAITS.map((a, i) => {
              const s = stagger(stages.cta, i, 0.07);
              return (
                <span key={a.src} className="nl3-avatar" title={a.alt} style={throwIn(s, fromX, 70)}>
                  <Image src={a.src} alt={a.alt} width={52} height={52} style={{ objectFit: 'cover' }} />
                </span>
              );
            })}
          </div>
          <div className="nl3-agent-cats">
            {agentItems.slice(0, 6).map((a, i) => {
              const s = stagger(stages.cta, i + 2, 0.07);
              const icon = AGENT_CAT_ICONS[i] || AGENT_CAT_ICONS[0];
              return (
                <span
                  key={a.title}
                  className="nl3-agent-cat"
                  title={a.description}
                  style={throwIn(s, fromX, 60)}
                >
                  <span className="nl3-agent-cat-ico" aria-hidden dangerouslySetInnerHTML={{ __html: icon }} />
                  {a.title}
                </span>
              );
            })}
          </div>
        </>
      )}

      {id === 'integrations' && (
        <>
          <p className="nl3-eyebrow nl3-eyebrow-line" style={badgeIn}>
            <span className="nl3-line" />
            {t('integrations.sectionLabel') || 'Fully Connected Ecosystem'}
          </p>
          <h2
            className="nl3-title nl3-title-sm nl3-title-integrations"
            style={{ ...titleIn, transformOrigin: 'left center' }}
            dangerouslySetInnerHTML={{
              __html: String(t('integrations.title') || '')
                .replace(/<highlight>/gi, '<span class="nl3-workflow-mark">')
                .replace(/<\/highlight>/gi, '</span>'),
            }}
          />
          <p className="nl3-sub nl3-integrations-sub" style={subIn}>
            {t('integrations.description')}
          </p>
          <div className="nl3-logo-row nl3-logo-row-apps">
            {INTEGRATION_LOGOS.map((logo, i) => {
              const s = stagger(stages.cta, i, 0.06);
              return (
                <span key={logo.src} className="nl3-app-tile" title={logo.alt} style={throwIn(s, fromX, 70)}>
                  <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} style={{ objectFit: 'contain' }} />
                </span>
              );
            })}
          </div>
          <div className="nl3-chips nl3-chips-integrations">
            {integrationItems.map((item, i) => {
              const s = stagger(stages.cta, i + 3, 0.06);
              return (
                <span
                  key={item.name}
                  className={`nl3-chip ${item.connected ? 'is-on-chip' : 'is-off-chip'}`}
                  style={throwIn(s, fromX, 55)}
                >
                  {item.name.toUpperCase()}
                  {item.connected ? ` · ${(t('integrations.connected') || 'Connected').toUpperCase()} ✓` : ''}
                </span>
              );
            })}
          </div>
          <a
            className="nl3-btn nl3-btn-ghost nl3-btn-integrations"
            href="/integrations"
            style={{ ...throwIn(stagger(stages.cta, 8, 0.06), fromX, 60), marginTop: '1.15rem' }}
          >
            {t('integrations.seeAll')} →
          </a>
        </>
      )}

      {id === 'stats' && (
        <>
          <p className="nl3-eyebrow nl3-eyebrow-line" style={badgeIn}>
            <span className="nl3-line" />
            IMPACT
          </p>
          <h2
            className="nl3-title nl3-title-sm"
            style={{ ...titleIn, transformOrigin: 'center center' }}
            dangerouslySetInnerHTML={{ __html: statsTitleHtml }}
          />
          <p className="nl3-sub nl3-stats-sub" style={subIn}>
            {t('statistics.subtitle')}
          </p>
          <div className="nl3-stats-focus" aria-label="Key metrics">
            {statsItems.map((stat, i) => {
              const s = stagger(stages.cta, i, 0.08);
              return (
                <div key={stat.percentage} className="nl3-stat-focus" style={throwIn(s, 0, 80)}>
                  <div className="nl3-stat-ring-slot">
                    <strong className="nl3-stat-neon">{stat.percentage}</strong>
                  </div>
                  <span className="nl3-stat-label">{stat.description}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {id === 'how' && (
        <>
          <p className="nl3-eyebrow nl3-eyebrow-line" style={badgeIn}>
            <span className="nl3-line" />
            {t('howItWorks.sectionLabel') || 'How It Works?'}
          </p>
          <h2
            className="nl3-title nl3-title-sm nl3-title-how"
            style={{ ...titleIn, transformOrigin: 'left center' }}
            dangerouslySetInnerHTML={{
              __html: String(t('howItWorks.title') || '')
                .replace(/<highlight>/gi, '<span class="nl3-workflow-mark">')
                .replace(/<\/highlight>/gi, '</span>'),
            }}
          />
          <ol className="nl3-steps">
            {howSteps.map((step, i) => {
              const s = stagger(stages.cta, i, 0.08);
              return (
                <li key={step.number} style={throwIn(s, fromX, 90)}>
                  <span className="nl3-step-num">{step.number}</span>
                  <div className="nl3-step-copy">
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}

      {id === 'faq' && (
        <>
          <p className="nl3-eyebrow nl3-eyebrow-line" style={badgeIn}>
            <span className="nl3-line" />
            {t('faq.sectionLabel') || 'Questions & Answers'}
          </p>
          <h2
            className="nl3-title nl3-title-sm nl3-title-faq"
            style={{ ...titleIn, transformOrigin: 'left center' }}
            dangerouslySetInnerHTML={{
              __html: String(t('faq.title') || 'Frequently Asked Questions')
                .replace(/\s+(<highlight>)/i, '<br/>$1')
                .replace(/<highlight>/gi, '<span class="nl3-workflow-mark">')
                .replace(/<\/highlight>/gi, '</span>'),
            }}
          />
          <p className="nl3-sub nl3-faq-sub" style={subIn}>
            {t('faq.description')}
          </p>
          <div className="nl3-faq">
            {faqItems.map((item, i) => {
              const s = stagger(stages.cta, i, 0.08);
              return (
                <details key={item.question} className="nl3-faq-item" style={throwIn(s, fromX, 85)}>
                  <summary>
                    <span className={`nl3-faq-ico nl3-faq-ico-${i % 4}`} aria-hidden />
                    <span className="nl3-faq-q">{item.question}</span>
                    <span className="nl3-faq-plus" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              );
            })}
          </div>
          <div className="nl3-faq-help" style={throwIn(stagger(stages.cta, 5, 0.08), fromX, 70)}>
            <span className="nl3-faq-help-avatar">
              <Image src="/robot.png" alt="" width={48} height={48} style={{ objectFit: 'cover' }} />
            </span>
            <p className="nl3-faq-help-copy">
              <span className="nl3-sub-mark">{t('faq.stillHave') || 'Still have questions?'}</span>{' '}
              {t('faq.stillHaveBody') || 'Our team is here to help you 24/7.'}
            </p>
            <a className="nl3-btn nl3-btn-ghost nl3-faq-help-btn" href="/contact">
              <span className="nl3-faq-help-chat" aria-hidden />
              {t('faq.contactSupport') || 'Contact Support'} →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
