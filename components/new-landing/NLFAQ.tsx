import { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Container, Eyebrow, GradientSpan, Reveal, SectionSubtitle, SectionTitle, useContent } from './shared';

export default function NLFAQ() {
  const { c } = useContent();
  const faqs: { q: string; a: string }[] = c('faq.items');
  const [open, setOpen] = useState(0);

  return (
    <Wrap>
      <Container $width={860}>
        <Reveal>
          <Head>
            <Eyebrow>{c('faq.eyebrow')}</Eyebrow>
            <SectionTitle>
              {c('faq.title')} <GradientSpan>{c('faq.titleGradient')}</GradientSpan>
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>{c('faq.subtitle')}</SectionSubtitle>
          </Head>
        </Reveal>

        <List>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <Row $open={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <Question>
                    {f.q}
                    <Plus $open={isOpen}>
                      <span />
                      <span />
                    </Plus>
                  </Question>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Answer>{f.a}</Answer>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Row>
              </Reveal>
            );
          })}
        </List>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  padding: 8rem 0;
  background: var(--nl-bg);
`;

const Head = styled.div`
  text-align: center;
  max-width: 640px;
  margin: 0 auto 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const Row = styled.div<{ $open: boolean }>`
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  background: ${({ $open }) => ($open ? 'var(--nl-surface-strong)' : 'var(--nl-surface)')};
  border: 1px solid ${({ $open }) => ($open ? 'var(--nl-border-strong)' : 'var(--nl-border)')};
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;
`;

const Question = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--nl-text);
`;

const Plus = styled.div<{ $open: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 20px;
  height: 20px;

  span {
    position: absolute;
    background: var(--nl-text-dim);
    border-radius: 2px;
    transition: transform 0.3s var(--nl-ease-out), opacity 0.3s ease;
  }
  span:nth-child(1) { top: 50%; left: 0; width: 100%; height: 1.5px; margin-top: -0.75px; }
  span:nth-child(2) { left: 50%; top: 0; height: 100%; width: 1.5px; margin-left: -0.75px; }

  ${({ $open }) => $open && `span:nth-child(2) { transform: rotate(90deg); opacity: 0; }`}
`;

const Answer = styled.p`
  margin: 1.1rem 0 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--nl-text-dim);
  max-width: 640px;
`;
