import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BlogPost } from '../data/blogPosts';
import Image from 'next/image';
import { useLocalization } from '../context/LocalizationContext';

interface BlogPostLayoutProps {
  post: BlogPost;
}

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const PostHeader = styled.section`
  padding: 8rem 0 4rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PostContent = styled.section`
  padding: 4rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const BreadcrumbLink = styled(Link)`
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

const Category = styled.span`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent.blue};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 15px;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const PublishDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CoverImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  margin-bottom: 2rem;
  overflow: hidden;
  background-color: ${props => props.theme.colors.accent.purple};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const Content = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 2.5rem 0 1.25rem;
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 2rem 0 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.75rem;
    
    li {
      margin-bottom: 0.75rem;
    }
  }
  
  a {
    color: ${({ theme }) => theme.colors.accent.blue};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  blockquote {
    margin: 2rem 0;
    padding: 1.5rem 2rem;
    border-left: 4px solid ${({ theme }) => theme.colors.accent.blue};
    background-color: ${({ theme }) => theme.colors.cardBackground};
    border-radius: 0 8px 8px 0;
    font-style: italic;
    
    p {
      margin-bottom: 0.5rem;
    }
    
    footer {
      font-size: 0.875rem;
      font-style: normal;
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
  
  pre {
    margin: 1.5rem 0;
    padding: 1.5rem;
    background-color: ${({ theme }) => theme.colors.cardBackground};
    border-radius: 8px;
    overflow-x: auto;
    font-family: monospace;
    font-size: 0.875rem;
    
    code {
      display: block;
      line-height: 1.6;
    }
  }
`;

const RelatedPosts = styled.div`
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const RelatedPostsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const BackToAllPosts = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: 3rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({ post }) => {
  const { t } = useLocalization();
  
  return (
    <>
      <Head>
        <title>{post.title} - Dragify AI Blog</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      <MainContent>
        <PostHeader>
          <Container>
            <Breadcrumbs>
              <BreadcrumbLink href="/">{t('blog.breadcrumbs.home')}</BreadcrumbLink>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbLink href="/resources">{t('blog.breadcrumbs.resources')}</BreadcrumbLink>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbLink href="/resources/blog">{t('blog.breadcrumbs.blog')}</BreadcrumbLink>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <span>{post.title}</span>
            </Breadcrumbs>
            
            <Category>{post.category}</Category>
            
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {post.title}
            </Title>
            
            <Meta>
              <Image src="/default_avatar.webp" alt="avatar" width={ 50 } height={ 50 } style={{ borderRadius: '50%' }} />
              <AuthorInfo>
                <AuthorName>{post.author.name}</AuthorName>
                <PublishDate>{post.publishDate}</PublishDate>
              </AuthorInfo>
            </Meta>
            
            {post.coverImage && (
              <CoverImage>
                <img src={post.coverImage} alt={post.title} />
              </CoverImage>
            )}
          </Container>
        </PostHeader>
        
        <PostContent>
          <Container>
            <Content dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <BackToAllPosts href="/resources/blog">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
              </svg>
              {t('blog.backToAllPosts')}
            </BackToAllPosts>
          </Container>
        </PostContent>
      </MainContent>
    </>
  );
};

export default BlogPostLayout;