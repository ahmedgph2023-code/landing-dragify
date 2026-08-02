import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocalization } from '@/context/LocalizationContext';

const Section = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.cardBackground};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionLabel = styled(motion.span)`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.accent.blue};
  margin-bottom: 1rem;
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;
  
  @media (max-width: 868px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ConnectorLine = styled.div`
  position: absolute;
  top: 60px;
  left: calc(16.67% + 40px);
  right: calc(16.67% + 40px);
  height: 2px;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.accent.blue}, 
    ${({ theme }) => theme.colors.accent.purple}
  );
  
  @media (max-width: 868px) {
    display: none;
  }
`;

const StepCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.accent.blue}, 
    ${({ theme }) => theme.colors.accent.purple}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px ${({ theme }) => theme.colors.accent.blue}30;
`;

const NumberText = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: white;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  max-width: 280px;
`;

const StepIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  opacity: 0.1;
  
  svg {
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const HowItWorks = () => {
   const { t } = useLocalization();
  const steps = [
    {
      number: 1,
      title: t('howItWorks.steps.0.title'),
      description: t('howItWorks.steps.0.description'),
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    },
    {
      number: 2,
      title: t('howItWorks.steps.1.title'),
      description: t('howItWorks.steps.1.description'),
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/>
        </svg>
      )
    },
    {
      number: 3,
      title: t('howItWorks.steps.2.title'),
      description: t('howItWorks.steps.2.description'),
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )
    }
  ];

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionLabel
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('howItWorks.sectionLabel')}
          </SectionLabel>
          <Title
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('howItWorks.title')}
          </Title>
        </SectionHeader>

        <StepsContainer>
          <ConnectorLine />
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <StepNumber>
                <NumberText>{step.number}</NumberText>
              </StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsContainer>
      </Container>
    </Section>
  );
};

export default HowItWorks;