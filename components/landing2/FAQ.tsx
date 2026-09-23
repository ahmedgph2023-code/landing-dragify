import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Section, SectionHeader, Eyebrow, SectionTitle, SectionDescription, Card, Reveal, ease } from './shared';

const List = styled.div`
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled(Card)`
  overflow: hidden;
  transition: border-color 0.3s ease;
`;

const QuestionButton = styled.button<{ $active: boolean }>`
  width: 100%;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.4rem 1.6rem;
  cursor: pointer;
  text-align: start;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme, $active }) => ($active ? theme.colors.accent.blue : theme.colors.text.primary)};
  transition: color 0.25s ease;
`;

const IconPlus = styled(motion.div)`
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;

  &::before, &::after {
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.colors.accent.blue};
    border-radius: 2px;
  }
  &::before { width: 100%; height: 2px; top: 50%; left: 0; transform: translateY(-50%); }
  &::after { width: 2px; height: 100%; left: 50%; top: 0; transform: translateX(-50%); }
`;

const Answer = styled(motion.div)`
  padding-inline: 1.6rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.65;
`;

const AnswerInner = styled.div`
  padding-bottom: 1.4rem;
`;

export default function FAQ() {
  const { t } = useLocalization();
  const [active, setActive] = useState<number | null>(0);
  const items = [0, 1, 2, 3, 4, 5];

  return (
    <Section id="faq">
      <Container>
        <SectionHeader>
          <Eyebrow style={{ justifyContent: 'center' }}>{t('landing2.eyebrows.faq')}</Eyebrow>
          <SectionTitle>{t('faq.title')}</SectionTitle>
          <SectionDescription>{t('faq.description')}</SectionDescription>
        </SectionHeader>

        <List>
          {items.map((i) => (
            <Reveal key={i} delay={i * 0.04} y={16}>
              <Item style={{ borderColor: undefined }}>
                <QuestionButton $active={active === i} onClick={() => setActive(active === i ? null : i)} aria-expanded={active === i}>
                  {t(`faq.items.${i}.question`)}
                  <IconPlus animate={{ rotate: active === i ? 135 : 0 }} transition={{ duration: 0.3, ease: ease.out }} />
                </QuestionButton>
                <AnimatePresence>
                  {active === i && (
                    <Answer initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }}>
                      <AnswerInner>{t(`faq.items.${i}.answer`)}</AnswerInner>
                    </Answer>
                  )}
                </AnimatePresence>
              </Item>
            </Reveal>
          ))}
        </List>
      </Container>
    </Section>
  );
}
