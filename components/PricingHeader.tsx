import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';

const PricingHeaderSection = styled.section`
  padding: 8rem 0 4rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 700px;
  margin: 0 auto 3rem;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const PricingToggle = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
`;

const ToggleText = styled.span<{ $active: boolean }>`
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active, theme }) => ($active ? theme.colors.text.primary : theme.colors.text.secondary)};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const ToggleSwitch = styled.div`
  width: 60px;
  height: 30px;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.accent.blue}, 
    ${({ theme }) => theme.colors.accent.purple}
  );
  margin: 0 1rem;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  padding: 2px;
`;

const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  left: ${({ $active }) => ($active ? 'calc(100% - 28px)' : '2px')};
  transition: left 0.3s ease;
`;

const PricingHeader = () => {
  const [isAnnual, setIsAnnual] = React.useState(true);
  const { t } = useLocalization();
  
  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };
  
  return (
    <PricingHeaderSection>
      <Container>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('pricing.header.title')}
        </Title>
        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t('pricing.header.description')}
        </Description>
        
        <PricingToggle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ToggleText $active={!isAnnual} onClick={togglePricing}>
            {t('pricing.header.monthly')}
          </ToggleText>
          <ToggleSwitch onClick={togglePricing}>
            <ToggleKnob $active={isAnnual} />
          </ToggleSwitch>
          <ToggleText $active={isAnnual} onClick={togglePricing}>
            {t('pricing.header.annually')} <span style={{ color: '#10b981' }}>{t('pricing.header.save')}</span>
          </ToggleText>
        </PricingToggle>
      </Container>
    </PricingHeaderSection>
  );
};

export default PricingHeader;