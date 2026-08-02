import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import LegalHeader from '../components/LegalHeader';
import RefundContent from '../components/RefundContent';
import { useLocalization } from '../context/LocalizationContext';

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
`;

const Refund = () => {
  const { t } = useLocalization();

  return (
    <>
      <Head>
        <title>{t('refund.meta.title')}</title>
        <meta name="description" content={t('refund.meta.description')} />
      </Head>

      <MainContent>
        <LegalHeader
          title={t('refund.header.title')}
          description={t('refund.header.description')}
          lastUpdated={t('refund.header.lastUpdatedDate')}
        />
        <RefundContent />
      </MainContent>
    </>
  );
};

export default Refund;
