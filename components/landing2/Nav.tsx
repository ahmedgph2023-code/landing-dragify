import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../context/LocalizationContext';
import ThemeToggle from '../ThemeToggle';
import { Container, PrimaryLink, Magnetic, ease } from './shared';

const Bar = styled(motion.header)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 1000;
  padding-block: 1.4rem;
  transition: padding 0.35s ${({ theme }) => 'cubic-bezier(0.16,1,0.3,1)'};
`;

const Pill = styled.div<{ $scrolled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${({ $scrolled }) => ($scrolled ? '1080px' : '1240px')};
  padding-inline: ${({ $scrolled }) => ($scrolled ? '1.25rem' : '1.5rem')};
  padding-block: ${({ $scrolled }) => ($scrolled ? '0.6rem' : '0')};
  border-radius: 100px;
  background: ${({ $scrolled, theme }) => ($scrolled ? theme.colors.cardBackground + 'e6' : 'transparent')};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(18px) saturate(180%)' : 'none')};
  border: 1px solid ${({ $scrolled, theme }) => ($scrolled ? theme.colors.border : 'transparent')};
  box-shadow: ${({ $scrolled, theme }) => ($scrolled ? theme.shadows.medium : 'none')};
  transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  img { border-radius: 6px; }
`;

const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.25rem;
  @media (max-width: 860px) { display: none; }
`;

const NavLink = styled(Link)`
  position: relative;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: color 0.2s ease;
  &:hover { color: ${({ theme }) => theme.colors.text.primary}; }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  @media (max-width: 860px) {
    a[data-cta] { display: none; }
  }
`;

const LangSwitch = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 2px;
`;

const LangBtn = styled.button<{ $active: boolean }>`
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.65rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ $active, theme }) => ($active ? `linear-gradient(100deg, ${theme.colors.accent.blue}, ${theme.colors.accent.purple})` : 'transparent')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.text.secondary)};
`;

const BurgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  @media (max-width: 860px) { display: flex; }
`;

const MobileMenu = styled(motion.div)`
  margin-top: 0.75rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.5rem 1.5rem;
  overflow: hidden;
`;

const MobileLink = styled(Link)`
  padding-block: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-of-type { border-bottom: none; }
`;

export default function Nav() {
  const { t, language, setLanguage } = useLocalization();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/', label: t('header.home') },
    { href: '/pricing', label: t('header.pricing') },
    { href: 'https://docs.dragify.ai/', label: t('header.documentation'), external: true },
    { href: '/resources/blog', label: t('header.blogs') },
  ];

  return (
    <Bar $scrolled={scrolled} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: ease.out }}>
      <Container>
        <Pill $scrolled={scrolled}>
          <Logo href="/">
            <Image src="/logo3.png" alt="Dragify" width={128} height={42} style={{ objectFit: 'contain' }} />
          </Logo>

          <Links>
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>
                {item.label}
              </NavLink>
            ))}
          </Links>

          <Right>
            <LangSwitch>
              <LangBtn $active={language === 'en'} onClick={() => setLanguage('en')}>EN</LangBtn>
              <LangBtn $active={language === 'ar'} onClick={() => setLanguage('ar')}>AR</LangBtn>
            </LangSwitch>
            <ThemeToggle />
            <Magnetic strength={0.25}>
              <PrimaryLink data-cta href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer" style={{ padding: '0.65rem 1.3rem', fontSize: '0.9rem' }}>
                {t('header.dashboard')}
              </PrimaryLink>
            </Magnetic>
            <BurgerButton onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </BurgerButton>
          </Right>
        </Pill>

        <AnimatePresence>
          {open && (
            <MobileMenu initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: ease.out }}>
              {navItems.map((item) => (
                <MobileLink key={item.href} href={item.href} onClick={() => setOpen(false)} target={item.external ? '_blank' : undefined}>
                  {item.label}
                </MobileLink>
              ))}
              <MobileLink href="https://console.dragify.ai/" target="_blank" onClick={() => setOpen(false)}>
                {t('header.dashboard')}
              </MobileLink>
            </MobileMenu>
          )}
        </AnimatePresence>
      </Container>
    </Bar>
  );
}
