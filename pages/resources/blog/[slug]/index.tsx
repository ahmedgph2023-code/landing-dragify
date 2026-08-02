import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import BlogPostLayout from '../../../../components/BlogPostLayout';
import { BlogPost } from '../../../../data/blogPosts';
import { useLocalization } from '../../../../context/LocalizationContext';

const BlogPostPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useLocalization();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/blog/${slug}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(t('blog.postError'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>{t('blog.loadingPost')}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        <p>{error}</p>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>{t('blog.postNotFound')}</p>
      </div>
    );
  }
  
  return <BlogPostLayout post={post} />;
};

export default BlogPostPage;