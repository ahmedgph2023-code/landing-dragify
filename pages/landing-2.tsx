import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import Nav from '../components/landing2/Nav';
import Hero from '../components/landing2/Hero';
import Partners from '../components/landing2/Partners';
import StoryPin from '../components/landing2/StoryPin';
import Features from '../components/landing2/Features';
import WorkflowScroll from '../components/landing2/WorkflowScroll';
import Agents from '../components/landing2/Agents';
import Integrations from '../components/landing2/Integrations';
import Statistics from '../components/landing2/Statistics';
import Testimonials from '../components/landing2/Testimonials';
import PricingTeaser from '../components/landing2/PricingTeaser';
import FAQ from '../components/landing2/FAQ';
import FinalCTA from '../components/landing2/FinalCTA';
import Footer from '../components/landing2/Footer';

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background};
  overflow-x: clip;
`;

const LandingTwo: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dragify AI - Deployment Made Intelligent</title>
        <meta name="description" content="Dragify AI - Deployment: Drag, Drop, and Drive Intelligent Decisions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page>
        <Nav />
        <Hero />
        <Partners />
        <StoryPin />
        <Features />
        <WorkflowScroll />
        <Agents />
        <Integrations />
        <Statistics />
        <Testimonials />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
        <Footer />
      </Page>
    </>
  );
};

export default LandingTwo;
