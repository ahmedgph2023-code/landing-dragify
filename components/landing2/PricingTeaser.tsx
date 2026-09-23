import Link from 'next/link';
import styled from 'styled-components';
import { useLocalization } from '../../context/LocalizationContext';
import { Container, Section, SectionHeader, Eyebrow, SectionTitle, SectionDescription, TiltCard, GhostLink, Reveal } from './shared';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  align-items: center;

  @media (max-width: 900px) { grid-template-columns: 1fr; max-width: 420px; margin-inline: auto; }
`;

const PlanCard = styled(TiltCard)<{ $popular?: boolean }>`
  padding: 2.25rem;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  background: ${({ theme, $popular }) => ($popular ? theme.colors.background : theme.colors.cardBackground)};
  border: 1px solid ${({ theme, $popular }) => ($popular ? theme.colors.accent.blue : theme.colors.border)};
  --spot-color: ${({ theme }) => theme.colors.accent.blue}22;
  ${({ $popular, theme }) => $popular && `box-shadow: ${theme.shadows.large}; transform: scale(1.05);`}

  @media (max-width: 900px) {
    ${({ $popular }) => $popular && `transform: scale(1);`}
  }
`;

const Badge = styled.div`
  position: relative;
  z-index: 1;
  align-self: flex-start;
  background: linear-gradient(100deg, ${({ theme }) => theme.colors.accent.blue}, ${({ theme }) => theme.colors.accent.purple});
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.85rem;
  border-radius: 50px;
  margin-bottom: 1.25rem;
`;

const PlanName = styled.h3`
  position: relative;
  z-index: 1;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PlanDesc = styled.p`
  position: relative;
  z-index: 1;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const Price = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-bottom: 1.75rem;
`;

const Amount = styled.span`
  font-size: 2.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Currency = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Cycle = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FeatureList = styled.ul`
  position: relative;
  z-index: 1;
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
  flex-grow: 1;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.7rem;
  svg { color: #10b981; flex-shrink: 0; }
`;

const CTAButton = styled.a<{ $primary?: boolean }>`
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.85rem;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: transform 0.25s ease;
  ${({ $primary, theme }) => $primary
    ? `background: linear-gradient(100deg, ${theme.colors.accent.blue}, ${theme.colors.accent.purple}); color: white;`
    : `background: transparent; border: 1px solid ${theme.colors.border}; color: ${theme.colors.text.primary};`}
  &:hover { transform: translateY(-2px); }
`;

const FooterRow = styled.div`
  text-align: center;
`;

export default function PricingTeaser() {
  const { t, isRTL } = useLocalization();

  const plans = [
    { key: 'starter', price: 500, popular: false },
    { key: 'growth', price: 800, popular: true },
    { key: 'professional', price: 1500, popular: false },
  ];

  return (
    <Section>
      <Container>
        <SectionHeader>
          <Eyebrow style={{ justifyContent: 'center' }}>{t('landing2.pricingTeaser.eyebrow')}</Eyebrow>
          <SectionTitle>{t('landing2.pricingTeaser.title')}</SectionTitle>
          <SectionDescription>{t('pricing.header.description')}</SectionDescription>
        </SectionHeader>

        <Grid>
          {plans.map((plan, i) => (
            <Reveal key={plan.key} delay={i * 0.08}>
              <PlanCard $popular={plan.popular} max={6}>
                {plan.popular && <Badge>{t('pricing.plans.mostPopular')}</Badge>}
                <PlanName>{t(`pricing.plans.${plan.key}.name`)}</PlanName>
                <PlanDesc>{t(`pricing.plans.${plan.key}.description`)}</PlanDesc>
                <Price>
                  <Currency>EGP</Currency>
                  <Amount>{plan.price}</Amount>
                  <Cycle>{t('pricing.plans.perMonth')}</Cycle>
                </Price>
                <FeatureList>
                  {(t(`pricing.plans.${plan.key}.features`) as string[]).map((feature) => (
                    <FeatureItem key={feature}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                      {feature}
                    </FeatureItem>
                  ))}
                </FeatureList>
                <CTAButton $primary={plan.popular} href="https://console.dragify.ai/" target="_blank" rel="noopener noreferrer">
                  {t('pricing.plans.getStarted')}
                </CTAButton>
              </PlanCard>
            </Reveal>
          ))}
        </Grid>

        <FooterRow>
          <GhostLink as={Link} href="/pricing">
            {t('landing2.pricingTeaser.compareAll')} {isRTL ? '←' : '→'}
          </GhostLink>
        </FooterRow>
      </Container>
    </Section>
  );
}
