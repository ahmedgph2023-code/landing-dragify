import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
// import { useTheme } from '../context/ThemeContext';
import { useLocalization } from '../context/LocalizationContext';
import styled, { css } from 'styled-components';
import Image from 'next/image';

const STARTUP_PASS_CODE = 'STARTUPPASS';

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLocalization();
  
  // Check if on event page with valid coupon
  const couponQuery = router.query.coupon;
  const coupon = typeof couponQuery === 'string' ? couponQuery.trim().toUpperCase() : '';
  const hasValidCoupon = router.pathname === '/event' && coupon === STARTUP_PASS_CODE;
  const dashboardUrl = hasValidCoupon 
    ? `https://console.dragify.ai/event?coupon=${encodeURIComponent(coupon)}`
    : 'https://console.dragify.ai/';
  const navItems = [
    { href: '/', label: t('header.home') },
    { href: '/pricing', label: t('header.pricing') },
    {
      href: 'https://docs.dragify.ai/',
      label: t('header.documentation'),
      external: true,
    },
    { href: '/resources/blog', label: t('header.blogs') },
    { href: '/contact', label: t('footer.company.contact') },
    { href: '/privacy', label: t('footer.privacyPolicy') },
  ];
  // const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HeaderContainer $isScrolled={isScrolled}>
      <Container>
        <Logo href="/">
          <Image src="/logo3.png" alt="logo" width={ 150 } height={ 50 } style={{ objectFit: 'contain' }} />
          {/* <LogoLink href="/">DRAGIFY AI</LogoLink> */}
        </Logo>

        <DesktopNav>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
            >
              {item.label}
            </NavLink>
          ))}
        </DesktopNav>

        <RightSection>
          <LanguageSwitcher>
            <LanguageButton 
              $active={language === 'en'} 
              onClick={() => setLanguage('en')}
            >
              EN
            </LanguageButton>
            <LanguageButton 
              $active={language === 'ar'} 
              onClick={() => setLanguage('ar')}
            >
              AR
            </LanguageButton>
          </LanguageSwitcher>
          <ThemeToggle />
          <DashboardButton 
            aria-disabled={router.pathname === '/event' && !hasValidCoupon}
            href={dashboardUrl}
            target="_blank" 
            rel="noopener noreferrer"
          >
            {t('header.dashboard')}
          </DashboardButton>
          <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </MobileMenuButton>
        </RightSection>
      </Container>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                onClick={toggleMobileMenu}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.label}
              </MobileNavLink>
            ))}
            <MobileNavLink
              href="https://console.dragify.ai/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={toggleMobileMenu}
            >
              {t('header.dashboard')}
            </MobileNavLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.background};
  
  ${({ $isScrolled, theme }) => $isScrolled && css`
    padding: 0.75rem 0;
    box-shadow: ${theme.shadows.small};
    background-color: ${theme.colors.cardBackground};
  `}
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;

  img {
    margin-right: 10px;
    border-radius: 5px;
  }
`;

// const LogoLink = styled(Link)`
//   text-decoration: none;
//   display: inline-block;
// `;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent.blue};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.accent.blue}, 
      ${({ theme }) => theme.colors.accent.purple}
    );
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const DashboardButton = styled(Link)`
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.accent.blue}, 
    ${({ theme }) => theme.colors.accent.purple}
  );
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: white;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  display: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const MobileNavLink = styled(Link)`
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  transition: color 0.2s ease;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const LanguageSwitcher = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 6px;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const LanguageButton = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) => 
    $active 
      ? `linear-gradient(90deg, ${theme.colors.accent.blue}, ${theme.colors.accent.purple})` 
      : 'transparent'
  };
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.text.primary
  };
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active, theme }) => 
      $active 
        ? `linear-gradient(90deg, ${theme.colors.accent.blue}, ${theme.colors.accent.purple})` 
        : theme.colors.border
    };
  }
`;
