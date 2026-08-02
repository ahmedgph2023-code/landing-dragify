import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const Card = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 2rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1.5rem;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
  line-height: 1.5;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  color: inherit;
`;

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, icon, href }) => {
  return (
    <StyledLink href={href}>
      <Card
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IconWrapper>
          {icon}
        </IconWrapper>
        <Content>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Content>
      </Card>
    </StyledLink>
  );
};

export default ResourceCard;