import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useLocalization } from '../../context/LocalizationContext';
import { NLThemeStyle } from '../../components/new-landing/theme';
import { L3ThemeStyle } from '../../components/landing3/theme';
import NLNav from '../../components/new-landing/NLNav';
import NLHero from '../../components/new-landing/NLHero';
import NLMarquee from '../../components/new-landing/NLMarquee';
import L3Manifesto from '../../components/landing3/L3Manifesto';
import NLWorkflowDemo from '../../components/new-landing/NLWorkflowDemo';
import NLFeatures from '../../components/new-landing/NLFeatures';
import NLAgents from '../../components/new-landing/NLAgents';
import NLIntegrations from '../../components/new-landing/NLIntegrations';
import NLSecurity from '../../components/new-landing/NLSecurity';
import NLTestimonials from '../../components/new-landing/NLTestimonials';
import NLPricing from '../../components/new-landing/NLPricing';
import L3Ask from '../../components/landing3/L3Ask';
import NLCTA from '../../components/new-landing/NLCTA';
import NLFooter from '../../components/new-landing/NLFooter';

const NewLanding: NextPage = () => {
  const { isDarkMode } = useTheme();
  const { t } = useLocalization();
  const l3Theme = isDarkMode ? 'dark' : 'light';

  useEffect(() => {
    let cancelled = false;
    let t1 = 0;
    let t2 = 0;
    const refresh = async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (!cancelled) ScrollTrigger.refresh();
    };

    t1 = window.setTimeout(refresh, 120);
    t2 = window.setTimeout(refresh, 600);
    window.addEventListener('load', refresh);

    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{t('landing.meta.title')}</title>
        <meta name="description" content={t('landing.meta.description')} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <NLThemeStyle />
      <L3ThemeStyle />
      <Page data-nl-theme={isDarkMode ? 'dark' : 'light'}>
        <NLNav />
        <NLHero />
        <NLMarquee />
        <L3Wrap data-l3-theme={l3Theme}>
          <L3Manifesto />
        </L3Wrap>
        <NLWorkflowDemo />
        <NLFeatures />
        <NLAgents />
        <NLIntegrations />
        <NLSecurity />
        <NLTestimonials />
        <NLPricing />
        <L3Wrap data-l3-theme={l3Theme}>
          <L3Ask />
        </L3Wrap>
        <NLCTA />
        <NLFooter />
      </Page>
    </>
  );
};

export default NewLanding;

const Page = styled.div`
  background: var(--nl-bg);
  color: var(--nl-text);
  font-family: var(--nl-font);
  overflow-x: clip;
`;

const L3Wrap = styled.div`
  background: var(--l3-bg-deep);
`;
