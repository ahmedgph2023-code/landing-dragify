import type { NextPage } from 'next';
import Head from 'next/head';
import Hero from '../components/Hero';
import Partners from '../components/Partners';
import Features from '../components/Features';
import Scaling from '../components/Scaling';
import Statistics from '../components/Statistics';
import Agents from '../components/Agents';
import Integrations from '../components/Integrations';
import FAQ from '../components/FAQ';
import HowItWorks from '../components/HowItWorks';
import styled from 'styled-components';

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
`;

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dragify AI - Deployment Made Intelligent</title>
        <meta name="description" content="Dragify AI - Deployment: Drag, Drop, and Drive Intelligent Decisions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainContent>
        <Hero />
        <Partners />
        <Features />
        <Agents />
        <Integrations />
        <Statistics />
        {/* <Scaling /> */}
        <HowItWorks />
        <FAQ />
      </MainContent>
    </>
  );
};

export default Home;
