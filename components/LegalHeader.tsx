import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';

interface LegalHeaderProps {
  title: string;
  description?: string;
  lastUpdated?: string;
}

const HeaderSection = styled.section`
  padding: 8rem 0 4rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const LastUpdated = styled(motion.p)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
`;

const LegalHeader: React.FC<LegalHeaderProps> = ({ title, description, lastUpdated }) => {
  const { t } = useLocalization();
  return (
    <HeaderSection>
      <Container>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </Title>
        
        {description && (
          <Description
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {description}
          </Description>
        )}
        
        {lastUpdated && (
          <LastUpdated
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('legal.lastUpdatedLabel')} {lastUpdated}
          </LastUpdated>
        )}
      </Container>
    </HeaderSection>
  );
};

export default LegalHeader;