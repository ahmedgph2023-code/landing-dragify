import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import { withAuth } from '../../lib/withAuth';
import { IBlogPost } from '../../models/BlogPost';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const PrimaryButton = styled(NavButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ContentTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PostsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.border}50;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  margin-right: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    color: red;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 2rem;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 1rem;
`;

const SubmitButton = styled(PrimaryButton)`
  padding: 0.75rem 1.5rem;
`;

const CancelButton = styled(NavButton)`
  padding: 0.75rem 1.5rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 4px;
  color: red;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background-color: rgba(0, 255, 0, 0.1);
  border-radius: 4px;
  color: green;
  margin-bottom: 1rem;
`;

// Advanced Rich Text Editor
const RichTextEditor = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 8px;
    background-color: ${({ theme }) => theme.colors.background};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  .toolbar-group {
    display: flex;
    gap: 5px;
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    
    &:last-child {
      border-right: none;
    }
  }
  
  .toolbar-button {
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 13px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.border};
    }
    
    &.active {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
      border-color: ${({ theme }) => theme.colors.primary};
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  .color-picker {
    position: relative;
    
    .color-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: ${({ theme }) => theme.colors.cardBackground};
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: 4px;
      padding: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      width: 200px;
      z-index: 10;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      
      .color-option {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid ${({ theme }) => theme.colors.border};
        
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
  
  .editor-content {
    min-height: 300px;
    padding: 15px;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    outline: none;
    caret-color: ${({ theme }) => theme.colors.primary}; /* Makes caret visible */
    
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    
    p {
      margin-bottom: 1em;
    }
    
    ul, ol {
      margin-bottom: 1em;
      padding-left: 2em;
    }
    
    blockquote {
      border-left: 4px solid ${({ theme }) => theme.colors.primary};
      padding-left: 1em;
      margin-left: 0;
      font-style: italic;
      color: ${({ theme }) => theme.colors.text.secondary};
    }
    
    a {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: underline;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1em;
      
      th, td {
        border: 1px solid ${({ theme }) => theme.colors.border};
        padding: 8px;
      }
      
      th {
        background-color: ${({ theme }) => theme.colors.border}50;
      }
    }
    
    code {
      font-family: monospace;
      background-color: ${({ theme }) => theme.colors.border}50;
      padding: 2px 4px;
      border-radius: 4px;
    }
    
    pre {
      background-color: ${({ theme }) => theme.colors.border}50;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
      margin-bottom: 1em;
      
      code {
        background-color: transparent;
        padding: 0;
      }
    }
  }
`;

const Dashboard = () => {
  const editorContentRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<IBlogPost>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  
  const router = useRouter();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    if (isEditing && currentPost?.content) {
      if (editorContentRef.current) editorContentRef.current.innerHTML = currentPost.content;
    } else if (isModalOpen) {
      editorContentRef.current?.focus();
    }
  }, [isEditing, isModalOpen]);
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog');
      setPosts(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/dashboard/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  const openCreateModal = () => {
    setCurrentPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      coverImage: '', // No default cover image
      author: {
        name: 'Admin',
        avatar: '#3538CD' // Static avatar color
      },
      publishDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };
  
  const openEditModal = (post: IBlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitError('');
    setSubmitSuccess('');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'author') {
        setCurrentPost({
          ...currentPost,
          author: {
            ...currentPost.author as {name: string, avatar: string},
            [child]: value
          }
        });
      }
    } else {
      setCurrentPost({
        ...currentPost,
        [name]: value
      });
    }
    
    // Auto-generate slug from title if creating a new post
    if (name === 'title' && !isEditing) {
      setCurrentPost(prev => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }));
    }
  };
  
  // Handle content changes from the Quill editor
  const handleContentChange = (content: string) => {
    setCurrentPost(prev => ({
      ...prev,
      content
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitError('');
      setSubmitSuccess('');
      
      if (isEditing) {
        await axios.put(`/api/blog/${currentPost.slug}`, currentPost);
        setSubmitSuccess('Post updated successfully');
      } else {
        await axios.post('/api/blog', currentPost);
        setSubmitSuccess('Post created successfully');
      }
      
      // Refresh the post list after successful submit
      await fetchPosts();
      
      // Close modal after a brief delay to show success message
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err: any) {
      console.error('Error saving post:', err);
      setSubmitError(err.response?.data?.message || 'Failed to save post. Please try again.');
    }
  };
  
  const handleDeletePost = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/blog/${slug}`);
        await fetchPosts();
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };
  
  return (
    <>
      <Head>
        <title>Dashboard - Simplify AI</title>
      </Head>
      
      <Container>
        <Header>
          <Title>Simplify AI Dashboard</Title>
          <Nav>
            <Link href="/" passHref>
              <NavButton as="a">View Site</NavButton>
            </Link>
            <NavButton onClick={handleLogout}>Logout</NavButton>
          </Nav>
        </Header>
        
        <Content>
          <ContentHeader>
            <ContentTitle>Blog Posts</ContentTitle>
            <PrimaryButton onClick={openCreateModal}>Create New Post</PrimaryButton>
          </ContentHeader>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {loading ? (
            <LoadingWrapper>
              <p>Loading posts...</p>
            </LoadingWrapper>
          ) : (
            <PostsTable>
              <TableHead>
                <TableRow>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                      No blog posts yet. Create your first post!
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{post.publishDate}</TableCell>
                      <TableCell>
                        <ActionButton
                          onClick={() => openEditModal(post)}
                          title="Edit"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                          </svg>
                        </ActionButton>
                        <DeleteButton
                          onClick={() => handleDeletePost(post.slug)}
                          title="Delete"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                          </svg>
                        </DeleteButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </tbody>
            </PostsTable>
          )}
        </Content>
      </Container>
      
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
            {submitSuccess && <SuccessMessage>{submitSuccess}</SuccessMessage>}
            
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={currentPost.title || ''}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={currentPost.slug || ''}
                    onChange={handleInputChange}
                    required
                    disabled={isEditing}
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={currentPost.category || ''}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    name="publishDate"
                    value={currentPost.publishDate || ''}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="author.name">Author Name</Label>
                <Input
                  id="author.name"
                  name="author.name"
                  value={currentPost.author?.name || ''}
                  onChange={handleInputChange}
                  required
                />
                {/* Hidden static avatar - always uses the same value */}
                <input 
                  type="hidden" 
                  id="author.avatar" 
                  name="author.avatar" 
                  value="#3538CD"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                {currentPost.coverImage ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={currentPost.coverImage} 
                      alt="Cover Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        display: 'block',
                        marginBottom: '0.5rem',
                        borderRadius: '4px'
                      }} 
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentPost({
                        ...currentPost,
                        coverImage: ''
                      })}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'red',
                        cursor: 'pointer',
                        padding: '0.25rem 0',
                        fontSize: '0.875rem'
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          
                          // Create form data
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          try {
                            // Upload the image
                            const response = await axios.post('https://api.dragify.ai/general/uploader-secret', formData, {
                              headers: {
                                'Content-Type': 'multipart/form-data',
                                'x-api-key': 'uLdiVUo67043G997lIua'
                              }
                            });
                            
                            // Update post with image path
                            setCurrentPost({
                              ...currentPost,
                              coverImage: response.data.url
                            });
                          } catch (error) {
                            console.error('Error uploading image:', error);
                            alert('Failed to upload image. Please try again.');
                          }
                        }
                      }}
                    />
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'gray', 
                      marginTop: '0.5rem' 
                    }}>
                      Upload a JPG, PNG or GIF image (max 5MB)
                    </div>
                  </div>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={currentPost.excerpt || ''}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="content">Content (Rich Text)</Label>
                <RichTextEditor>
                  <div className="toolbar">
                    <div className="toolbar-group">
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Paragraph"
                        onClick={() => document.execCommand('formatBlock', false, 'p')}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h2v4h2v-4h2v-2h-6v2zm4-8v2h2v-2h-2zm-6 0h2v-2h-2v2z"/><path d="M11 6h10v2h-10v-2zm-8 4h18v2h-18v-2zm0 4h18v2h-18v-2zm8 4h10v2h-10v-2z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Heading 1"
                        onClick={() => document.execCommand('formatBlock', false, 'h1')}
                      >
                        H1
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Heading 2"
                        onClick={() => document.execCommand('formatBlock', false, 'h2')}
                      >
                        H2
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Heading 3"
                        onClick={() => document.execCommand('formatBlock', false, 'h3')}
                      >
                        H3
                      </button>
                    </div>
                    
                    <div className="toolbar-group">
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Bold"
                        onClick={() => document.execCommand('bold', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 11.8c1-.7 1.6-1.8 1.6-2.8a4 4 0 0 0-4-4H7v14h7.3c2 0 3.7-1.7 3.7-3.7 0-1.5-.9-2.8-2.4-3.5zM10 7.5h3v2h-3v-2zm3.5 9H10v-2h3.5c.8 0 1.5.7 1.5 1.5s-.7.5-1.5.5z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Italic"
                        onClick={() => document.execCommand('italic', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.2l-3.4 9H6v3h8v-3h-2.2l3.4-9H18V4h-8z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Underline"
                        onClick={() => document.execCommand('underline', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.3 0 6-2.7 6-6V3h-2.5v8c0 1.9-1.6 3.5-3.5 3.5S8.5 12.9 8.5 11V3H6v8c0 3.3 2.7 6 6 6zm-7 3v2h14v-2H5z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Strikethrough"
                        onClick={() => document.execCommand('strikeThrough', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29a5.73 5.73 0 0 1 1.7-.83c.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.8h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Text Color"
                        onClick={() => {
                          const color = prompt('Enter color (hex, rgb, or name):', '#000000');
                          if (color) {
                            document.execCommand('foreColor', false, color);
                          }
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 3h2v18h-2z"/><path d="M5.5 8h13v2h-13z" transform="rotate(90 12 9)"/><path fillOpacity=".36" d="M8 20h8v2H8z"/></svg>
                      </button>
                    </div>
                    
                    <div className="toolbar-group">
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Bulleted List"
                        onClick={() => document.execCommand('insertUnorderedList', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Numbered List"
                        onClick={() => document.execCommand('insertOrderedList', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Indent"
                        onClick={() => document.execCommand('indent', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Outdent"
                        onClick={() => document.execCommand('outdent', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zM7 16V8l-4 4 4 4zm4 1h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>
                      </button>
                    </div>
                    
                    <div className="toolbar-group">
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Link"
                        onClick={() => {
                          const url = prompt('Enter link URL:', 'https://');
                          if (url) {
                            document.execCommand('createLink', false, url);
                          }
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Image"
                        onClick={() => {
                          // Create a file input element
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.accept = 'image/*';
                          fileInput.style.display = 'none';
                          document.body.appendChild(fileInput);
                          
                          // Handle file selection
                          fileInput.onchange = async (e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.files && target.files[0]) {
                              const file = target.files[0];
                              
                              // Create form data
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              try {
                                // Show loading indicator in the editor
                                const placeholder = `[Uploading ${file.name}...]`;
                                document.execCommand('insertText', false, placeholder);
                                
                                // Upload the image
                                const response = await axios.post('https://api.dragify.ai/general/uploader-secret', formData, {
                                  headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'x-api-key': 'uLdiVUo67043G997lIua'
                                  }
                                });
                                
                                // Replace the placeholder with the actual image
                                const selection = document.getSelection();
                                if (selection) {
                                  const range = selection.getRangeAt(0);
                                  const content = document.querySelector('.editor-content');
                                  if (content) {
                                    // Find and replace the placeholder text
                                    const html = content.innerHTML;
                                    const newHtml = html.replace(placeholder, `<img src="${response.data.url}" alt="${file.name}" style="max-width: 100%;">`);
                                    
                                    // Update the editor content
                                    content.innerHTML = newHtml;
                                    
                                    // Update the currentPost state with the new content
                                    const target = content as HTMLDivElement;
                                    handleContentChange(target.innerHTML);
                                  }
                                }
                              } catch (error) {
                                console.error('Error uploading image:', error);
                                alert('Failed to upload image. Please try again.');
                              } finally {
                                // Remove the file input
                                document.body.removeChild(fileInput);
                              }
                            }
                          };
                          
                          // Trigger the file input click
                          fileInput.click();
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Blockquote"
                        onClick={() => document.execCommand('formatBlock', false, 'blockquote')}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
                      </button>
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Code"
                        onClick={() => {
                          const selection = document.getSelection();
                          if (selection) {
                            const range = selection.getRangeAt(0);
                            const code = document.createElement('code');
                            code.textContent = selection.toString();
                            range.deleteContents();
                            range.insertNode(code);
                          }
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
                      </button>
                    </div>
                    
                    <div className="toolbar-group">
                      <button 
                        type="button" 
                        className="toolbar-button" 
                        title="Clear Formatting"
                        onClick={() => document.execCommand('removeFormat', false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/></svg>
                      </button>
                    </div>
                  </div>
                  <div 
                    ref={ editorContentRef }
                    className="editor-content" 
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    // dangerouslySetInnerHTML={{ __html: currentPost.content || '' }}
                    onInput={(e) => {
                      const target = e.target as HTMLDivElement;
                      handleContentChange(target.innerHTML);
                    }}
                  />
                </RichTextEditor>
              </FormGroup>
              
              <FormActions>
                <CancelButton type="button" onClick={closeModal}>Cancel</CancelButton>
                <SubmitButton type="submit">{isEditing ? 'Update Post' : 'Create Post'}</SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default withAuth(Dashboard);