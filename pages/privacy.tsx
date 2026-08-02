import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import LegalHeader from '../components/LegalHeader';
import PrivacyContent from '../components/PrivacyContent';
import { useLocalization } from '../context/LocalizationContext';

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
`;

const Privacy = () => {
  const { t } = useLocalization();
  return (
    <>
      <Head>
        <title>{t('privacy.meta.title')}</title>
        <meta name="description" content={t('privacy.meta.description')} />
      </Head>
      
        <MainContent>
          <LegalHeader 
            title={t('privacy.header.title')} 
            description={t('privacy.header.description')}
            lastUpdated={t('privacy.header.lastUpdatedDate')}
          />
          <PrivacyContent />
        </MainContent>
    </>
  );
};

export default Privacy;