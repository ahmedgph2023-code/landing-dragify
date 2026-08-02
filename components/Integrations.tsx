import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';

const IntegrationsSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  max-width: 500px;
  
  @media (max-width: 992px) {
    max-width: 100%;
    text-align: center;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
`;

const IntegrationIcons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const IconBox = styled(motion.div)`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const SeeAllLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.accent.blue};
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CardWrapper = styled(motion.div)`
  flex: 1;
  max-width: 450px;
  
  @media (max-width: 992px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const IntegrationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const IntegrationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IntegrationIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const IntegrationName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ConnectionStatus = styled.div<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  gap: 0.5rem;
  
  color: ${({ $connected, theme }) => 
    $connected ? '#10b981' : theme.colors.text.primary};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ConnectButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  // cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease;
  
  /* &:hover {
    color: ${({ theme }) => theme.colors.accent.blue};
  } */
`;

const iconVariants = {
  hover: {
    y: -5,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
    },
  },
};

const Integrations = () => {
  const { t } = useLocalization();
  return (
    <IntegrationsSection>
      <Container>
        <ContentWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Title>{t('integrations.title')}</Title>
            <Description>
              {t('integrations.description')}
            </Description>
          </motion.div>
          
          <IntegrationIcons>
            <IconBox 
              variants={iconVariants} 
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                <path d="M9.35499 12.5484C8.22596 12.5484 7.25822 13.5162 7.25822 14.6452V19.871C7.25822 21 8.22596 21.9678 9.35499 21.9678C10.484 21.9678 11.4518 21 11.4518 19.871V14.6452C11.4518 13.4517 10.5485 12.5484 9.35499 12.5484Z" fill="currentColor"/>
                <path d="M2 14.6452C2 15.7742 2.96774 16.742 4.09677 16.742C5.22581 16.742 6.19355 15.7742 6.19355 14.6452V12.5484H4.12903C2.96774 12.5484 2 13.4517 2 14.6452Z" fill="currentColor"/>
                <path d="M9.35499 2C8.22596 2 7.25822 2.96774 7.25822 4.09677C7.25822 5.22581 8.22596 6.19355 9.35499 6.19355H11.4518C11.4518 5 11.4518 5.29032 11.4518 4.09677C11.4518 2.96774 10.5485 2 9.35499 2Z" fill="currentColor"/>
                <path d="M4.09677 11.4516H9.35484C10.4839 11.4516 11.4516 10.4838 11.4516 9.3548C11.4516 8.22577 10.4839 7.25803 9.35484 7.25803H4.09677C2.96774 7.25803 2 8.22577 2 9.3548C2 10.4838 2.90323 11.4516 4.09677 11.4516Z" fill="currentColor"/>
                <path d="M19.8707 7.25803C18.7416 7.25803 17.7739 8.22577 17.7739 9.3548V11.4516H19.8707C20.9997 11.4516 21.9674 10.4838 21.9674 9.3548C21.9674 8.22577 21.0319 7.25803 19.8707 7.25803Z" fill="currentColor"/>
                <path d="M12.5482 4.09677V9.35484C12.5482 10.4839 13.516 11.4516 14.645 11.4516C15.774 11.4516 16.7418 10.4839 16.7418 9.35484V4.09677C16.7418 2.96774 15.774 2 14.645 2C13.4515 2 12.5482 2.96774 12.5482 4.09677Z" fill="currentColor"/>
                <path d="M16.7418 19.9032C16.7418 18.7742 15.774 17.8065 14.645 17.8065H12.5482V19.9032C12.5482 21.0323 13.516 22 14.645 22C15.774 22 16.7418 21.0323 16.7418 19.9032Z" fill="currentColor"/>
                <path d="M19.9031 12.5484H14.645C13.516 12.5484 12.5482 13.5162 12.5482 14.6452C12.5482 15.7742 13.516 16.742 14.645 16.742H19.9031C21.0321 16.742 21.9998 15.7742 21.9998 14.6452C21.9998 13.4517 21.0321 12.5484 19.9031 12.5484Z" fill="currentColor"/>
              </svg>
            </IconBox>            
            <IconBox 
              variants={iconVariants} 
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.2581 14.2901L8.87097 3.25781H15.129L21.5484 14.2901H15.2581ZM9.87097 15.1933L6.74194 20.7417H18.871L22 15.1933H9.87097ZM8.03226 4.61265L2 15.1933L5.12903 20.7417L11.2258 10.161L8.03226 4.61265Z" fill="currentColor"/>
              </svg>
            </IconBox>
            <IconBox 
              variants={iconVariants} 
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.9032 4.03223L7 9.129L2 18.1935H6.54839L12.9032 4.03223ZM13.7419 5.25803L11.2258 12.3548L16 18.3871L6.64516 19.9677H22L13.7419 5.25803Z" fill="currentColor"/>
              </svg>
            </IconBox>
            
            <IconBox 
              variants={iconVariants} 
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M14.6253 4.49867C14.9986 4.37333 15.2493 4.37333 15.2493 4.37333L14.5026 22L3.25195 19.8747C3.25195 19.8747 4.75062 8.50134 4.75062 8.12534C4.75062 7.62666 4.75062 7.62666 5.37464 7.376C5.42904 7.376 5.57751 7.32872 5.80998 7.25472C6.11283 7.15828 6.55823 7.01647 7.12395 6.87466C7.49995 5.25066 8.75064 2 11.3746 2C11.7506 2 12.124 2.12267 12.3746 2.624H12.5C13.6253 2.624 14.2493 3.49867 14.6253 4.49867ZM11.0827 5.63556C11.5209 5.50206 11.9741 5.364 12.3746 5.12267C12.3746 4.37334 12.2493 3.87201 12.124 3.37067C11.5 3.62134 10.7506 4.37067 10.3746 5.872C10.5981 5.78316 10.8381 5.71006 11.0827 5.63556ZM11.6253 2.87467C11.5 2.74933 11.3746 2.74933 11.2493 2.74933C9.49729 2.74933 8.37464 5.12267 7.99864 6.62666C8.24929 6.564 8.49929 6.47 8.74929 6.376C8.99929 6.282 9.24929 6.188 9.49998 6.12534C9.87598 4.12533 10.876 3.25067 11.6253 2.87467ZM10.2493 10.9973C10.9986 10.9973 11.748 11.3733 11.748 11.3733L12.2466 9.12534C12.2466 9.12534 11.748 8.87466 10.748 8.87466C7.99864 8.87466 6.74795 10.624 6.74795 12.4987C6.74795 13.7599 7.45642 14.3135 8.07839 14.7996C8.56498 15.1798 8.99864 15.5187 8.99864 16.1227C8.99864 16.3707 8.87329 16.872 8.24929 16.872C7.37464 16.872 6.37464 15.9973 6.37464 15.9973L5.87329 17.7467C5.87329 17.7467 6.87329 18.9973 8.87329 18.9973C10.4973 18.9973 11.748 17.7467 11.748 15.872C11.748 14.3415 10.7165 13.6074 9.91714 13.0385C9.41145 12.6786 8.99864 12.3848 8.99864 11.9973C8.99864 11.7467 8.99864 10.9973 10.2493 10.9973ZM12.748 3.37067C12.8733 3.74667 12.9986 4.248 12.9986 4.872V4.99733C13.1866 4.99733 13.3426 4.966 13.4986 4.93467C13.6546 4.90333 13.8106 4.872 13.9986 4.872C13.748 4.12 13.372 3.37067 12.748 3.37067ZM18.372 5.74666C18.4973 5.74666 18.6226 5.74666 18.6226 5.872C18.6226 5.935 19.1597 9.66244 19.6939 13.3698C20.2224 17.0376 20.748 20.6857 20.748 20.7467L14.748 21.9973L15.4973 4.49867H15.6226C15.748 4.624 16.748 5.62134 16.748 5.62134C16.748 5.62134 18.2466 5.74666 18.372 5.74666Z" fill="currentColor"/>
              </svg>
            </IconBox>
            
            <IconBox 
              variants={iconVariants} 
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.67188 17.3799L6.74178 15.0091C8.38312 17.1368 10.1156 18.1398 12.0305 18.1398C13.9454 18.1398 15.6476 17.1672 17.1977 15.0395L20.3284 17.3495C18.0792 20.3891 15.2828 22 12.0305 22C8.80865 22 5.98191 20.3891 3.67188 17.3799Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.8482 7.13678L6.37704 11.848L3.85425 8.8997L11.8482 2L19.8117 8.8997L17.2585 11.8176L11.8482 7.13678Z" fill="currentColor"/>
              </svg>
            </IconBox>
            
            <IconBox 
              variants={iconVariants} 
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5201 2.01562H4.51208C3.12721 2.01562 2 3.14284 2 4.5277C2 4.5277 2 4.33447 2 19.5035C2 20.8562 3.12721 21.9834 4.51208 21.9834H19.4879C20.8406 21.9834 22 20.8562 22 19.4713V4.5277C21.9678 3.14284 20.8728 2.01562 19.5201 2.01562ZM10.7923 17.1203C10.7923 17.7644 10.2448 18.3119 9.60064 18.3119H5.89694C5.25282 18.3119 4.70531 17.7644 4.67311 17.1203V5.78374C4.67311 5.13962 5.22061 4.59211 5.86473 4.59211H9.53623C10.1804 4.59211 10.7279 5.13962 10.7279 5.78374L10.7923 17.1203ZM19.3913 12.1283C19.3913 12.7725 18.8438 13.32 18.1997 13.32H14.5604C13.9163 13.32 13.3688 12.7725 13.3688 12.1283V5.78374C13.3688 5.13962 13.9163 4.59211 14.5604 4.59211H18.1997C18.8438 4.59211 19.3913 5.13962 19.3913 5.78374V12.1283Z" fill="currentColor"/>
              </svg>
            </IconBox>
            
            <IconBox 
              variants={iconVariants} 
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.45161 2 2 6.48387 2 12C2 17.5161 6.45161 22 12 22C17.5484 22 22 17.4839 22 12C22 6.51613 17.4839 2 12 2ZM20.871 12C20.871 15.3548 19 18.2581 16.2903 19.7419L18.871 13.0968C19 12.7419 19.9032 10.5484 20.2258 8.67742C20.6452 9.74194 20.871 10.871 20.871 12ZM13.9032 7.64516H12.8065H9.35484C9.16129 7.64516 9.03226 7.77419 9.03226 7.96774C9.03226 8.16129 9.16129 8.29032 9.35484 8.29032H10L11.129 11.1935L9.77419 14.6774L7.32258 8.25806H8.09677C8.29032 8.25806 8.41935 8.12903 8.41935 7.93548C8.41935 7.74194 8.29032 7.6129 8.09677 7.6129H6.77419L4.64516 7.58064C6.09677 5.03226 8.90323 3.35484 12 3.35484C14.2581 3.35484 16.3548 4.25806 17.9032 5.70968C17.0968 5.83871 16.4516 6.48387 16.2581 7.25806C16.0645 8.16129 16.3871 8.90323 16.7419 9.58064C17.0968 10.3226 17.4839 11 17.1935 11.8065L16 14.9032L13.4516 8.25806H13.9355C14.129 8.25806 14.2581 8.12903 14.2581 7.93548C14.2581 7.77419 14.0323 7.64516 13.9032 7.64516ZM3.12903 12C3.12903 10.871 3.35484 9.77419 3.77419 8.77419L8.12903 19.9677C5.12903 18.5484 3.12903 15.5161 3.12903 12ZM12.0968 13.9032L14.6774 20.4516C13.8065 20.7097 12.9355 20.871 12 20.871C11.129 20.871 10.3226 20.7742 9.54839 20.5161L12.0968 13.9032Z" fill="currentColor"/>
              </svg>
            </IconBox>
            <IconBox 
              variants={iconVariants} 
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5939 11.0792H12.3209V13.8256H18.9768C18.6214 17.6382 15.5196 19.286 12.5148 19.286C8.70223 19.286 5.30969 16.3135 5.30969 12.0162C5.30969 7.88057 8.54068 4.74651 12.5148 4.74651C15.5519 4.74651 17.3936 6.71741 17.3936 6.71741L19.2676 4.74651C19.2676 4.74651 16.7474 2.00016 12.3856 2.00016C6.6344 1.96785 2.24023 6.78203 2.24023 11.9839C2.24023 17.0243 6.37592 22 12.4825 22C17.8783 22 21.7554 18.349 21.7554 12.8886C21.7877 11.7578 21.5939 11.0792 21.5939 11.0792Z" fill="currentColor"/>
              </svg>
            </IconBox>
          </IntegrationIcons>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <SeeAllLink href="https://console.dragify.ai/" target="_blank">
              {t('integrations.seeAll')}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.5 12.5l4 4 9-9" />
              </svg>
            </SeeAllLink>
          </motion.div>
        </ContentWrapper>
        
        <CardWrapper
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardTitle>{t('integrations.cardTitle')}</CardTitle>
            
            <IntegrationItem>
              <IntegrationInfo>
                <IntegrationIcon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6253 4.49867C14.9986 4.37333 15.2493 4.37333 15.2493 4.37333L14.5026 22L3.25195 19.8747C3.25195 19.8747 4.75062 8.50134 4.75062 8.12534C4.75062 7.62666 4.75062 7.62666 5.37464 7.376C5.42904 7.376 5.57751 7.32872 5.80998 7.25472C6.11283 7.15828 6.55823 7.01647 7.12395 6.87466C7.49995 5.25066 8.75064 2 11.3746 2C11.7506 2 12.124 2.12267 12.3746 2.624H12.5C13.6253 2.624 14.2493 3.49867 14.6253 4.49867ZM11.0827 5.63556C11.5209 5.50206 11.9741 5.364 12.3746 5.12267C12.3746 4.37334 12.2493 3.87201 12.124 3.37067C11.5 3.62134 10.7506 4.37067 10.3746 5.872C10.5981 5.78316 10.8381 5.71006 11.0827 5.63556ZM11.6253 2.87467C11.5 2.74933 11.3746 2.74933 11.2493 2.74933C9.49729 2.74933 8.37464 5.12267 7.99864 6.62666C8.24929 6.564 8.49929 6.47 8.74929 6.376C8.99929 6.282 9.24929 6.188 9.49998 6.12534C9.87598 4.12533 10.876 3.25067 11.6253 2.87467ZM10.2493 10.9973C10.9986 10.9973 11.748 11.3733 11.748 11.3733L12.2466 9.12534C12.2466 9.12534 11.748 8.87466 10.748 8.87466C7.99864 8.87466 6.74795 10.624 6.74795 12.4987C6.74795 13.7599 7.45642 14.3135 8.07839 14.7996C8.56498 15.1798 8.99864 15.5187 8.99864 16.1227C8.99864 16.3707 8.87329 16.872 8.24929 16.872C7.37464 16.872 6.37464 15.9973 6.37464 15.9973L5.87329 17.7467C5.87329 17.7467 6.87329 18.9973 8.87329 18.9973C10.4973 18.9973 11.748 17.7467 11.748 15.872C11.748 14.3415 10.7165 13.6074 9.91714 13.0385C9.41145 12.6786 8.99864 12.3848 8.99864 11.9973C8.99864 11.7467 8.99864 10.9973 10.2493 10.9973ZM12.748 3.37067C12.8733 3.74667 12.9986 4.248 12.9986 4.872V4.99733C13.1866 4.99733 13.3426 4.966 13.4986 4.93467C13.6546 4.90333 13.8106 4.872 13.9986 4.872C13.748 4.12 13.372 3.37067 12.748 3.37067ZM18.372 5.74666C18.4973 5.74666 18.6226 5.74666 18.6226 5.872C18.6226 5.935 19.1597 9.66244 19.6939 13.3698C20.2224 17.0376 20.748 20.6857 20.748 20.7467L14.748 21.9973L15.4973 4.49867H15.6226C15.748 4.624 16.748 5.62134 16.748 5.62134C16.748 5.62134 18.2466 5.74666 18.372 5.74666Z" fill="currentColor"/>
                  </svg>
                </IntegrationIcon>
                <IntegrationName>{t('integrations.items.0.name')}</IntegrationName>
              </IntegrationInfo>
              <ConnectionStatus $connected={t('integrations.items.0.connected')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('integrations.connected')}
              </ConnectionStatus>
            </IntegrationItem>
            
            <IntegrationItem>
              <IntegrationInfo>
                <IntegrationIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.35499 12.5484C8.22596 12.5484 7.25822 13.5162 7.25822 14.6452V19.871C7.25822 21 8.22596 21.9678 9.35499 21.9678C10.484 21.9678 11.4518 21 11.4518 19.871V14.6452C11.4518 13.4517 10.5485 12.5484 9.35499 12.5484Z" fill="currentColor"/>
                    <path d="M2 14.6452C2 15.7742 2.96774 16.742 4.09677 16.742C5.22581 16.742 6.19355 15.7742 6.19355 14.6452V12.5484H4.12903C2.96774 12.5484 2 13.4517 2 14.6452Z" fill="currentColor"/>
                    <path d="M9.35499 2C8.22596 2 7.25822 2.96774 7.25822 4.09677C7.25822 5.22581 8.22596 6.19355 9.35499 6.19355H11.4518C11.4518 5 11.4518 5.29032 11.4518 4.09677C11.4518 2.96774 10.5485 2 9.35499 2Z" fill="currentColor"/>
                    <path d="M4.09677 11.4516H9.35484C10.4839 11.4516 11.4516 10.4838 11.4516 9.3548C11.4516 8.22577 10.4839 7.25803 9.35484 7.25803H4.09677C2.96774 7.25803 2 8.22577 2 9.3548C2 10.4838 2.90323 11.4516 4.09677 11.4516Z" fill="currentColor"/>
                    <path d="M19.8707 7.25803C18.7416 7.25803 17.7739 8.22577 17.7739 9.3548V11.4516H19.8707C20.9997 11.4516 21.9674 10.4838 21.9674 9.3548C21.9674 8.22577 21.0319 7.25803 19.8707 7.25803Z" fill="currentColor"/>
                    <path d="M12.5482 4.09677V9.35484C12.5482 10.4839 13.516 11.4516 14.645 11.4516C15.774 11.4516 16.7418 10.4839 16.7418 9.35484V4.09677C16.7418 2.96774 15.774 2 14.645 2C13.4515 2 12.5482 2.96774 12.5482 4.09677Z" fill="currentColor"/>
                    <path d="M16.7418 19.9032C16.7418 18.7742 15.774 17.8065 14.645 17.8065H12.5482V19.9032C12.5482 21.0323 13.516 22 14.645 22C15.774 22 16.7418 21.0323 16.7418 19.9032Z" fill="currentColor"/>
                    <path d="M19.9031 12.5484H14.645C13.516 12.5484 12.5482 13.5162 12.5482 14.6452C12.5482 15.7742 13.516 16.742 14.645 16.742H19.9031C21.0321 16.742 21.9998 15.7742 21.9998 14.6452C21.9998 13.4517 21.0321 12.5484 19.9031 12.5484Z" fill="currentColor"/>
                  </svg>
                </IntegrationIcon>
                <IntegrationName>{t('integrations.items.1.name')}</IntegrationName>
              </IntegrationInfo>
              <ConnectionStatus $connected={t('integrations.items.1.connected')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('integrations.connected')}
              </ConnectionStatus>
            </IntegrationItem>
            
            <IntegrationItem>
              <IntegrationInfo>
                <IntegrationIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.2581 14.2901L8.87097 3.25781H15.129L21.5484 14.2901H15.2581ZM9.87097 15.1933L6.74194 20.7417H18.871L22 15.1933H9.87097ZM8.03226 4.61265L2 15.1933L5.12903 20.7417L11.2258 10.161L8.03226 4.61265Z" fill="currentColor"/>
                  </svg>
                </IntegrationIcon>
                <IntegrationName>{t('integrations.items.2.name')}</IntegrationName>
              </IntegrationInfo>
              <ConnectButton>{t('integrations.connect')}</ConnectButton>
            </IntegrationItem>
            
            <IntegrationItem>
              <IntegrationInfo>
                <IntegrationIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </IntegrationIcon>
                <IntegrationName>{t('integrations.items.3.name')}</IntegrationName>
              </IntegrationInfo>
              <ConnectButton>{t('integrations.connect')}</ConnectButton>
            </IntegrationItem>
          </Card>
        </CardWrapper>
      </Container>
    </IntegrationsSection>
  );
};

export default Integrations;