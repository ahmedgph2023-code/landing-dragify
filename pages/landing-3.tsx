import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLocalization } from '../context/LocalizationContext';
import { L3ThemeStyle } from '../components/landing3/theme';
import { Shell } from '../components/landing3/shared';
import L3Nav from '../components/landing3/L3Nav';
import L3Opening from '../components/landing3/L3Opening';
import L3Backed from '../components/landing3/L3Backed';
import L3Manifesto from '../components/landing3/L3Manifesto';
import L3Stage from '../components/landing3/L3Stage';
import L3Pillars from '../components/landing3/L3Pillars';
import L3Filmstrip from '../components/landing3/L3Filmstrip';
import L3Constellation from '../components/landing3/L3Constellation';
import L3Proof from '../components/landing3/L3Proof';
import L3Trust from '../components/landing3/L3Trust';
import L3Voices from '../components/landing3/L3Voices';
import L3Plans from '../components/landing3/L3Plans';
import L3Ask from '../components/landing3/L3Ask';
import L3Close from '../components/landing3/L3Close';
import L3Footer from '../components/landing3/L3Footer';

const LandingThree: NextPage = () => {
  const { isDarkMode } = useTheme();
  const { isRTL } = useLocalization();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (!cancelled) ScrollTrigger.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [isDarkMode, isRTL]);

  return (
    <>
      <Head>
        <title>Dragify — AI agents that think, connect, and ship</title>
        <meta
          name="description"
          content="Build custom AI agents, orchestrate multi-agent workflows, and automate WhatsApp, Gmail, Slack, and Shopify on one no-code canvas. Live in under 5 minutes."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <L3ThemeStyle />
      <Shell
        data-l3-theme={isDarkMode ? 'dark' : 'light'}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <L3Nav />
        <L3Opening />
        <L3Backed />
        <L3Manifesto />
        <L3Stage />
        <L3Pillars />
        <L3Filmstrip />
        <L3Constellation />
        <L3Proof />
        <L3Trust />
        <L3Voices />
        <L3Plans />
        <L3Ask />
        <L3Close />
        <L3Footer />
      </Shell>
    </>
  );
};

export default LandingThree;
