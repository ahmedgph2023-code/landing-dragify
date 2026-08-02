import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ResourceHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HeaderSection = styled.section`
  padding: 8rem 0 4rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconWrapper = styled(motion.div)`
  width: 100px;
  height: 100px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.small};
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
  margin-bottom: 2rem;
  max-width: 600px;
`;

const BreadcrumbNav = styled.nav`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Breadcrumb = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
`;

const ResourceHeader: React.FC<ResourceHeaderProps> = ({ title, description, icon }) => {
  return (
    <HeaderSection>
      <Container>
        <BreadcrumbNav>
          <Breadcrumb href="/">Home</Breadcrumb>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <Breadcrumb href="/resources">Resources</Breadcrumb>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <span>{title}</span>
        </BreadcrumbNav>
        
        <IconWrapper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </IconWrapper>
        
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </Title>
        
        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description}
        </Description>
      </Container>
    </HeaderSection>
  );
};

export default ResourceHeader;