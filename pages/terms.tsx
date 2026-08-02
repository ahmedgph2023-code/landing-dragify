import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Layout from '../components/Layout';
import LegalHeader from '../components/LegalHeader';
import TermsContent from '../components/TermsContent';

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
`;

const Terms = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - Dragify AI</title>
        <meta name="description" content="Terms of Service for Dragify AI. Learn about the terms and conditions governing the use of our AI deployment platform." />
      </Head>
      
        <MainContent>
          <LegalHeader 
            title="Terms of Service" 
            description="Please read these terms and conditions carefully before using our services."
            lastUpdated="April 14, 2025"
          />
          <TermsContent />
        </MainContent>
    </>
  );
};

export default Terms;