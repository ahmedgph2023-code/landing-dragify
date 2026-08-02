import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 5rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
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

const UseCasesSection = styled.section`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 5rem 1.5rem;
`;

const UseCasesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const UseCasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UseCaseCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
`;

const UseCaseTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UseCaseIcon = styled.span`
  font-size: 1.5rem;
`;

const UseCaseDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.7;
`;

const ArchitectureSection = styled.section`
  padding: 5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ArchitectureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ArchitectureCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
`;

const ArchitectureNumber = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}20, ${({ theme }) => theme.colors.accent.purple}20);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent.blue};
`;

const ArchitectureTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const ArchitectureDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const MultiAgentOrchestration = () => {
   const { t } = useLocalization();
  return (
    <>
      <Head>
         <title>{t("multiAgentOrchestration.meta.title")}</title>
         <meta
         name="description"
         content={t("multiAgentOrchestration.meta.description")}
         />
         <meta
         property="og:title"
         content={t("multiAgentOrchestration.meta.title")}
         />
         <meta
         property="og:description"
         content={t("multiAgentOrchestration.meta.description")}
         />
         <meta property="og:type" content="website" />
         <meta name="twitter:card" content="summary_large_image" />
         <meta
         name="twitter:title"
         content={t("multiAgentOrchestration.meta.title")}
         />
         <meta
         name="twitter:description"
         content={t("multiAgentOrchestration.meta.description")}
         />
      </Head>
        <PageContainer>
          <HeroSection>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t("multiAgentOrchestration.hero.title")}
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
               {t("multiAgentOrchestration.hero.subtitle")}
            </HeroSubtitle>
          </HeroSection>
          
          <ContentSection>
            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
               {t("multiAgentOrchestration.intro.description")}
            </Description>
            
            <ImageGrid>
               {[0, 1, 2].map((i) => (
                  <ImageCard
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -8 }}
                  >
                  <ImageWrapper>
                     <img
                        src={[
                        "/images/services/multiple_ai_agents_collaborating.png",
                        "/images/services/ai_orchestration_network_visualization.png",
                        "/images/services/ai_teamwork_harmony_concept.png",
                        ][i]}
                        alt={t(`multiAgentOrchestration.imageCards.${i}.title`)}
                     />
                  </ImageWrapper>
                  <ImageCaption>
                     <h3>{t(`multiAgentOrchestration.imageCards.${i}.title`)}</h3>
                     <p>{t(`multiAgentOrchestration.imageCards.${i}.description`)}</p>
                  </ImageCaption>
                  </ImageCard>
               ))}
            </ImageGrid>
            
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t("multiAgentOrchestration.capabilities.title")}
            </SectionTitle>
            <SectionSubtitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("multiAgentOrchestration.capabilities.title")}
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
                    <circle cx="12" cy="12" r="3"/>
                    <circle cx="19" cy="5" r="2"/>
                    <circle cx="5" cy="5" r="2"/>
                    <circle cx="19" cy="19" r="2"/>
                    <circle cx="5" cy="19" r="2"/>
                    <path d="M12 9V5M12 19v-4M9 12H5M19 12h-4"/>
                  </svg>
                </FeatureIcon>
                <FeatureTitle>{t(`multiAgentOrchestration.capabilities.features.0.title`)}</FeatureTitle>
                <FeatureDescription>
                  {t(`multiAgentOrchestration.capabilities.features.0.description`)}
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
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                </FeatureIcon>
                <FeatureTitle>{t(`multiAgentOrchestration.capabilities.features.1.title`)}</FeatureTitle>
                <FeatureDescription>
                  {t(`multiAgentOrchestration.capabilities.features.1.description`)}
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </FeatureIcon>
                <FeatureTitle>{t(`multiAgentOrchestration.capabilities.features.2.title`)}</FeatureTitle>
                <FeatureDescription>
                  {t(`multiAgentOrchestration.capabilities.features.2.description`)}
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </ContentSection>
          
          <UseCasesSection>
            <UseCasesContainer>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t("multiAgentOrchestration.useCases.title")}
              </SectionTitle>
              <SectionSubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t("multiAgentOrchestration.useCases.subtitle")}
              </SectionSubtitle>
              
              <UseCasesGrid>
                <UseCaseCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <UseCaseTitle>
                    <UseCaseIcon>🛒</UseCaseIcon>
                    {t(`multiAgentOrchestration.useCases.items.0.title`)}
                  </UseCaseTitle>
                  <UseCaseDescription>
                    {t(`multiAgentOrchestration.useCases.items.0.description`)}
                  </UseCaseDescription>
                </UseCaseCard>
                
                <UseCaseCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <UseCaseTitle>
                    <UseCaseIcon>🛒</UseCaseIcon>
                    {t(`multiAgentOrchestration.useCases.items.1.title`)}
                  </UseCaseTitle>
                  <UseCaseDescription>
                    {t(`multiAgentOrchestration.useCases.items.1.description`)}
                  </UseCaseDescription>
                </UseCaseCard>
                
                <UseCaseCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <UseCaseTitle>
                    <UseCaseIcon>🛒</UseCaseIcon>
                    {t(`multiAgentOrchestration.useCases.items.2.title`)}
                  </UseCaseTitle>
                  <UseCaseDescription>
                    {t(`multiAgentOrchestration.useCases.items.2.description`)}
                  </UseCaseDescription>
                </UseCaseCard>
                
                <UseCaseCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <UseCaseTitle>
                    <UseCaseIcon>🛒</UseCaseIcon>
                    {t(`multiAgentOrchestration.useCases.items.3.title`)}
                  </UseCaseTitle>
                  <UseCaseDescription>
                    {t(`multiAgentOrchestration.useCases.items.3.description`)}
                  </UseCaseDescription>
                </UseCaseCard>
              </UseCasesGrid>
            </UseCasesContainer>
          </UseCasesSection>
          
          <ArchitectureSection>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t("multiAgentOrchestration.architecture.title")}
            </SectionTitle>
            <SectionSubtitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("multiAgentOrchestration.architecture.subtitle")}
            </SectionSubtitle>
            
            <ArchitectureGrid>
              <ArchitectureCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <ArchitectureNumber>1</ArchitectureNumber>
                <ArchitectureTitle>{t(`multiAgentOrchestration.architecture.layers.0.title`)}</ArchitectureTitle>
                <ArchitectureDescription>
                  {t(`multiAgentOrchestration.architecture.layers.0.description`)}
                </ArchitectureDescription>
              </ArchitectureCard>
              
              <ArchitectureCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ArchitectureNumber>2</ArchitectureNumber>
                <ArchitectureTitle>{t(`multiAgentOrchestration.architecture.layers.1.title`)}</ArchitectureTitle>
                <ArchitectureDescription>
                  {t(`multiAgentOrchestration.architecture.layers.1.description`)}
                </ArchitectureDescription>
              </ArchitectureCard>
              
              <ArchitectureCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ArchitectureNumber>3</ArchitectureNumber>
                <ArchitectureTitle>{t(`multiAgentOrchestration.architecture.layers.2.title`)}</ArchitectureTitle>
                <ArchitectureDescription>
                  {t(`multiAgentOrchestration.architecture.layers.2.description`)}
                </ArchitectureDescription>
              </ArchitectureCard>
            </ArchitectureGrid>
          </ArchitectureSection>
        </PageContainer>
    </>
  );
};

export default MultiAgentOrchestration;
