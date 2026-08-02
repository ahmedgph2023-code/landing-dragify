import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import ResourceHeader from '../../components/ResourceHeader';

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
`;

const ContentSection = styled.section`
  padding: 4rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const IntegrationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const IntegrationCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const IntegrationLogo = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const IntegrationName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const IntegrationDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;
  margin-top: auto;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.blue};
  }
  
  svg {
    margin-left: 0.5rem;
  }
`;

const IntroText = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 3rem;
`;

const Integrations = () => {
  return (
    <>
      <Head>
        <title>Integrations - Simplify AI</title>
        <meta name="description" content="Integrate Simplify AI with your existing tools and workflows. Explore our available integrations." />
      </Head>
      
      <Layout>
        <MainContent>
          <ResourceHeader 
            title="Integrations" 
            description="Integrate with Stack AI"
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7H13V9H17C18.65 9 20 10.35 20 12C20 13.65 18.65 15 17 15H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7ZM11 15H7C5.35 15 4 13.65 4 12C4 10.35 5.35 9 7 9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15ZM8 11H16V13H8V11Z" fill="currentColor"/>
              </svg>
            } 
          />
          
          <ContentSection>
            <Container>
              <IntroText>
                Simplify AI integrates seamlessly with your existing tools and workflows. Connect with popular platforms to automate tasks, enhance your AI capabilities, and deliver better results.
              </IntroText>
              
              <SectionTitle>Cloud Platforms</SectionTitle>
              <IntegrationGrid>
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3L4.5 15H19.5L12 3Z" fill="#4285F4"/>
                      <path d="M12 21L4.5 9H19.5L12 21Z" fill="#34A853"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>Google Cloud</IntegrationName>
                  <IntegrationDescription>
                    Deploy and manage Simplify AI on Google Cloud Platform.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/gcp">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
                
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" fill="#FF9900"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>AWS</IntegrationName>
                  <IntegrationDescription>
                    Run Simplify AI on Amazon Web Services infrastructure.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/aws">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
                
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12z" fill="#0078D4"/>
                      <path d="M9 8h8v8h-8z" fill="white"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>Microsoft Azure</IntegrationName>
                  <IntegrationDescription>
                    Integrate Simplify AI with Microsoft Azure services.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/azure">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
              </IntegrationGrid>
              
              <SectionTitle>Development Tools</SectionTitle>
              <IntegrationGrid>
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1.27C5.99 1.27 1.05 6.22 1.05 12.22C1.05 17.02 4.24 21.1 8.67 22.53C9.21 22.63 9.41 22.31 9.41 22.04C9.41 21.79 9.4 21.02 9.4 20.11C6.2 20.73 5.56 18.67 5.56 18.67C5.07 17.41 4.33 17.09 4.33 17.09C3.33 16.43 4.41 16.44 4.41 16.44C5.51 16.52 6.09 17.55 6.09 17.55C7.08 19.17 8.65 18.72 9.44 18.45C9.54 17.77 9.84 17.32 10.17 17.07C7.61 16.81 4.92 15.91 4.92 11.75C4.92 10.56 5.35 9.58 6.11 8.81C6 8.55 5.62 7.47 6.21 6.01C6.21 6.01 7.15 5.74 9.39 7.24C10.23 7.01 11.13 6.9 12.02 6.89C12.9 6.9 13.79 7.01 14.64 7.24C16.87 5.74 17.81 6.01 17.81 6.01C18.4 7.47 18.02 8.55 17.91 8.81C18.67 9.58 19.1 10.56 19.1 11.75C19.1 15.92 16.4 16.81 13.83 17.06C14.25 17.39 14.62 18.04 14.62 19.03C14.62 20.46 14.6 21.7 14.6 22.04C14.6 22.31 14.8 22.63 15.35 22.52C19.78 21.1 22.96 17.02 22.96 12.22C22.96 6.22 18.02 1.27 12 1.27Z" fill="#24292E"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>GitHub</IntegrationName>
                  <IntegrationDescription>
                    Connect Simplify AI with your GitHub repositories for CI/CD.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/github">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
                
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.003 5.884L10 9.882v7.236l-8-4.001V5.884zM14 9.882l7.997-3.999v7.234l-8 4V9.882zM12 4.121L19.997 8.12 12 12.118 4.003 8.12 12 4.12z" fill="#2684FF"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>Jira</IntegrationName>
                  <IntegrationDescription>
                    Track AI model deployments and issues directly in Jira.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/jira">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
                
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12C1.5 17.799 6.201 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.201 17.799 1.5 12 1.5ZM9.7 17.4L4.2 11.9L5.257 10.843L9.7 15.314L18.686 6.3L19.743 7.357L9.7 17.4Z" fill="#25BB00"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>Jenkins</IntegrationName>
                  <IntegrationDescription>
                    Integrate with Jenkins for automated model deployments.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/jenkins">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
              </IntegrationGrid>
              
              <SectionTitle>Productivity Tools</SectionTitle>
              <IntegrationGrid>
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4H6ZM6 6H18V18H6V6ZM8 8V10H16V8H8ZM8 12V14H16V12H8ZM8 16V18H13V16H8Z" fill="#7D56FF"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>Slack</IntegrationName>
                  <IntegrationDescription>
                    Get alerts and deploy models directly from Slack.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/slack">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
                
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3V21H21V12H19V19H5V5H12V3H3ZM14 3V5H17.59L8.76 13.83L10.17 15.24L19 6.41V10H21V3H14Z" fill="#00A1E0"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>Salesforce</IntegrationName>
                  <IntegrationDescription>
                    Integrate AI models with your Salesforce CRM.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/salesforce">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
                
                <IntegrationCard whileHover={{ scale: 1.03 }}>
                  <IntegrationLogo>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6ZM11 16H13V18H11V16Z" fill="#EA4335"/>
                    </svg>
                  </IntegrationLogo>
                  <IntegrationName>Zapier</IntegrationName>
                  <IntegrationDescription>
                    Connect Simplify AI with thousands of apps via Zapier.
                  </IntegrationDescription>
                  <Button href="/resources/integrations/zapier">
                    Learn More
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                    </svg>
                  </Button>
                </IntegrationCard>
              </IntegrationGrid>
            </Container>
          </ContentSection>
        </MainContent>
      </Layout>
    </>
  );
};

export default Integrations;