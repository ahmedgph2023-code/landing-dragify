import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import ResourceCard from '../../components/ResourceCard';

const MainContent = styled.main`
  padding: 8rem 0 4rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 800px;
  margin: 0 auto;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Resources = () => {
  return (
    <>
      <Head>
        <title>Resources - Simplify AI</title>
        <meta name="description" content="Resources and documentation for Simplify AI. Learn how to use our platform and integrate it with your existing tools." />
      </Head>
      
      <Layout>
        <MainContent>
          <Container>
            <Header>
              <Title
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Resources
              </Title>
              <Description
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Everything you need to get the most out of Simplify AI. Browse our documentation, learn about integrations, and stay up to date with our latest updates.
              </Description>
            </Header>
            
            <ResourceGrid>
              <ResourceCard 
                title="Docs" 
                description="Learn how to use Stack AI"
                href="/resources/docs"
                icon={
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="currentColor"/>
                  </svg>
                }
              />
              
              <ResourceCard 
                title="Integrations" 
                description="Integrate with Stack AI"
                href="/resources/integrations"
                icon={
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 7H13V9H17C18.65 9 20 10.35 20 12C20 13.65 18.65 15 17 15H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7ZM11 15H7C5.35 15 4 13.65 4 12C4 10.35 5.35 9 7 9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15ZM8 11H16V13H8V11Z" fill="currentColor"/>
                  </svg>
                }
              />
              
              <ResourceCard 
                title="Security" 
                description="Learn about our security practices"
                href="/resources/security"
                icon={
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM19 11C19 15.52 15.88 19.72 12 20.94C8.12 19.72 5 15.52 5 11V6.3L12 3.19L19 6.3V11ZM7.91 14.41L6.5 13L9 10.5L6.5 8L7.91 6.59L10.42 9.08L12.89 6.59L14.3 8L11.83 10.5L14.33 13L12.92 14.41L10.42 11.92L7.91 14.41Z" fill="currentColor"/>
                  </svg>
                }
              />
              
              <ResourceCard 
                title="Blog" 
                description="Read the latest news from us"
                href="/resources/blog"
                icon={
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5V19H5V5H19ZM21 3H3V21H21V3ZM17 17H7V16H17V17ZM17 15H7V14H17V15ZM17 12H7V7H17V12Z" fill="currentColor"/>
                  </svg>
                }
              />
              
              <ResourceCard 
                title="Changelog" 
                description="Follow our product updates"
                href="/resources/changelog"
                icon={
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="currentColor"/>
                  </svg>
                }
              />
            </ResourceGrid>
          </Container>
        </MainContent>
      </Layout>
    </>
  );
};

export default Resources;