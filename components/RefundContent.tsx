import React from 'react';
import styled from 'styled-components';
import { useLocalization } from '../context/LocalizationContext';

const ContentSection = styled.section`
  padding: 4rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.8;

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 2.5rem 0 1rem;

    &:first-child {
      margin-top: 0;
    }
  }

  p {
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  ul {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
`;

const RefundContent = () => {
  const { t } = useLocalization();

  const eligibilityList: string[] = t('refund.sections.eligibility.list') || [];
  const nonRefundableList: string[] = t('refund.sections.nonRefundable.list') || [];
  const requestList: string[] = t('refund.sections.howToRequest.list') || [];

  return (
    <ContentSection>
      <Container>
        <Content>
          <h2>{t('refund.sections.intro.title')}</h2>
          <p>{t('refund.sections.intro.p1')}</p>
          <p>{t('refund.sections.intro.p2')}</p>

          <h2>{t('refund.sections.eligibility.title')}</h2>
          <p>{t('refund.sections.eligibility.p')}</p>
          <ul>
            {eligibilityList.map((item, idx) => (
              <li key={`refund-eligibility-${idx}`}>{item}</li>
            ))}
          </ul>

          <h2>{t('refund.sections.nonRefundable.title')}</h2>
          <p>{t('refund.sections.nonRefundable.p')}</p>
          <ul>
            {nonRefundableList.map((item, idx) => (
              <li key={`refund-nonrefundable-${idx}`}>{item}</li>
            ))}
          </ul>

          <h2>{t('refund.sections.billingErrors.title')}</h2>
          <p>{t('refund.sections.billingErrors.p')}</p>

          <h2>{t('refund.sections.howToRequest.title')}</h2>
          <p>{t('refund.sections.howToRequest.p')}</p>
          <ul>
            {requestList.map((item, idx) => (
              <li key={`refund-request-${idx}`}>{item}</li>
            ))}
          </ul>

          <h2>{t('refund.sections.timing.title')}</h2>
          <p>{t('refund.sections.timing.p')}</p>

          <h2>{t('refund.sections.gateway.title')}</h2>
          <p>{t('refund.sections.gateway.p')}</p>

          <h2>{t('refund.sections.chargebacks.title')}</h2>
          <p>{t('refund.sections.chargebacks.p')}</p>

          <h2>{t('refund.sections.cancellations.title')}</h2>
          <p>{t('refund.sections.cancellations.p')}</p>

          <h2>{t('refund.sections.changes.title')}</h2>
          <p>{t('refund.sections.changes.p')}</p>

          <h2>{t('refund.sections.contact.title')}</h2>
          <p>{t('refund.sections.contact.p')}</p>
        </Content>
      </Container>
    </ContentSection>
  );
};

export default RefundContent;
