import type { ReactElement } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Section, SectionHeader, SectionTitle, SectionDescription, Eyebrow, TiltCard, staggerContainer, revealUp, ease } from './shared';

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, auto);
  grid-template-areas: "a a b c" "a a d d";
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "a a" "b c" "d d";
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    grid-template-areas: "a" "b" "c" "d";
  }
`;

const areaFor = ['a', 'b', 'c', 'd'];

const Cell = styled(TiltCard)<{ $area: string; $accent: 'blue' | 'purple' }>`
  grid-area: ${({ $area }) => $area};
  --spot-color: ${({ theme, $accent }) => ($accent === 'blue' ? `${theme.colors.accent.blue}22` : `${theme.colors.accent.purple}22`)};
  padding: ${({ $area }) => ($area === 'a' ? '2.75rem' : '2rem')};
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: ${({ $area }) => ($area === 'd' ? 'row' : 'column')};
  align-items: ${({ $area }) => ($area === 'd' ? 'center' : 'flex-start')};
  justify-content: ${({ $area }) => ($area === 'a' ? 'flex-end' : 'flex-start')};
  gap: ${({ $area }) => ($area === 'd' ? '1.5rem' : '0')};
  min-height: ${({ $area }) => ($area === 'a' ? '340px' : '160px')};

  @media (max-width: 900px) {
    min-height: 160px;
    padding: 1.75rem;
    flex-direction: column;
  }
`;

const IconWrap = styled.div<{ $big?: boolean }>`
  position: relative;
  z-index: 1;
  width: ${({ $big }) => ($big ? '64px' : '52px')};
  height: ${({ $big }) => ($big ? '64px' : '52px')};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  margin-bottom: ${({ $big }) => ($big ? '1.75rem' : '1.25rem')};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}20, ${({ theme }) => theme.colors.accent.purple}20);
  color: ${({ theme }) => theme.colors.accent.blue};
`;

const CTitle = styled.h3<{ $big?: boolean }>`
  position: relative;
  z-index: 1;
  font-size: ${({ $big }) => ($big ? '1.6rem' : '1.1rem')};
  font-weight: 700;
  margin-bottom: 0.6rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CDesc = styled.p<{ $big?: boolean }>`
  position: relative;
  z-index: 1;
  font-size: ${({ $big }) => ($big ? '1.05rem' : '0.92rem')};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const ReadMore = styled(Link)`
  position: relative;
  z-index: 1;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent.blue};
  margin-top: auto;
`;

const icons: Record<string, ReactElement> = {
  agent: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/></svg>
  ),
  orchestration: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/></svg>
  ),
  deploy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM10 14.17L7.83 12L6.41 13.41L10 17L18 9L16.59 7.58L10 14.17Z" fill="currentColor"/></svg>
  ),
  api: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18ZM6 12H10V14H6V12ZM6 8H14V10H6V8ZM16 16H6V15H16V16ZM18 9H16V8H18V9ZM18 11H16V10H18V11ZM18 13H16V12H18V13ZM18 15H16V14H18V15Z" fill="currentColor"/></svg>
  ),
};

export default function Features() {
  const { t, isRTL } = useLocalization();
  const items = [
    { icon: 'agent', link: '/services/custom-ai-agents', accent: 'blue' as const },
    { icon: 'orchestration', link: '/services/deploy-fast', accent: 'purple' as const },
    { icon: 'deploy', link: '/services/multi-agent-orchestration', accent: 'blue' as const },
    { icon: 'api', link: '/services/scalable-api-connections', accent: 'purple' as const },
  ];

  return (
    <Section id="features">
      <Container>
        <SectionHeader>
          <Eyebrow style={{ justifyContent: 'center' }}>{t('landing2.eyebrows.platform')}</Eyebrow>
          <SectionTitle dangerouslySetInnerHTML={{
            __html: t('features.title').replace(/<highlight>/g, '<span class="gradient-word">').replace(/<\/highlight>/g, '</span>'),
          }} />
          <SectionDescription>{t('features.description')}</SectionDescription>
        </SectionHeader>

        <Grid variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {items.map((item, i) => {
            const big = areaFor[i] === 'a';
            return (
              <Cell key={i} $area={areaFor[i]} $accent={item.accent} variants={revealUp} transition={{ duration: 0.6, ease: ease.out }} max={big ? 5 : 7}>
                <IconWrap $big={big}>{icons[item.icon]}</IconWrap>
                <div style={{ position: 'relative', zIndex: 1, flex: areaFor[i] === 'd' ? 1 : undefined }}>
                  <CTitle $big={big}>{t(`features.items.${i}.title`)}</CTitle>
                  <CDesc $big={big}>{t(`features.items.${i}.description`)}</CDesc>
                  <ReadMore href={item.link}>{t('blog.readMore')} {isRTL ? '←' : '→'}</ReadMore>
                </div>
              </Cell>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
}
