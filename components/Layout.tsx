import { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { usePathname } from 'next/navigation'

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

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    // Force repaint to fix theme transition issues on some browsers
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger a reflow
    document.body.style.display = '';
  }, [isDarkMode]);

  return (
    <LayoutContainer>
      { !['/dashboard', '/dashboard/login'].includes(pathname) ? <Header /> : null}
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
      { !['/dashboard', '/dashboard/login'].includes(pathname) ? <Footer /> : null}
    </LayoutContainer>
  );
};

export default Layout;