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

const BenefitsSection = styled.section`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 5rem 1.5rem;
`;

const BenefitsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const BenefitIcon = styled.div`
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

const BenefitContent = styled.div`
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

const HowItWorksSection = styled.section`
  padding: 5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StepsGrid = styled.div`
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

const StepCard = styled(motion.div)`
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
`;

const StepTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const CustomAIAgents = () => {
   const { t } = useLocalization();
  return (
    <>
      <Head>
        <title>{t("customAgents.meta.title")}</title>
        <meta
          name="description"
          content={t("customAgents.meta.description")}
        />
        <meta property="og:title" content={t("customAgents.meta.title")} />
        <meta
          property="og:description"
          content={t("customAgents.meta.description")}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("customAgents.meta.title")} />
        <meta
          name="twitter:description"
          content={t("customAgents.meta.description")}
        />
      </Head>

      <PageContainer>
        {/* HERO */}
        <HeroSection>
          <HeroTitle>{t("customAgents.hero.title")}</HeroTitle>
          <HeroSubtitle>{t("customAgents.hero.subtitle")}</HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <Description>{t("customAgents.intro.description")}</Description>

          {/* IMAGE CARDS */}
          <ImageGrid>
            <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -8 }}
              >
              <ImageWrapper>
                <img
                  src="/images/services/ai_agent_working_autonomously.png"
                  alt={t("customAgents.imageCards.0.title")}
                />
              </ImageWrapper>
              <ImageCaption>
                <h3>{t("customAgents.imageCards.0.title")}</h3>
                <p>{t("customAgents.imageCards.0.description")}</p>
              </ImageCaption>
            </ImageCard>

            <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -8 }}
              >
              <ImageWrapper>
                <img
                  src="/images/services/ai_neural_network_decision_making.png"
                  alt={t("customAgents.imageCards.1.title")}
                />
              </ImageWrapper>
              <ImageCaption>
                <h3>{t("customAgents.imageCards.1.title")}</h3>
                <p>{t("customAgents.imageCards.1.description")}</p>
              </ImageCaption>
            </ImageCard>

            <ImageCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -8 }}
              >
              <ImageWrapper>
                <img
                  src="/images/services/ai_automation_building_solutions.png"
                  alt={t("customAgents.imageCards.2.title")}
                />
              </ImageWrapper>
              <ImageCaption>
                <h3>{t("customAgents.imageCards.2.title")}</h3>
                <p>{t("customAgents.imageCards.2.description")}</p>
              </ImageCaption>
            </ImageCard>
          </ImageGrid>

          {/* FEATURES */}
          <SectionTitle>{t("customAgents.features.title")}</SectionTitle>
          <SectionSubtitle>{t("customAgents.features.subtitle")}</SectionSubtitle>

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
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </FeatureIcon>
              <FeatureTitle>
                {t("customAgents.features.items.0.title")}
              </FeatureTitle>
              <FeatureDescription>
                {t("customAgents.features.items.0.description")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
              <FeatureIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </FeatureIcon>
              <FeatureTitle>
                {t("customAgents.features.items.1.title")}
              </FeatureTitle>
              <FeatureDescription>
                {t("customAgents.features.items.1.description")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
              <FeatureIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </FeatureIcon>
              <FeatureTitle>
                {t("customAgents.features.items.2.title")}
              </FeatureTitle>
              <FeatureDescription>
                {t("customAgents.features.items.2.description")}
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </ContentSection>

        {/* BENEFITS */}
        <BenefitsSection>
          <BenefitsContainer>
            <SectionTitle>{t("customAgents.benefits.title")}</SectionTitle>
            <SectionSubtitle>{t("customAgents.benefits.subtitle")}</SectionSubtitle>

            <BenefitsList>
              <BenefitItem
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                <BenefitIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </BenefitIcon> 
                <BenefitContent>
                  <h4>{t("customAgents.benefits.items.0.title")}</h4>
                  <p>{t("customAgents.benefits.items.0.description")}</p>
                </BenefitContent>
              </BenefitItem>

              <BenefitItem
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                <BenefitIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </BenefitIcon>
                <BenefitContent>
                  <h4>{t("customAgents.benefits.items.1.title")}</h4>
                  <p>{t("customAgents.benefits.items.1.description")}</p>
                </BenefitContent>
              </BenefitItem>

              <BenefitItem
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                <BenefitIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </BenefitIcon>
                <BenefitContent>
                  <h4>{t("customAgents.benefits.items.2.title")}</h4>
                  <p>{t("customAgents.benefits.items.2.description")}</p>
                </BenefitContent>
              </BenefitItem>

              <BenefitItem
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                <BenefitIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </BenefitIcon>
                <BenefitContent>
                  <h4>{t("customAgents.benefits.items.3.title")}</h4>
                  <p>{t("customAgents.benefits.items.3.description")}</p>
                </BenefitContent>
              </BenefitItem>
            </BenefitsList>
          </BenefitsContainer>
        </BenefitsSection>

        {/* HOW IT WORKS */}
        <HowItWorksSection>
          <SectionTitle>{t("customAgents.steps.title")}</SectionTitle>
          <SectionSubtitle>{t("customAgents.steps.subtitle")}</SectionSubtitle>

          <StepsGrid>
            <StepCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
              <StepNumber>1</StepNumber>
              <StepTitle>{t("customAgents.steps.items.0.title")}</StepTitle>
              <StepDescription>
                {t("customAgents.steps.items.0.description")}
              </StepDescription>
            </StepCard>

            <StepCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
              <StepNumber>2</StepNumber>
              <StepTitle>{t("customAgents.steps.items.1.title")}</StepTitle>
              <StepDescription>
                {t("customAgents.steps.items.1.description")}
              </StepDescription>
            </StepCard>

            <StepCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
              <StepNumber>3</StepNumber>
              <StepTitle>{t("customAgents.steps.items.2.title")}</StepTitle>
              <StepDescription>
                {t("customAgents.steps.items.2.description")}
              </StepDescription>
            </StepCard>

            <StepCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
              <StepNumber>4</StepNumber>
              <StepTitle>{t("customAgents.steps.items.3.title")}</StepTitle>
              <StepDescription>
                {t("customAgents.steps.items.3.description")}
              </StepDescription>
            </StepCard>
          </StepsGrid>
        </HowItWorksSection>
      </PageContainer>
    </>
  );
};

export default CustomAIAgents;
