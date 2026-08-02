import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext';
import { LocalizationProvider, useLocalization } from '../context/LocalizationContext';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { createGlobalStyle } from 'styled-components';
import Head from 'next/head';
import { useEffect } from 'react';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
      'Helvetica Neue', Arial, sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
   [dir="rtl"] {
    text-align: right;
  }
  [dir="rtl"] .highlight {
    direction: rtl;
  }
`;

// Component to handle RTL direction
function RTLHandler() {
  const { isRTL } = useLocalization();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = isRTL ? 'ar' : 'en';
    }
  }, [isRTL]);

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <GlobalStyle />
        <RTLHandler />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default MyApp;