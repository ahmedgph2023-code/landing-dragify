import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';
import { PrimaryCTA, useL3 } from './shared';

export default function L3Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { c, language, setLanguage } = useL3();

  const links = [
    { href: '#stage', label: c('nav.product') },
    { href: '#teams', label: c('nav.useCases') },
    { href: '#stack', label: c('nav.integrations') },
    { href: '#plans', label: c('nav.pricing') },
    { href: 'https://docs.dragify.ai/', label: c('nav.docs'), external: true },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Bar $scrolled={scrolled}>
        <Inner>
          <LogoLink href="/landing-3">
            <Image src="/logo3.png" alt="Dragify" width={128} height={40} style={{ objectFit: 'contain' }} priority />
          </LogoLink>

          <Links>
            {links.map((l) => (
              <NavA key={l.href} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}>
                {l.label}
              </NavA>
            ))}
          </Links>

          <Right>
            <LangSwitch>
              <LangBtn type="button" $on={language === 'en'} onClick={() => setLanguage('en')}>EN</LangBtn>
              <LangBtn type="button" $on={language === 'ar'} onClick={() => setLanguage('ar')}>AR</LangBtn>
            </LangSwitch>
            <ThemeToggle />
            <DemoLink href="https://calendly.com/cloudilic" target="_blank" rel="noopener noreferrer">
              {c('nav.bookDemo')}
            </DemoLink>
            <PrimaryCTA href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer" style={{ padding: '0.65rem 1.2rem', fontSize: '0.88rem' }}>
              {c('nav.start')}
            </PrimaryCTA>
            <Burger type="button" aria-label="Menu" $open={open} onClick={() => setOpen((v) => !v)}>
              <i /><i /><i />
            </Burger>
          </Right>
        </Inner>
      </Bar>

      <AnimatePresence>
        {open && (
          <Mobile
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {links.map((l) => (
              <MobileA key={l.href} href={l.href} onClick={() => setOpen(false)} target={l.external ? '_blank' : undefined}>
                {l.label}
              </MobileA>
            ))}
            <MobileA href="https://console.dragify.ai/" target="_blank" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>
              {c('nav.start')}
            </MobileA>
            <MobileTools>
              <LangSwitch>
                <LangBtn type="button" $on={language === 'en'} onClick={() => setLanguage('en')}>EN</LangBtn>
                <LangBtn type="button" $on={language === 'ar'} onClick={() => setLanguage('ar')}>AR</LangBtn>
              </LangSwitch>
              <ThemeToggle />
            </MobileTools>
          </Mobile>
        )}
      </AnimatePresence>
    </>
  );
}

const Bar = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 80;
  padding-block: ${({ $scrolled }) => ($scrolled ? '0.65rem' : '1.15rem')};
  background: ${({ $scrolled }) => ($scrolled ? 'var(--l3-scrim)' : 'transparent')};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(16px)' : 'none')};
  border-bottom: 1px solid ${({ $scrolled }) => ($scrolled ? 'var(--l3-line)' : 'transparent')};
  transition: padding 0.3s var(--l3-ease), background 0.3s ease, border-color 0.3s ease;
`;

const Inner = styled.div`
  max-width: var(--l3-max);
  margin: 0 auto;
  padding-inline: clamp(1.25rem, 3vw, 2rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const Links = styled.nav`
  display: flex;
  gap: 1.75rem;
  @media (max-width: 980px) { display: none; }
`;

const NavA = styled.a`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--l3-muted) !important;
  text-decoration: none !important;
  transition: color 0.2s ease;
  &:hover { color: var(--l3-ink) !important; }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const LangSwitch = styled.div`
  display: flex;
  padding: 2px;
  border-radius: 8px;
  border: 1px solid var(--l3-line);
  background: var(--l3-bg);
  @media (max-width: 640px) { display: none; }
`;

const LangBtn = styled.button<{ $on: boolean }>`
  border: 0;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  background: ${({ $on }) => ($on ? 'var(--l3-grad-btn)' : 'transparent')};
  color: ${({ $on }) => ($on ? '#fff' : 'var(--l3-muted)')};
`;

const DemoLink = styled.a`
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--l3-ink-soft) !important;
  text-decoration: none !important;
  @media (max-width: 1100px) { display: none; }
`;

const Burger = styled.button<{ $open: boolean }>`
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid var(--l3-line);
  border-radius: 10px;
  background: var(--l3-surface);
  cursor: pointer;
  position: relative;
  @media (max-width: 980px) { display: block; }
  i {
    position: absolute;
    left: 10px;
    right: 10px;
    height: 1.5px;
    background: var(--l3-ink);
    transition: 0.25s ease;
    &:nth-child(1) { top: ${({ $open }) => ($open ? '19px' : '13px')}; transform: ${({ $open }) => ($open ? 'rotate(45deg)' : 'none')}; }
    &:nth-child(2) { top: 19px; opacity: ${({ $open }) => ($open ? 0 : 1)}; }
    &:nth-child(3) { top: ${({ $open }) => ($open ? '19px' : '25px')}; transform: ${({ $open }) => ($open ? 'rotate(-45deg)' : 'none')}; }
  }
`;

const Mobile = styled(motion.div)`
  position: fixed;
  top: 72px;
  inset-inline: 1rem;
  z-index: 79;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem;
  border-radius: 16px;
  background: var(--l3-elevated);
  border: 1px solid var(--l3-line);
  box-shadow: var(--l3-shadow);
  @media (min-width: 981px) { display: none; }
`;

const MobileA = styled.a`
  padding: 0.85rem 0.9rem;
  border-radius: 10px;
  color: var(--l3-ink) !important;
  text-decoration: none !important;
  font-weight: 600;
  &:hover { background: var(--l3-surface); }
`;

const MobileTools = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.5rem 0.25rem;
  border-top: 1px solid var(--l3-line);
  margin-top: 0.35rem;
  ${LangSwitch} { display: flex; }
`;
