import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';

const FAQSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 700px;
  margin: 0 auto;
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Question = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const QuestionHeader = styled.button<{ $active: boolean }>`
  width: 100%;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  cursor: pointer;
  text-align: left;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, $active }) => !$active && 'rgba(0, 0, 0, 0.03)'};
  }
`;

const Icon = styled.div<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  position: relative;
  transition: transform 0.3s ease;
  transform: ${({ $active }) => $active ? 'rotate(45deg)' : 'rotate(0)'};
  
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &::before {
    width: 100%;
    height: 2px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  
  &::after {
    width: 2px;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
`;

const Answer = styled(motion.div)`
  padding: 0 1.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const AnswerContent = styled.div`
  padding-bottom: 1.25rem;
`;

const FAQ = () => {
  const { t } = useLocalization();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const faqData = [
    {
      question: t('faq.items.0.question'),
      answer: t('faq.items.0.answer')
    },
    {
      question: t('faq.items.1.question'),
      answer: t('faq.items.1.answer')
    },
    {
      question: t('faq.items.2.question'),
      answer: t('faq.items.2.answer')
    },
    {
      question: t('faq.items.3.question'),
      answer: t('faq.items.3.answer')
    },
    {
      question: t('faq.items.4.question'),
      answer: t('faq.items.4.answer')
    },
    {
      question: t('faq.items.5.question'),
      answer: t('faq.items.5.answer')
    }
  ];
  
  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <FAQSection id="faq">
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
{t('faq.title')}
          </Title>
          <Description
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
{t('faq.description')}
          </Description>
        </SectionHeader>
        
        <QuestionsContainer>
          {faqData.map((faq, index) => (
            <Question key={index}>
              <QuestionHeader 
                $active={activeIndex === index}
                onClick={() => toggleQuestion(index)}
                aria-expanded={activeIndex === index}
              >
                {faq.question}
                <Icon $active={activeIndex === index} />
              </QuestionHeader>
              <AnimatePresence>
                {activeIndex === index && (
                  <Answer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnswerContent>
                      <p>{faq.answer}</p>
                    </AnswerContent>
                  </Answer>
                )}
              </AnimatePresence>
            </Question>
          ))}
        </QuestionsContainer>
      </Container>
    </FAQSection>
  );
};

export default FAQ;