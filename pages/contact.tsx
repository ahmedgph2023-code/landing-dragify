import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocalization } from '@/context/LocalizationContext';

const MainContent = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeroSection = styled.section`
  padding: 10rem 1.5rem 4rem;
  text-align: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.background} 0%, 
    ${({ theme }) => theme.colors.cardBackground} 100%);
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

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContentSection = styled.section`
  padding: 4rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 868px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const FormSection = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2.5rem;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent.blue}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent.blue}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.accent.blue}40;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: 1rem;
  background-color: #10b98120;
  border: 1px solid #10b981;
  border-radius: 8px;
  color: #10b981;
  text-align: center;
  font-weight: 500;
`;

const ErrorMessage = styled(motion.div)`
  padding: 1rem;
  background-color: #ef444420;
  border: 1px solid #ef4444;
  border-radius: 8px;
  color: #ef4444;
  text-align: center;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const InfoSection = styled(motion.div)``;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const InfoDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const ContactInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const ContactIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}20, ${({ theme }) => theme.colors.accent.purple}20);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const ContactDetails = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.5;
  }
  
  a {
    color: ${({ theme }) => theme.colors.accent.blue};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Contact = () => {
   const { t } = useLocalization();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
         <title>{t("contact.meta.title")}</title>
         <meta
         name="description"
         content={t("contact.meta.description")}
         />
      </Head>
      
        <MainContent>
          <HeroSection>
            <Title
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t("contact.hero.title")}
            </Title>
            <Subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("contact.hero.subtitle")}
            </Subtitle>
          </HeroSection>
          
          <ContentSection>
            <ContactGrid>
              <FormSection
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <FormTitle>{t("contact.form.title")}</FormTitle>
                
                {isSubmitted ? (
                  <SuccessMessage
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {t("contact.form.successMessage")}
                  </SuccessMessage>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    {error && (
                      <ErrorMessage
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {error}
                      </ErrorMessage>
                    )}
                    <FormGroup>
                      <Label htmlFor="name">{t("contact.form.fields.name.label")}</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("contact.form.fields.name.label")}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="email">{t("contact.form.fields.email.label")}</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("contact.form.fields.email.label")}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="message">{t("contact.form.fields.message.label")}</Label>
                      <TextArea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("contact.form.fields.message.placeholder")}
                        required
                      />
                    </FormGroup>
                    
                    <SubmitButton
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                     {isSubmitting
                    ? t("contact.form.submit.sending")
                    : t("contact.form.submit.send")}
                    </SubmitButton>
                  </Form>
                )}
              </FormSection>
              
              <InfoSection
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <InfoTitle>{t("contact.info.title")}</InfoTitle>
                <InfoDescription>
                  {t("contact.info.description")}
                </InfoDescription>
                
                <ContactInfoList>
                  <ContactInfoItem>
                    <ContactIcon>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </ContactIcon>
                    <ContactDetails>
                      <h4>{t("contact.info.email")}</h4>
                      <p><a href="mailto:Sales@Cloudilic.com">Sales@Cloudilic.com</a></p>
                    </ContactDetails>
                  </ContactInfoItem>
                  
                  <ContactInfoItem>
                    <ContactIcon>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </ContactIcon>
                    <ContactDetails>
                      <h4>{t("contact.info.address")}</h4>
                      <p>PPB8-9 Rihana Plaza Maadi Cairo</p>
                    </ContactDetails>
                  </ContactInfoItem>
                  
                  <ContactInfoItem>
                    <ContactIcon>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </ContactIcon>
                    <ContactDetails>
                      <h4>{t("contact.info.phone")}</h4>
                      <p><a href="tel:+201005307391">+201005307391</a></p>
                    </ContactDetails>
                  </ContactInfoItem>
                </ContactInfoList>
              </InfoSection>
            </ContactGrid>
          </ContentSection>
        </MainContent>
    </>
  );
};

export default Contact;
