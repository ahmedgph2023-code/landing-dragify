import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useLocalization } from '../../context/LocalizationContext';
import { MagneticButton, useContent } from './shared';

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
  /** NL3 scroll section id when cinematic + onJumpToSection is provided */
  section?: string;
};

export default function NLNav({
  variant = 'default',
  onJumpToSection,
}: {
  /** Cinematic stage (/new-landing-3): mint glass, jumps into particle sections. */
  variant?: 'default' | 'cinematic';
  /** Scroll the immersive story to a section mid-range */
  onJumpToSection?: (sectionId: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { c, language } = useContent();
  const { setLanguage, t } = useLocalization();
  const cinematic = variant === 'cinematic';
  const sectionNav = cinematic && typeof onJumpToSection === 'function';

  const howLabel = String(t('howItWorks.sectionLabel') || 'How it works').replace(/\?$/, '');

  const links: NavLink[] = sectionNav
    ? [
        { href: '#features', label: c('nav.product'), section: 'features' },
        { href: '#agents', label: c('nav.useCases'), section: 'agents' },
        { href: '#integrations', label: c('nav.integrations'), section: 'integrations' },
        { href: '#how', label: howLabel, section: 'how' },
        { href: 'https://docs.dragify.ai/', label: c('nav.docs'), external: true },
      ]
    : [
        { href: '#features', label: c('nav.product') },
        { href: '#agents', label: c('nav.useCases') },
        { href: '#integrations', label: c('nav.integrations') },
        { href: '/pricing', label: c('nav.pricing') },
        { href: 'https://docs.dragify.ai/', label: c('nav.docs'), external: true },
      ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSectionClick = (e: React.MouseEvent, link: NavLink) => {
    if (!sectionNav || !link.section || !onJumpToSection) return;
    e.preventDefault();
    onJumpToSection(link.section);
    setOpen(false);
  };

  return (
    <>
      <Bar>
        <Shell $scrolled={scrolled} $cinematic={cinematic}>
          <Inner>
            <LogoLink href={cinematic ? '/new-landing-3' : '/landing'}>
              <Image src="/logo3.png" alt="Dragify" width={118} height={38} style={{ objectFit: 'contain' }} priority />
            </LogoLink>

            <Links>
              {links.map((l) => (
                <NavA
                  key={l.href}
                  href={l.href}
                  $cinematic={cinematic}
                  target={l.external ? '_blank' : undefined}
                  rel={l.external ? 'noopener noreferrer' : undefined}
                  onClick={(e) => handleSectionClick(e, l)}
                >
                  {l.label}
                </NavA>
              ))}
            </Links>

            <Right>
              <LangSwitch $cinematic={cinematic}>
                <LangBtn type="button" $active={language === 'en'} $cinematic={cinematic} onClick={() => setLanguage('en')}>
                  EN
                </LangBtn>
                <LangBtn type="button" $active={language === 'ar'} $cinematic={cinematic} onClick={() => setLanguage('ar')}>
                  AR
                </LangBtn>
              </LangSwitch>

              <ThemeBtn type="button" $cinematic={cinematic} onClick={toggleTheme} aria-label={c('nav.toggleTheme')}>
                <AnimatePresence mode="wait" initial={false}>
                  {isDarkMode ? (
                    <motion.svg
                      key="sun"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ opacity: 0, rotate: -60 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 60 }}
                      transition={{ duration: 0.25 }}
                    >
                      <circle cx="12" cy="12" r="4.5" />
                      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="moon"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ opacity: 0, rotate: 60 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -60 }}
                      transition={{ duration: 0.25 }}
                    >
                      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </ThemeBtn>

              <GhostLink $cinematic={cinematic} href="https://calendly.com/cloudilic" target="_blank" rel="noopener noreferrer">
                {c('nav.bookDemo')}
              </GhostLink>

              {cinematic ? (
                <PrimaryCta href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer">
                  {c('nav.start')}
                </PrimaryCta>
              ) : (
                <MagneticButton href="https://console.dragify.ai/" target="_blank" variant="primary">
                  {c('nav.start')}
                </MagneticButton>
              )}

              <BurgerBtn type="button" aria-label={c('nav.toggleMenu')} onClick={() => setOpen((o) => !o)} $open={open} $cinematic={cinematic}>
                <span />
                <span />
                <span />
              </BurgerBtn>
            </Right>
          </Inner>
        </Shell>
      </Bar>

      <AnimatePresence>
        {open && (
          <MobileMenu
            $cinematic={cinematic}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {links.map((l) => (
              <MobileA
                key={l.href}
                href={l.href}
                $cinematic={cinematic}
                onClick={(e) => {
                  handleSectionClick(e, l);
                  if (!l.section) setOpen(false);
                }}
                target={l.external ? '_blank' : undefined}
              >
                {l.label}
              </MobileA>
            ))}
            <MobileA href="https://console.dragify.ai/" target="_blank" $cinematic={cinematic} $primary style={{ fontWeight: 700 }}>
              {c('nav.start')}
            </MobileA>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
}

/* NL3 cinematic mint tokens (match --nl3-glow) */
const MINT = '#2ee6c5';
const MINT_BRIGHT = '#3cffe0';

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
  padding: 0.75rem 1rem 0;
  pointer-events: none;

  @media (min-width: 768px) {
    padding: 1rem 1.5rem 0;
  }
`;

const Shell = styled.div<{ $scrolled: boolean; $cinematic: boolean }>`
  pointer-events: auto;
  width: 100%;
  max-width: var(--nl-max-width);
  border-radius: ${({ $cinematic }) => ($cinematic ? '18px' : '16px')};
  position: relative;
  transition: background 0.35s var(--nl-ease-out), box-shadow 0.35s var(--nl-ease-out), border-color 0.35s var(--nl-ease-out);
  backdrop-filter: blur(var(--nl-glass-blur));
  -webkit-backdrop-filter: blur(var(--nl-glass-blur));

  ${({ $cinematic, $scrolled }) =>
    $cinematic
      ? `
    background: ${$scrolled ? 'rgba(5, 7, 10, 0.82)' : 'rgba(5, 7, 10, 0.55)'};
    border: 1px solid ${$scrolled ? 'rgba(46, 230, 197, 0.28)' : 'rgba(46, 230, 197, 0.16)'};
    box-shadow: ${
      $scrolled
        ? '0 16px 48px -20px rgba(0,0,0,0.65), 0 0 0 1px rgba(46,230,197,0.1) inset, 0 0 28px -12px rgba(46,230,197,0.25)'
        : '0 0 0 1px rgba(46,230,197,0.06) inset'
    };
  `
      : `
    background: ${$scrolled ? 'var(--nl-bg-translucent)' : 'rgba(11, 18, 32, 0.4)'};
    border: 1px solid ${$scrolled ? 'var(--nl-border-strong)' : 'rgba(255,255,255,0.12)'};
    box-shadow: ${$scrolled ? 'var(--nl-shadow-md)' : 'none'};
  `}

  ${({ $cinematic }) =>
    !$cinematic &&
    `
    [data-nl-theme='light'] & {
      background: var(--nl-bg-translucent);
      border-color: var(--nl-border);
    }
  `}

  &::before {
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: ${({ $cinematic }) =>
      $cinematic
        ? `linear-gradient(135deg, rgba(46,230,197,0.1), transparent 45%, rgba(201,148,74,0.05))`
        : 'rgba(255, 255, 255, 0.04)'};
    mix-blend-mode: ${({ $cinematic }) => ($cinematic ? 'normal' : 'overlay')};
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  min-height: 56px;
  padding-block: 0.45rem;
  padding-inline: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 640px) {
    padding-inline: 0.75rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.15rem;
  @media (max-width: 980px) {
    display: none;
  }
`;

const NavA = styled.a<{ $cinematic?: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ $cinematic }) => ($cinematic ? '#e8f7f3' : 'var(--nl-text)')};
  opacity: 0.72;
  text-decoration: none;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  transition: opacity 0.25s ease, background 0.25s ease, color 0.25s ease;
  white-space: nowrap;

  &:hover {
    opacity: 1;
    color: ${({ $cinematic }) => ($cinematic ? MINT_BRIGHT : 'var(--nl-text)')};
    background: ${({ $cinematic }) => ($cinematic ? 'rgba(46, 230, 197, 0.1)' : 'rgba(255, 255, 255, 0.06)')};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
`;

const LangSwitch = styled.div<{ $cinematic?: boolean }>`
  display: flex;
  align-items: center;
  height: 40px;
  box-sizing: border-box;
  background: ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.06)' : 'var(--nl-surface)')};
  border: 1px solid ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.22)' : 'var(--nl-border)')};
  border-radius: 10px;
  padding: 3px;
  @media (max-width: 640px) {
    display: none;
  }
`;

const LangBtn = styled.button<{ $active: boolean; $cinematic?: boolean }>`
  border: none;
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 700;
  height: 100%;
  min-width: 2.1rem;
  padding: 0 0.65rem;
  border-radius: 7px;
  background: ${({ $active, $cinematic }) =>
    $active ? ($cinematic ? MINT : 'var(--nl-gradient-brand)') : 'transparent'};
  color: ${({ $active, $cinematic }) => ($active ? ($cinematic ? '#05070a' : '#fff') : $cinematic ? '#9aa3a8' : 'var(--nl-text-dim)')};
  transition: all 0.2s ease;
`;

const ThemeBtn = styled.button<{ $cinematic?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.22)' : 'var(--nl-border)')};
  background: ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.06)' : 'var(--nl-surface)')};
  color: ${({ $cinematic }) => ($cinematic ? MINT_BRIGHT : 'var(--nl-text)')};
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  @media (max-width: 480px) {
    display: none;
  }
`;

const GhostLink = styled.a<{ $cinematic?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  box-sizing: border-box;
  font-size: 0.88rem;
  font-weight: 500;
  color: ${({ $cinematic }) => ($cinematic ? '#e8f7f3' : 'var(--nl-text)')};
  text-decoration: none;
  padding: 0 0.95rem;
  border-radius: 10px;
  border: 1px solid ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.35)' : 'var(--nl-border)')};
  background: ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.06)' : 'var(--nl-surface)')};
  opacity: 0.92;
  transition: opacity 0.25s ease, border-color 0.25s ease, background 0.25s ease, color 0.25s ease;
  &:hover {
    opacity: 1;
    border-color: ${({ $cinematic }) => ($cinematic ? MINT : 'rgba(255, 255, 255, 0.28)')};
    color: ${({ $cinematic }) => ($cinematic ? MINT_BRIGHT : 'var(--nl-text)')};
  }
  @media (max-width: 760px) {
    display: none;
  }
`;

/** Mint primary CTA — matches NL3 section accent (no purple) */
const PrimaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  box-sizing: border-box;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #05070a;
  text-decoration: none;
  padding: 0 1.15rem;
  border-radius: 10px;
  background: ${MINT};
  border: 1px solid ${MINT_BRIGHT};
  box-shadow: 0 0 22px rgba(46, 230, 197, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;

  &:hover {
    filter: brightness(1.06);
    box-shadow: 0 0 28px rgba(60, 255, 224, 0.45);
    transform: translateY(-1px);
  }
`;

const BurgerBtn = styled.button<{ $open: boolean; $cinematic?: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.22)' : 'var(--nl-border)')};
  background: ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.06)' : 'var(--nl-surface)')};
  cursor: pointer;
  flex-shrink: 0;

  span {
    display: block;
    height: 1.5px;
    background: ${({ $cinematic }) => ($cinematic ? MINT_BRIGHT : 'var(--nl-text)')};
    border-radius: 2px;
    margin: 0 auto;
    width: 18px;
    transition: transform 0.3s var(--nl-ease-out), opacity 0.3s ease;
  }
  ${({ $open }) =>
    $open &&
    `
    span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
  `}

  @media (max-width: 980px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)<{ $cinematic?: boolean }>`
  position: fixed;
  top: 78px;
  left: 1rem;
  right: 1rem;
  z-index: 199;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.15rem;
  border-radius: 16px;
  background: ${({ $cinematic }) => ($cinematic ? 'rgba(5, 7, 10, 0.94)' : 'var(--nl-bg-elevated)')};
  border: 1px solid ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.22)' : 'var(--nl-border)')};
  box-shadow: ${({ $cinematic }) =>
    $cinematic ? '0 20px 48px rgba(0,0,0,0.55), 0 0 24px rgba(46,230,197,0.12)' : 'var(--nl-shadow-lg)'};
  backdrop-filter: blur(24px);
`;

const MobileA = styled.a<{ $cinematic?: boolean; $primary?: boolean }>`
  padding: 0.85rem 0.65rem;
  color: ${({ $cinematic, $primary }) =>
    $primary ? ($cinematic ? MINT_BRIGHT : 'var(--nl-text)') : $cinematic ? '#9aa3a8' : 'var(--nl-text-dim)'};
  text-decoration: none;
  font-weight: 500;
  border-radius: 10px;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ $cinematic }) => ($cinematic ? 'rgba(46,230,197,0.1)' : 'var(--nl-surface)')};
    color: ${({ $cinematic }) => ($cinematic ? MINT_BRIGHT : 'var(--nl-text)')};
  }

  &:last-child {
    color: ${({ $cinematic }) => ($cinematic ? MINT_BRIGHT : 'var(--nl-text)')};
    font-weight: 700;
  }
`;
