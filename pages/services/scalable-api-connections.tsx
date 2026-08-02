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

const IntegrationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 5rem;
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 568px) {
    grid-template-columns: 1fr;
  }
`;

const IntegrationCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const IntegrationIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

const IntegrationName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const IntegrationCategory = styled.p`
  font-size: 0.85rem;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
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

const CapabilitiesSection = styled.section`
  padding: 5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CapabilitiesList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CapabilityCard = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;

const CapabilityIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}20, ${({ theme }) => theme.colors.accent.purple}20);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const CapabilityContent = styled.div`
  flex: 1;
  
  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.6;
  }
`;

const ScalingSection = styled.section`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 5rem 1.5rem;
`;

const ScalingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ScalingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 568px) {
    grid-template-columns: 1fr;
  }
`;

const ScalingCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
`;

const ScalingNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const ScalingLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const ScalableAPIConnections = () => {
   const { t } = useLocalization();
  const integrations = [
    { icon: '📊', name: 'Salesforce', category: 'CRM' },
    { icon: '💬', name: 'Slack', category: 'Communication' },
    { icon: '📧', name: 'Gmail', category: 'Email' },
    { icon: '📁', name: 'Google Drive', category: 'Storage' },
    { icon: '🔧', name: 'Jira', category: 'Project Management' },
    { icon: '📈', name: 'HubSpot', category: 'Marketing' },
    { icon: '💳', name: 'Stripe', category: 'Payments' },
    { icon: '🗄️', name: 'PostgreSQL', category: 'Database' },
  ];

  return (
    <>
      <Head>
         <title>{t("scalableAPIConnections.meta.title")}</title>
         <meta
         name="description"
         content={t("scalableAPIConnections.meta.description")}
         />
         <meta property="og:title" content={t("scalableAPIConnections.meta.title")} />
         <meta
         property="og:description"
         content={t("scalableAPIConnections.meta.description")}
         />
         <meta property="og:type" content="website" />
         <meta name="twitter:card" content="summary_large_image" />
         <meta name="twitter:title" content={t("scalableAPIConnections.meta.title")} />
         <meta
         name="twitter:description"
         content={t("scalableAPIConnections.meta.description")}
         />
      </Head>
      
        <PageContainer>
          <HeroSection>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t("scalableAPIConnections.hero.title")}
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("scalableAPIConnections.hero.subtitle")}
            </HeroSubtitle>
          </HeroSection>
          
          <ContentSection>
            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
               {t("scalableAPIConnections.intro.description")}
            </Description>
            
            <ImageGrid>
              <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -8 }}
              >
                <ImageWrapper>
                  <img src="/images/services/scalable_api_network_connections.png" alt="Scalable API Network Connections" />
                </ImageWrapper>
                <ImageCaption>
                  <h3>{t("scalableAPIConnections.imageCards.0.title")}</h3>
                  <p>{t("scalableAPIConnections.imageCards.0.description")}</p>
                </ImageCaption>
              </ImageCard>
              
              <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <ImageWrapper>
                  <img src="/images/services/universal_api_integration_plug.png" alt="Universal API Integration" />
                </ImageWrapper>
                <ImageCaption>
                  <h3>{t("scalableAPIConnections.imageCards.1.title")}</h3>
                  <p>{t("scalableAPIConnections.imageCards.1.description")}</p>
                </ImageCaption>
              </ImageCard>
              
              <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -8 }}
              >
                <ImageWrapper>
                  <img src="/images/services/infinite_scalability_grid_visualization.png" alt="Infinite Scalability" />
                </ImageWrapper>
                <ImageCaption>
                  <h3>{t("scalableAPIConnections.imageCards.2.title")}</h3>
                  <p>{t("scalableAPIConnections.imageCards.2.description")}</p>
                </ImageCaption>
              </ImageCard>
            </ImageGrid>
            
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t("scalableAPIConnections.popularIntegrations.subtitle")}
            </SectionTitle>
            <SectionSubtitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("scalableAPIConnections.popularIntegrations.subtitle")}
            </SectionSubtitle>
            
            <IntegrationsGrid>
              {integrations.map((integration, index) => (
                <IntegrationCard
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <IntegrationIcon>{integration.icon}</IntegrationIcon>
                  <IntegrationName>{integration.name}</IntegrationName>
                  <IntegrationCategory>{integration.category}</IntegrationCategory>
                </IntegrationCard>
              ))}
            </IntegrationsGrid>
          </ContentSection>
          
          <FeaturesSection>
            <FeaturesContainer>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t("scalableAPIConnections.featuresSection.title")}
              </SectionTitle>
              <SectionSubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t("scalableAPIConnections.featuresSection.subtitle")}
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </FeatureIcon>
                  <FeatureTitle>{t("scalableAPIConnections.featuresSection.features.0.title")}</FeatureTitle>
                  <FeatureDescription>
                    {t("scalableAPIConnections.featuresSection.features.0.description")}
                  </FeatureDescription>
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
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                  </FeatureIcon>
                  <FeatureTitle>{t("scalableAPIConnections.featuresSection.features.1.title")}</FeatureTitle>
                  <FeatureDescription>
                    {t("scalableAPIConnections.featuresSection.features.1.description")}
                  </FeatureDescription>
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
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M3 9h18M9 21V9"/>
                    </svg>
                  </FeatureIcon>
                  <FeatureTitle>{t("scalableAPIConnections.featuresSection.features.2.title")}</FeatureTitle>
                  <FeatureDescription>
                    {t("scalableAPIConnections.featuresSection.features.2.description")}
                  </FeatureDescription>
                </FeatureCard>
              </FeaturesGrid>
            </FeaturesContainer>
          </FeaturesSection>
          
          <CapabilitiesSection>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t("scalableAPIConnections.capabilitiesSection.title")}
            </SectionTitle>
            <SectionSubtitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("scalableAPIConnections.capabilitiesSection.subtitle")}
            </SectionSubtitle>
            
            <CapabilitiesList>
              <CapabilityCard
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <CapabilityIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </CapabilityIcon>
                <CapabilityContent>
                  <h4>{t("scalableAPIConnections.capabilitiesSection.capabilities.0.title")}</h4>
                  <p>{t("scalableAPIConnections.capabilitiesSection.capabilities.0.description")}</p>
                </CapabilityContent>
              </CapabilityCard>
              
              <CapabilityCard
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CapabilityIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  </svg>
                </CapabilityIcon>
                <CapabilityContent>
                  <h4>{t("scalableAPIConnections.capabilitiesSection.capabilities.1.title")}</h4>
                  <p>{t("scalableAPIConnections.capabilitiesSection.capabilities.1.description")}</p>
                </CapabilityContent>
              </CapabilityCard>
              
              <CapabilityCard
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CapabilityIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </CapabilityIcon>
                <CapabilityContent>
                  <h4>{t("scalableAPIConnections.capabilitiesSection.capabilities.2.title")}</h4>
                  <p>{t("scalableAPIConnections.capabilitiesSection.capabilities.2.description")}</p>
                </CapabilityContent>
              </CapabilityCard>
              
              <CapabilityCard
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <CapabilityIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                </CapabilityIcon>
                <CapabilityContent>
                  <h4>{t("scalableAPIConnections.capabilitiesSection.capabilities.3.title")}</h4>
                  <p>{t("scalableAPIConnections.capabilitiesSection.capabilities.3.description")}</p>
                </CapabilityContent>
              </CapabilityCard>
              
              <CapabilityCard
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <CapabilityIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2"/>
                    <path d="M1 10h22"/>
                  </svg>
                </CapabilityIcon>
                <CapabilityContent>
                  <h4>{t("scalableAPIConnections.capabilitiesSection.capabilities.4.title")}</h4>
                  <p>{t("scalableAPIConnections.capabilitiesSection.capabilities.4.description")}</p>
                </CapabilityContent>
              </CapabilityCard>
              
              <CapabilityCard
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <CapabilityIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </CapabilityIcon>
                <CapabilityContent>
                  <h4>{t("scalableAPIConnections.capabilitiesSection.capabilities.5.title")}</h4>
                  <p>{t("scalableAPIConnections.capabilitiesSection.capabilities.5.description")}</p>
                </CapabilityContent>
              </CapabilityCard>
            </CapabilitiesList>
          </CapabilitiesSection>
          
          <ScalingSection>
            <ScalingContainer>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t("scalableAPIConnections.scalingSection.title")}
              </SectionTitle>
              <SectionSubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t("scalableAPIConnections.scalingSection.subtitle")}
              </SectionSubtitle>
              
              <ScalingGrid>
                <ScalingCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <ScalingNumber>{t("scalableAPIConnections.scalingSection.metrics.0.value")}</ScalingNumber>
                  <ScalingLabel>{t("scalableAPIConnections.scalingSection.metrics.0.label")}</ScalingLabel>
                </ScalingCard>
                
                <ScalingCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ScalingNumber>{t("scalableAPIConnections.scalingSection.metrics.1.value")}</ScalingNumber>
                  <ScalingLabel>{t("scalableAPIConnections.scalingSection.metrics.1.label")}</ScalingLabel>
                </ScalingCard>
                
                <ScalingCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <ScalingNumber>{t("scalableAPIConnections.scalingSection.metrics.2.value")}</ScalingNumber>
                  <ScalingLabel>{t("scalableAPIConnections.scalingSection.metrics.2.label")}</ScalingLabel>
                </ScalingCard>
                
                <ScalingCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <ScalingNumber>{t("scalableAPIConnections.scalingSection.metrics.3.value")}</ScalingNumber>
                  <ScalingLabel>{t("scalableAPIConnections.scalingSection.metrics.3.label")}</ScalingLabel>
                </ScalingCard>
              </ScalingGrid>
            </ScalingContainer>
          </ScalingSection>
        </PageContainer>
    </>
  );
};

export default ScalableAPIConnections;
