import { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.3s ease;
`;

const Main = styled(motion.main)`
  flex: 1;
`;

/** No Framer transform — transform on ancestors breaks sticky/ScrollTrigger pin. */
const StaticMain = styled.main`
  flex: 1;
  position: relative;
`;

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    document.body.style.display = 'none';
    document.body.offsetHeight;
    document.body.style.display = '';
  }, [isDarkMode]);

  const hasOwnChrome =
    ['/dashboard', '/dashboard/login', '/new-landing', '/new-landing-2', '/new-landing-3', '/new-landing-4', '/particle-section-2'].includes(pathname) ||
    pathname?.startsWith('/landing');

  const immersiveScroll =
    pathname === '/new-landing-2' ||
    pathname === '/new-landing-3' ||
    pathname === '/new-landing-4' ||
    pathname === '/particle-section-2';

  return (
    <LayoutContainer>
      {!hasOwnChrome ? <Header /> : null}
      {immersiveScroll ? (
        <StaticMain>{children}</StaticMain>
      ) : (
        <AnimatePresence mode="wait">
          <Main
            key={isDarkMode ? 'dark' : 'light'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </Main>
        </AnimatePresence>
      )}
      {!hasOwnChrome ? <Footer /> : null}
    </LayoutContainer>
  );
};

export default Layout;
