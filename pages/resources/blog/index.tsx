import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import ResourceHeader from '../../../components/ResourceHeader';
import { BlogPost } from '../../../data/blogPosts';
import Image from 'next/image';
import { useLocalization } from '../../../context/LocalizationContext';

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
`;

const ContentSection = styled.section`
  padding: 4rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedBlog = styled(motion.div)`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedImage = styled.div`
  height: 100%;
  min-height: 300px;
  background-color: ${({ theme }) => theme.colors.accent.purple}20;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const FeaturedContent = styled.div`
  padding: 2rem;
`;

const FeaturedCategory = styled.span`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent.blue};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FeaturedTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const FeaturedExcerpt = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
`;

const FeaturedAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.border};
  margin-right: 1rem;
  background-position: center;
  background-size: cover;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.span`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PublishDate = styled.span`
  display: block;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BlogCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const BlogImage = styled.div`
  height: 200px;
  background-color: ${({ theme }) => theme.colors.accent.blue}20;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const BlogContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BlogCategory = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent.blue};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BlogTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const BlogExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const BlogAuthor = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ReadMore = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  
  svg {
    margin-left: 0.25rem;
  }
`;

const Blog = () => {
  const { t } = useLocalization();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/blog');
        setPosts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(t('blog.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Head>
        <title>{t('blog.title')} - Dragify AI</title>
        <meta name="description" content={t('blog.metaDescription')} />
      </Head>
      <MainContent>
        <ResourceHeader 
          title={t('blog.title')} 
          description={t('blog.description')}
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5V19H5V5H19ZM21 3H3V21H21V3ZM17 17H7V16H17V17ZM17 15H7V14H17V15ZM17 12H7V7H17V12Z" fill="currentColor"/>
            </svg>
          } 
        />
        
        <ContentSection>
          <Container>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p>{t('blog.loading')}</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'red' }}>
                <p>{error}</p>
              </div>
            ) : (
              <>
                {posts.length > 0 && (
                  <Link href={`/resources/blog/${posts[0].slug}`} style={{ textDecoration: 'none' }}>
                    <FeaturedBlog
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {posts[0].coverImage ? (
                        <FeaturedImage>
                          <img src={posts[0].coverImage} alt={posts[0].title} />
                        </FeaturedImage>
                      ) : (
                        <FeaturedImage style={{ minHeight: '200px' }} />
                      )}
                      <FeaturedContent>
                        <FeaturedCategory>{posts[0].category}</FeaturedCategory>
                        <FeaturedTitle>{posts[0].title}</FeaturedTitle>
                        <FeaturedExcerpt>
                          {posts[0].excerpt}
                        </FeaturedExcerpt>
                        <FeaturedMeta>
                          <FeaturedAuthor>
                            <Image src="/default_avatar.webp" alt="avatar" width={ 40 } height={ 40 } style={{ borderRadius: '50%' }} />
                            <AuthorInfo>
                              <AuthorName>{posts[0].author.name}</AuthorName>
                              <PublishDate>{posts[0].publishDate}</PublishDate>
                            </AuthorInfo>
                          </FeaturedAuthor>
                        </FeaturedMeta>
                      </FeaturedContent>
                    </FeaturedBlog>
                  </Link>
                )}
                
                <BlogGrid>
                  {posts.slice(1).map((post, index) => (
                    <Link key={post.id} href={`/resources/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                      <BlogCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                      >
                        {post.coverImage ? (
                          <BlogImage>
                            <img src={post.coverImage} alt={post.title} />
                          </BlogImage>
                        ) : (
                          <BlogImage />
                        )}
                        <BlogContent>
                          <BlogCategory>{post.category}</BlogCategory>
                          <BlogTitle>{post.title}</BlogTitle>
                          <BlogExcerpt>
                            {post.excerpt}
                          </BlogExcerpt>
                          <BlogMeta>
                            <BlogAuthor>{post.author.name} • {post.publishDate}</BlogAuthor>
                            {/* <ReadMore>
                              Read More
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                              </svg>
                            </ReadMore> */}
                          </BlogMeta>
                        </BlogContent>
                      </BlogCard>
                    </Link>
                  ))}
                </BlogGrid>
              </>
            )}
          </Container>
        </ContentSection>
      </MainContent>
    </>
  );
};

export default Blog;