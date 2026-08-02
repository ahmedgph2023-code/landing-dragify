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

const Card = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
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
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.blue};
  }
  
  svg {
    margin-left: 0.5rem;
  }
`;

const Docs = () => {
  return (
    <>
      <Head>
        <title>Documentation - Simplify AI</title>
        <meta name="description" content="Learn how to use Stack AI with our comprehensive documentation, tutorials, and guides." />
      </Head>
      
      <Layout>
        <MainContent>
          <ResourceHeader 
            title="Documentation" 
            description="Learn how to use Stack AI"
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="currentColor"/>
              </svg>
            } 
          />
          
          <ContentSection>
            <Container>
              <SectionTitle>Getting Started</SectionTitle>
              
              <Card whileHover={{ scale: 1.02 }}>
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>
                  Learn the basics of Simplify AI and get your first AI model deployed in minutes.
                </CardDescription>
                <Button href="/resources/docs/quickstart">
                  Read Guide
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                  </svg>
                </Button>
              </Card>
              
              <Card whileHover={{ scale: 1.02 }}>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  Get familiar with the Simplify AI platform, its features, and capabilities.
                </CardDescription>
                <Button href="/resources/docs/overview">
                  Read Guide
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                  </svg>
                </Button>
              </Card>
              
              <SectionTitle>User Guides</SectionTitle>
              
              <Card whileHover={{ scale: 1.02 }}>
                <CardTitle>Model Deployment</CardTitle>
                <CardDescription>
                  Step-by-step guide to deploying AI models using Simplify AI's no-code interface.
                </CardDescription>
                <Button href="/resources/docs/deployment">
                  Read Guide
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                  </svg>
                </Button>
              </Card>
              
              <Card whileHover={{ scale: 1.02 }}>
                <CardTitle>Model Monitoring</CardTitle>
                <CardDescription>
                  Learn how to monitor the performance of your AI models and set up alerts.
                </CardDescription>
                <Button href="/resources/docs/monitoring">
                  Read Guide
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                  </svg>
                </Button>
              </Card>
              
              <Card whileHover={{ scale: 1.02 }}>
                <CardTitle>Scaling Models</CardTitle>
                <CardDescription>
                  Understand how to scale your AI models to handle increased traffic and demand.
                </CardDescription>
                <Button href="/resources/docs/scaling">
                  Read Guide
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                  </svg>
                </Button>
              </Card>
              
              <SectionTitle>API Reference</SectionTitle>
              
              <Card whileHover={{ scale: 1.02 }}>
                <CardTitle>REST API</CardTitle>
                <CardDescription>
                  Detailed documentation of our REST API for programmatic access to Simplify AI.
                </CardDescription>
                <Button href="/resources/docs/api">
                  View Reference
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                  </svg>
                </Button>
              </Card>
            </Container>
          </ContentSection>
        </MainContent>
      </Layout>
    </>
  );
};

export default Docs;