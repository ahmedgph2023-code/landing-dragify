import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { useLocalization } from '@/context/LocalizationContext';

const PageContainer = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeroSection = styled.section`
  padding: 10rem 1.5rem 4rem;
  text-align: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.background} 0%, 
    ${({ theme }) => theme.colors.cardBackground} 100%);
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ContentSection = styled.section`
  padding: 4rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  max-width: 900px;
  margin: 0 auto 4rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 5rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ImageCard = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ImageCaption = styled.div`
  padding: 1.5rem;
  text-align: center;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.5;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.7;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 5rem;
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 568px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FeaturesSection = styled.section`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 5rem 1.5rem;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
`;

const FeatureIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const TimelineSection = styled.section`
  padding: 5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 40px;
    left: 16.66%;
    right: 16.66%;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
    border-radius: 2px;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TimelineItem = styled(motion.div)`
  text-align: center;
  position: relative;
  z-index: 1;
`;

const TimelineNumber = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.3);
`;

const TimelineTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const TimelineDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const ComparisonSection = styled.section`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 5rem 1.5rem;
`;

const ComparisonContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const ComparisonTable = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
`;

const ComparisonRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  
  ${({ $header, theme }) => $header && `
    background-color: ${theme.colors.cardBackground};
    font-weight: 600;
  `}
`;

const ComparisonCell = styled.div<{ $highlight?: boolean }>`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.95rem;
  
  ${({ $highlight, theme }) => $highlight && `
    background: linear-gradient(135deg, ${theme.colors.accent.blue}10, ${theme.colors.accent.purple}10);
    color: ${theme.colors.accent.blue};
    font-weight: 600;
  `}
  
  &:last-child {
    border-bottom: none;
  }
`;

const DeployFast = () => {
   const { t } = useLocalization();
  return (
    <>
      <Head>
         <title>{t('deployOneClick.meta.title')}</title>
         <meta name="description" content={t('deployOneClick.meta.description')} />
         <meta property="og:title" content={t('deployOneClick.meta.title')} />
         <meta property="og:description" content={t('deployOneClick.meta.description')} />
         <meta property="og:type" content="website" />
         <meta name="twitter:card" content="summary_large_image" />
         <meta name="twitter:title" content={t('deployOneClick.meta.title')} />
         <meta name="twitter:description" content={t('deployOneClick.meta.description')} />
      </Head>
      
        <PageContainer>
          <HeroSection>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('deployOneClick.hero.title')}
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('deployOneClick.hero.subtitle')}
            </HeroSubtitle>
          </HeroSection>
          
          <ContentSection>
            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t('deployOneClick.intro.description')}
            </Description>
            
            <ImageGrid>
              <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -8 }}
              >
                <ImageWrapper>
                  <img src="/images/services/one-click_launch_deployment.png" alt="One-Click Launch Deployment" />
                </ImageWrapper>
                <ImageCaption>
                  <h3>{t('deployOneClick.imageCards.0.title')}</h3>
                  <p>{t('deployOneClick.imageCards.0.description')}</p>
                </ImageCaption>
              </ImageCard>
              
              <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <ImageWrapper>
                  <img src="/images/services/fast_deployment_dashboard_interface.png" alt="Fast Deployment Dashboard" />
                </ImageWrapper>
                <ImageCaption>
                  <h3>{t('deployOneClick.imageCards.1.title')}</h3>
                  <p>{t('deployOneClick.imageCards.1.description')}</p>
                </ImageCaption>
              </ImageCard>
              
              <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -8 }}
              >
                <ImageWrapper>
                  <img src="/images/services/workflow_instant_transformation.png" alt="Workflow Instant Transformation" />
                </ImageWrapper>
                <ImageCaption>
                  <h3>{t('deployOneClick.imageCards.2.title')}</h3>
                  <p>{t('deployOneClick.imageCards.2.description')}</p>
                </ImageCaption>
              </ImageCard>
            </ImageGrid>
            
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t('deployOneClick.speed.title')}
            </SectionTitle>
            <SectionSubtitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t('deployOneClick.speed.subtitle')}
            </SectionSubtitle>
            
            <StatsGrid>
              <StatCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <StatNumber>{t('deployOneClick.stats.0.number')}</StatNumber>
                <StatLabel>{t('deployOneClick.stats.0.label')}</StatLabel>
              </StatCard>
              
              <StatCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StatNumber>{t('deployOneClick.stats.1.number')}</StatNumber>
                <StatLabel>{t('deployOneClick.stats.1.label')}</StatLabel>
              </StatCard>
              
              <StatCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StatNumber>{t('deployOneClick.stats.2.number')}</StatNumber>
                <StatLabel>{t('deployOneClick.stats.2.label')}</StatLabel>
              </StatCard>
              
              <StatCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StatNumber>{t('deployOneClick.stats.3.number')}</StatNumber>
                <StatLabel>{t('deployOneClick.stats.3.label')}</StatLabel>
              </StatCard>
            </StatsGrid>
          </ContentSection>
          
          <FeaturesSection>
            <FeaturesContainer>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t('deployOneClick.features.title')}
              </SectionTitle>
              <SectionSubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('deployOneClick.features.subtitle')}
              </SectionSubtitle>
              
              <FeaturesGrid>
                <FeatureCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <FeatureIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>{t('deployOneClick.features.items.0.title')}</FeatureTitle>
                    <FeatureDescription>
                      {t('deployOneClick.features.items.0.description')}
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureCard>
                
                <FeatureCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <FeatureIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>{t('deployOneClick.features.items.1.title')}</FeatureTitle>
                    <FeatureDescription>
                      {t('deployOneClick.features.items.1.description')}
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureCard>
                
                <FeatureCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <FeatureIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>{t('deployOneClick.features.items.2.title')}</FeatureTitle>
                    <FeatureDescription>
                      {t('deployOneClick.features.items.1.description')}
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureCard>
                
                <FeatureCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <FeatureIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>{t('deployOneClick.features.items.3.title')}</FeatureTitle>
                    <FeatureDescription>
                      {t('deployOneClick.features.items.0.description')}
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureCard>
              </FeaturesGrid>
            </FeaturesContainer>
          </FeaturesSection>
          
          <TimelineSection>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t('deployOneClick.timeline.title')}
            </SectionTitle>
            <SectionSubtitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t('deployOneClick.timeline.subtitle')}
            </SectionSubtitle>
            
            <TimelineGrid>
              <TimelineItem
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <TimelineNumber>1</TimelineNumber>
                <TimelineTitle>{t('deployOneClick.timeline.items.0.title')}</TimelineTitle>
                <TimelineDescription>
                  {t('deployOneClick.timeline.items.0.description')}
                </TimelineDescription>
              </TimelineItem>
              
              <TimelineItem
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TimelineNumber>2</TimelineNumber>
                <TimelineTitle>{t('deployOneClick.timeline.items.1.title')}</TimelineTitle>
                <TimelineDescription>
                  {t('deployOneClick.timeline.items.1.description')}
                </TimelineDescription>
              </TimelineItem>
              
              <TimelineItem
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TimelineNumber>3</TimelineNumber>
                <TimelineTitle>{t('deployOneClick.timeline.items.2.title')}</TimelineTitle>
                <TimelineDescription>
                  {t('deployOneClick.timeline.items.2.description')}
                </TimelineDescription>
              </TimelineItem>
            </TimelineGrid>
          </TimelineSection>
          
          <ComparisonSection>
            <ComparisonContainer>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t('deployOneClick.comparison.title')}
              </SectionTitle>
              <SectionSubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('deployOneClick.comparison.subtitle')}
              </SectionSubtitle>
              
              <ComparisonTable
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ComparisonRow $header>
                  <ComparisonCell>{t('deployOneClick.comparison.table.headers.0')}</ComparisonCell>
                  <ComparisonCell>{t('deployOneClick.comparison.table.headers.1')}</ComparisonCell>
                  <ComparisonCell $highlight>{t('deployOneClick.comparison.table.headers.2')}</ComparisonCell>
                </ComparisonRow>
                <ComparisonRow>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.0.0')}</ComparisonCell>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.0.1')}</ComparisonCell>
                  <ComparisonCell $highlight>{t('deployOneClick.comparison.table.rows.0.2')}</ComparisonCell>
                </ComparisonRow>
                <ComparisonRow>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.1.0')}</ComparisonCell>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.1.1')}</ComparisonCell>
                  <ComparisonCell $highlight>{t('deployOneClick.comparison.table.rows.1.2')}</ComparisonCell>
                </ComparisonRow>
                <ComparisonRow>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.2.0')}</ComparisonCell>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.2.1')}</ComparisonCell>
                  <ComparisonCell $highlight>{t('deployOneClick.comparison.table.rows.2.2')}</ComparisonCell>
                </ComparisonRow>
                <ComparisonRow>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.3.0')}</ComparisonCell>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.3.1')}</ComparisonCell>
                  <ComparisonCell $highlight>{t('deployOneClick.comparison.table.rows.3.2')}</ComparisonCell>
                </ComparisonRow>
                <ComparisonRow>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.4.0')}</ComparisonCell>
                  <ComparisonCell>{t('deployOneClick.comparison.table.rows.4.1')}</ComparisonCell>
                  <ComparisonCell $highlight>{t('deployOneClick.comparison.table.rows.4.2')}</ComparisonCell>
                </ComparisonRow>
              </ComparisonTable>
            </ComparisonContainer>
          </ComparisonSection>
        </PageContainer>
    </>
  );
};

export default DeployFast;
