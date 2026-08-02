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

const Timeline = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const ChangelogEntry = styled(motion.div)`
  position: relative;
  margin-bottom: 3rem;
  padding-left: 3rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const VersionDot = styled.div<{ type: string }>`
  position: absolute;
  left: 0;
  top: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  background-color: ${({ theme, type }) => 
    type === 'major' ? theme.colors.primary : 
    type === 'minor' ? theme.colors.accent.blue : 
    theme.colors.accent.purple};
  color: white;
  z-index: 1;
`;

const EntryHeader = styled.div`
  margin-bottom: 1rem;
`;

const VersionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
`;

const ReleaseDate = styled.span`
  font-size: 1rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: 1rem;
`;

const VersionTag = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  margin-left: 1rem;
  text-transform: uppercase;
  background-color: ${({ theme, type }) => 
    type === 'major' ? `${theme.colors.primary}20` : 
    type === 'minor' ? `${theme.colors.accent.blue}20` : 
    `${theme.colors.accent.purple}20`};
  color: ${({ theme, type }) => 
    type === 'major' ? theme.colors.primary : 
    type === 'minor' ? theme.colors.accent.blue : 
    theme.colors.accent.purple};
`;

const ChangeCategory = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:first-child {
    margin-top: 0;
  }
`;

const ChangeList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ChangeItem = styled.li`
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
  line-height: 1.6;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.7rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const Changelog = () => {
  return (
    <>
      <Head>
        <title>Changelog - Simplify AI</title>
        <meta name="description" content="Stay up to date with the latest updates, improvements, and new features in Simplify AI." />
      </Head>
      
      <Layout>
        <MainContent>
          <ResourceHeader 
            title="Changelog" 
            description="Follow our product updates"
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="currentColor"/>
              </svg>
            } 
          />
          
          <ContentSection>
            <Container>
              <Timeline>
                <ChangelogEntry
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <VersionDot type="major">2.0</VersionDot>
                  <EntryHeader>
                    <VersionTitle>
                      Version 2.0
                      <ReleaseDate>April 12, 2025</ReleaseDate>
                      <VersionTag type="major">Major</VersionTag>
                    </VersionTitle>
                  </EntryHeader>
                  
                  <ChangeCategory>New Features</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Introduced visual workflow builder for creating complex AI pipelines without code</ChangeItem>
                    <ChangeItem>Added support for custom model hosting with auto-scaling capabilities</ChangeItem>
                    <ChangeItem>Implemented real-time analytics dashboard with customizable metrics</ChangeItem>
                    <ChangeItem>Added A/B testing framework for model deployment and evaluation</ChangeItem>
                    <ChangeItem>Introduced model versioning system with automatic rollback options</ChangeItem>
                  </ChangeList>
                  
                  <ChangeCategory>Improvements</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Redesigned user interface for improved usability and accessibility</ChangeItem>
                    <ChangeItem>Optimized model deployment process, reducing average deployment time by 40%</ChangeItem>
                    <ChangeItem>Enhanced security features with SOC 2 Type II compliance</ChangeItem>
                    <ChangeItem>Improved API documentation with interactive examples</ChangeItem>
                  </ChangeList>
                  
                  <ChangeCategory>Bug Fixes</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Fixed issue with model monitoring alerts not sending notifications</ChangeItem>
                    <ChangeItem>Resolved authentication token expiration handling</ChangeItem>
                    <ChangeItem>Fixed data visualization rendering in Firefox browsers</ChangeItem>
                  </ChangeList>
                </ChangelogEntry>
                
                <ChangelogEntry
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <VersionDot type="minor">1.5</VersionDot>
                  <EntryHeader>
                    <VersionTitle>
                      Version 1.5
                      <ReleaseDate>March 15, 2025</ReleaseDate>
                      <VersionTag type="minor">Minor</VersionTag>
                    </VersionTitle>
                  </EntryHeader>
                  
                  <ChangeCategory>New Features</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Added integration with GitHub for CI/CD workflows</ChangeItem>
                    <ChangeItem>Implemented custom model metrics for performance monitoring</ChangeItem>
                    <ChangeItem>Added support for team collaboration with role-based access control</ChangeItem>
                  </ChangeList>
                  
                  <ChangeCategory>Improvements</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Enhanced model serving infrastructure for better performance</ChangeItem>
                    <ChangeItem>Improved error handling and logging for troubleshooting</ChangeItem>
                    <ChangeItem>Updated documentation with more examples and tutorials</ChangeItem>
                  </ChangeList>
                  
                  <ChangeCategory>Bug Fixes</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Fixed pagination in model list view</ChangeItem>
                    <ChangeItem>Resolved issue with webhook delivery on certain network configurations</ChangeItem>
                    <ChangeItem>Fixed inconsistent dark mode styling</ChangeItem>
                  </ChangeList>
                </ChangelogEntry>
                
                <ChangelogEntry
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <VersionDot type="patch">1.4</VersionDot>
                  <EntryHeader>
                    <VersionTitle>
                      Version 1.4
                      <ReleaseDate>February 28, 2025</ReleaseDate>
                      <VersionTag type="patch">Patch</VersionTag>
                    </VersionTitle>
                  </EntryHeader>
                  
                  <ChangeCategory>New Features</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Added support for custom Python dependencies in model environments</ChangeItem>
                    <ChangeItem>Implemented scheduled model retraining</ChangeItem>
                  </ChangeList>
                  
                  <ChangeCategory>Improvements</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Optimized model loading time for faster inference</ChangeItem>
                    <ChangeItem>Enhanced user authentication system</ChangeItem>
                    <ChangeItem>Improved dashboard performance for projects with many models</ChangeItem>
                  </ChangeList>
                  
                  <ChangeCategory>Bug Fixes</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Fixed model export functionality for certain model types</ChangeItem>
                    <ChangeItem>Resolved UI rendering issues in Safari browsers</ChangeItem>
                  </ChangeList>
                </ChangelogEntry>
                
                <ChangelogEntry
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <VersionDot type="major">1.0</VersionDot>
                  <EntryHeader>
                    <VersionTitle>
                      Version 1.0
                      <ReleaseDate>January 10, 2025</ReleaseDate>
                      <VersionTag type="major">Major</VersionTag>
                    </VersionTitle>
                  </EntryHeader>
                  
                  <ChangeCategory>Initial Release</ChangeCategory>
                  <ChangeList>
                    <ChangeItem>Launched Simplify AI platform with no-code AI model deployment</ChangeItem>
                    <ChangeItem>Introduced visual interface for AI model management</ChangeItem>
                    <ChangeItem>Added support for common ML frameworks: TensorFlow, PyTorch, and scikit-learn</ChangeItem>
                    <ChangeItem>Implemented basic monitoring and logging for deployed models</ChangeItem>
                    <ChangeItem>Released REST API for programmatic access to platform features</ChangeItem>
                    <ChangeItem>Added user management and authentication system</ChangeItem>
                    <ChangeItem>Implemented essential security features for data protection</ChangeItem>
                  </ChangeList>
                </ChangelogEntry>
              </Timeline>
            </Container>
          </ContentSection>
        </MainContent>
      </Layout>
    </>
  );
};

export default Changelog;