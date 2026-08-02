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
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 2.5rem 0 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:first-child {
    margin-top: 0;
  }
`;

const Paragraph = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const SecurityCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1.5rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CardDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const List = styled.ul`
  margin-bottom: 2rem;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.75rem;
`;

const Security = () => {
  return (
    <>
      <Head>
        <title>Security - Simplify AI</title>
        <meta name="description" content="Learn about Simplify AI's security practices, data protection measures, and compliance standards." />
      </Head>
      
      <Layout>
        <MainContent>
          <ResourceHeader 
            title="Security" 
            description="Learn about our security practices"
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM19 11C19 15.52 15.88 19.72 12 20.94C8.12 19.72 5 15.52 5 11V6.3L12 3.19L19 6.3V11ZM7.91 14.41L6.5 13L9 10.5L6.5 8L7.91 6.59L10.42 9.08L12.89 6.59L14.3 8L11.83 10.5L14.33 13L12.92 14.41L10.42 11.92L7.91 14.41Z" fill="currentColor"/>
              </svg>
            } 
          />
          
          <ContentSection>
            <Container>
              <Paragraph>
                At Simplify AI, security is a top priority. We implement industry-leading security practices to ensure that your data and AI models are protected. This page outlines our approach to security and the measures we take to safeguard your information.
              </Paragraph>
              
              <SectionTitle>Our Security Commitment</SectionTitle>
              
              <SecurityCard
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <IconContainer>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM18 11.09C18 15.09 15.45 18.79 12 19.92C8.55 18.79 6 15.09 6 11.09V6.39L12 4.14L18 6.39V11.09Z" fill="currentColor"/>
                    <path d="M10 12L8 10L6.5 11.5L10 15L17 8L15.5 6.5L10 12Z" fill="currentColor"/>
                  </svg>
                </IconContainer>
                <CardContent>
                  <CardTitle>Data Protection</CardTitle>
                  <CardDescription>
                    We employ multiple layers of encryption to protect your data both in transit and at rest. All communications with our platform are secured using TLS 1.3, and sensitive data is encrypted using AES-256 before being stored in our databases.
                  </CardDescription>
                </CardContent>
              </SecurityCard>
              
              <SecurityCard
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <IconContainer>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10H3V9H21V10ZM21 14H3V13H21V14ZM21 18H3V17H21V18ZM21 6H3V5H21V6Z" fill="currentColor"/>
                    <path d="M10 22L8 20L6 22L6 2L8 4L10 2L10 22Z" fill="currentColor"/>
                  </svg>
                </IconContainer>
                <CardContent>
                  <CardTitle>Infrastructure Security</CardTitle>
                  <CardDescription>
                    Our infrastructure is hosted in SOC 2 and ISO 27001 certified data centers with 24/7 physical security, biometric access controls, and redundant power systems. We regularly update and patch our systems to address potential vulnerabilities.
                  </CardDescription>
                </CardContent>
              </SecurityCard>
              
              <SecurityCard
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <IconContainer>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12ZM12 10C11.4 10 11 10.4 11 11C11 11.6 11.4 12 12 12C12.6 12 13 11.6 13 11C13 10.4 12.6 10 12 10ZM12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM14.9 16.9L6 12C6 8.7 8.7 6 12 6C15.3 6 18 8.7 18 12C18 14.2 16.8 16.2 14.9 16.9ZM13 14C14.3 13.4 15 12.3 15 11C15 9.3 13.7 8 12 8C10.3 8 9 9.3 9 11C9 12.3 9.7 13.4 11 14V17H13V14Z" fill="currentColor"/>
                  </svg>
                </IconContainer>
                <CardContent>
                  <CardTitle>Access Controls</CardTitle>
                  <CardDescription>
                    We implement strict access controls following the principle of least privilege. Multi-factor authentication is required for all administrative access, and we maintain detailed audit logs of all system activities. Employee access to production systems is strictly limited and reviewed regularly.
                  </CardDescription>
                </CardContent>
              </SecurityCard>
              
              <SectionTitle>Compliance and Certifications</SectionTitle>
              <Paragraph>
                Simplify AI maintains compliance with several industry standards and regulations to ensure we meet the highest security requirements:
              </Paragraph>
              
              <List>
                <ListItem>SOC 2 Type II certified</ListItem>
                <ListItem>GDPR compliant</ListItem>
                <ListItem>HIPAA compliant for healthcare applications</ListItem>
                <ListItem>ISO 27001 certified for information security management</ListItem>
                <ListItem>Regular penetration testing by independent security firms</ListItem>
              </List>
              
              <SectionTitle>Security Monitoring</SectionTitle>
              <Paragraph>
                Our security team continuously monitors our systems for potential threats and vulnerabilities. We employ:
              </Paragraph>
              
              <List>
                <ListItem>24/7 automated intrusion detection systems</ListItem>
                <ListItem>Real-time threat intelligence integration</ListItem>
                <ListItem>Automated vulnerability scanning</ListItem>
                <ListItem>Regular security audits and reviews</ListItem>
              </List>
              
              <SectionTitle>Reporting Security Concerns</SectionTitle>
              <Paragraph>
                If you believe you've discovered a security vulnerability in our platform, we encourage you to report it to us immediately. We have a responsible disclosure program that provides guidelines for reporting security issues.
              </Paragraph>
              
              <Paragraph>
                Contact our security team at <strong>security@simplifyai.com</strong> to report potential vulnerabilities or security concerns.
              </Paragraph>
            </Container>
          </ContentSection>
        </MainContent>
      </Layout>
    </>
  );
};

export default Security;