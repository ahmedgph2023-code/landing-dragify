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
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
  
  a {
    color: ${({ theme }) => theme.colors.accent.blue};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PrivacyContent = () => {
  const { t } = useLocalization();

  const personalList: string[] = t('privacy.sections.info.personal.list') || [];
  const usageList: string[] = t('privacy.sections.info.usage.list') || [];
  const useList: string[] = t('privacy.sections.use.list') || [];
  const rightsList: string[] = t('privacy.sections.rights.list') || [];
  const shareList = t('privacy.sections.share.list') || {};

  return (
    <ContentSection>
      <Container>
        <Content>
          <h2>{t('privacy.sections.intro.title')}</h2>
          <p>{t('privacy.sections.intro.p1')}</p>
          <p>{t('privacy.sections.intro.p2')}</p>

          <h2>{t('privacy.sections.info.title')}</h2>
          <h3>{t('privacy.sections.info.personal.title')}</h3>
          <p>{t('privacy.sections.info.personal.p')}</p>
          <ul>
            {personalList.map((item, idx) => (
              <li key={`personal-${idx}`}>{item}</li>
            ))}
          </ul>

          <h3>{t('privacy.sections.info.usage.title')}</h3>
          <p>{t('privacy.sections.info.usage.p')}</p>
          <ul>
            {usageList.map((item, idx) => (
              <li key={`usage-${idx}`}>{item}</li>
            ))}
          </ul>

          <h3>{t('privacy.sections.info.userContent.title')}</h3>
          <p>{t('privacy.sections.info.userContent.p')}</p>

          <h2>{t('privacy.sections.use.title')}</h2>
          <p>{t('privacy.sections.use.p')}</p>
          <ul>
            {useList.map((item, idx) => (
              <li key={`use-${idx}`}>{item}</li>
            ))}
          </ul>

          <h2>{t('privacy.sections.share.title')}</h2>
          <p>{t('privacy.sections.share.p')}</p>
          <ul>
            {['serviceProviders', 'businessTransfers', 'consent', 'legal'].map((k) => (
              <li key={`share-${k}`}>{shareList?.[k]}</li>
            ))}
          </ul>

          <h2>{t('privacy.sections.security.title')}</h2>
          <p>{t('privacy.sections.security.p')}</p>

          <h2>{t('privacy.sections.rights.title')}</h2>
          <p>{t('privacy.sections.rights.p')}</p>
          <ul>
            {rightsList.map((item, idx) => (
              <li key={`rights-${idx}`}>{item}</li>
            ))}
          </ul>
          <p>{t('privacy.sections.rights.contact')}</p>

          <h2>{t('privacy.sections.cookies.title')}</h2>
          <p>{t('privacy.sections.cookies.p')}</p>

          <h2>{t('privacy.sections.transfers.title')}</h2>
          <p>{t('privacy.sections.transfers.p')}</p>

          <h2>{t('privacy.sections.children.title')}</h2>
          <p>{t('privacy.sections.children.p')}</p>

          <h2>{t('privacy.sections.changes.title')}</h2>
          <p>{t('privacy.sections.changes.p')}</p>

          <h2>{t('privacy.sections.contact.title')}</h2>
          <p>{t('privacy.sections.contact.p')}</p>
        </Content>
      </Container>
    </ContentSection>
  );
};

export default PrivacyContent;