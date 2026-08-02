import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';

export default function Agents() {
  const { t } = useLocalization();
  
  return (
    <AgentsSection>
      <Container>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Title>{t('agents.title')}</Title>
            <Description>
              {t('agents.description')}
            </Description>
          </motion.div>
        </SectionHeader>
        
        <AgentsGrid>
          <AgentCard
            {...animationProps}
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={CardVariants}
            whileHover="hover"
          >
            <AgentIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/>
              </svg>
            </AgentIcon>
            <AgentTitle>{t('agents.items.0.title')}</AgentTitle>
            <AgentDescription>
              {t('agents.items.0.description')}
            </AgentDescription>
            {/* <TagsContainer>
              {t('agents.items.0.tags').map((tag: any, index: any) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer> */}
          </AgentCard>
          
          <AgentCard
            {...animationProps}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={CardVariants}
            whileHover="hover"
          >
            <AgentIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5"/>
              </svg>
            </AgentIcon>
            <AgentTitle>{t('agents.items.1.title')}</AgentTitle>
            <AgentDescription>
              {t('agents.items.1.description')}
            </AgentDescription>
            {/* <TagsContainer>
              {t('agents.items.1.tags').map((tag: any, index: any) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer> */}
          </AgentCard>
          
          <AgentCard
            {...animationProps}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={CardVariants}
            whileHover="hover"
          >
            <AgentIcon>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H16L19 6V19C19 20.1046 18.1046 21 17 21H18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </AgentIcon>
            <AgentTitle>{t('agents.items.2.title')}</AgentTitle>
            <AgentDescription>
              {t('agents.items.2.description')}
            </AgentDescription>
            {/* <TagsContainer>
              {t('agents.items.2.tags').map((tag: any, index: any) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer> */}
          </AgentCard>
          
          <AgentCard
            {...animationProps}
            transition={{ duration: 0.5, delay: 0.4 }}
            variants={CardVariants}
            whileHover="hover"
          >
            <AgentIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/>
              </svg>
            </AgentIcon>
            <AgentTitle>{t('agents.items.3.title')}</AgentTitle>
            <AgentDescription>
              {t('agents.items.3.description')}
            </AgentDescription>
            {/* <TagsContainer>
              {t('agents.items.3.tags').map((tag: any, index: any) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer> */}
          </AgentCard>
          
          <AgentCard
            {...animationProps}
            transition={{ duration: 0.5, delay: 0.5 }}
            variants={CardVariants}
            whileHover="hover"
          >
            <AgentIcon>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </AgentIcon>
            <AgentTitle>{t('agents.items.4.title')}</AgentTitle>
            <AgentDescription>
              {t('agents.items.4.description')}
            </AgentDescription>
            {/* <TagsContainer>
              {t('agents.items.4.tags').map((tag: any, index: any) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer> */}
          </AgentCard>
          
          <AgentCard
            {...animationProps}
            transition={{ duration: 0.5, delay: 0.6 }}
            variants={CardVariants}
            whileHover="hover"
          >
            <AgentIcon>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.45 5.11L2 12V19C2 19.5304 2.21071 20.0391 2.58579 20.4142C2.96086 20.7893 3.46957 21 4 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11V5.11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 16H6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 16H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </AgentIcon>
            <AgentTitle>{t('agents.items.5.title')}</AgentTitle>
            <AgentDescription>
              {t('agents.items.5.description')}
            </AgentDescription>
            {/* <TagsContainer>
              {t('agents.items.5.tags').map((tag: any, index: any) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer> */}
          </AgentCard>
        </AgentsGrid>
      </Container>
    </AgentsSection>
  );
};

const AgentsSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 700px;
  margin: 0 auto;
`;

const AgentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AgentCard = styled(motion.div)`
  padding: 2rem;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AgentIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AgentTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AgentDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const Tag = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:nth-child(3n+1) {
    background-color: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
  }
  
  &:nth-child(3n+2) {
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }
  
  &:nth-child(3n+3) {
    background-color: rgba(155, 89, 182, 0.1);
    color: #9b59b6;
  }
`;

const animationProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const CardVariants = {
  hover: {
    y: -10,
    boxShadow: '0 16px 30px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3
    }
  }
};