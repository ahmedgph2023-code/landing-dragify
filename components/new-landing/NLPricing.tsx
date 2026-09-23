import Link from 'next/link';
import styled from 'styled-components';
import { ArrowIcon, Container, Eyebrow, GlassCard, GradientSpan, MagneticButton, Reveal, SectionSubtitle, SectionTitle, useContent } from './shared';

const checkoutUrls = [
  'https://console.dragify.ai/payment/billing?planId=8202',
  'https://console.dragify.ai/payment/billing?planId=8206',
  'https://console.dragify.ai/payment/billing?planId=8207',
];

export default function NLPricing() {
  const { c } = useContent();
  const plans: { name: string; description: string; price: number; features: string[] }[] = c('pricing.plans');

  return (
    <Wrap>
      <Container>
        <Reveal>
          <Head>
            <Eyebrow>{c('pricing.eyebrow')}</Eyebrow>
            <SectionTitle>
              {c('pricing.title')} <GradientSpan>{c('pricing.titleGradient')}</GradientSpan>
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>{c('pricing.subtitle')}</SectionSubtitle>
          </Head>
        </Reveal>

        <Grid>
          {plans.map((p, i) => {
            const popular = i === 1;
            return (
              <Reveal key={p.name} delay={i * 0.1}>
                <Plan $popular={popular} $hoverLift>
                  {popular && <Badge>{c('pricing.mostPopular')}</Badge>}
                  <PlanName>{p.name}</PlanName>
                  <PlanDesc>{p.description}</PlanDesc>
                  <Price>
                    <span className="currency">EGP</span>
                    {p.price}
                    <span className="cycle">{c('pricing.perMonth')}</span>
                  </Price>
                  <Features>
                    {p.features.map((f) => (
                      <Feature key={f}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={popular ? 'var(--nl-violet)' : 'var(--nl-green)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {f}
                      </Feature>
                    ))}
                  </Features>
                  <MagneticButton href={checkoutUrls[i]} target="_blank" variant={popular ? 'primary' : 'ghost'} style={{ width: '100%', justifyContent: 'center' }}>
                    {c('pricing.ctaLabel')}
                  </MagneticButton>
                </Plan>
              </Reveal>
            );
          })}
        </Grid>

        <Reveal delay={0.3}>
          <FootNote>
            {c('pricing.footnote')} <Link href="/pricing">{c('pricing.footnoteLink')} <ArrowIcon size={14} /></Link>
          </FootNote>
        </Reveal>
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
  max-width: 700px;
  margin: 0 auto 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
`;

const Plan = styled(GlassCard)<{ $popular: boolean }>`
  position: relative;
  padding: 2.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  ${({ $popular }) =>
    $popular &&
    `
    border-color: rgba(139,107,255,0.5);
    background: linear-gradient(165deg, rgba(77,127,255,0.12), rgba(139,107,255,0.05));
    transform: scale(1.03);
  `}
`;

const Badge = styled.div`
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.35rem 0.9rem;
  border-radius: 100px;
  color: #fff;
  background: var(--nl-gradient-brand);
`;

const PlanName = styled.h3`
  font-size: 1.3rem;
  font-weight: 650;
  color: var(--nl-text);
  margin: 0 0 0.5rem;
`;

const PlanDesc = styled.p`
  font-size: 0.9rem;
  color: var(--nl-text-dim);
  margin: 0 0 1.75rem;
  min-height: 2.7rem;
`;

const Price = styled.div`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--nl-text);
  margin-bottom: 1.75rem;

  .currency { font-size: 1rem; font-weight: 600; color: var(--nl-text-dim); margin-inline-end: 0.35rem; }
  .cycle { font-size: 1rem; font-weight: 500; color: var(--nl-text-faint); margin-inline-start: 0.25rem; }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-bottom: 2rem;
  flex: 1;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.92rem;
  color: var(--nl-text-dim);
`;

const FootNote = styled.p`
  text-align: center;
  margin: 3rem 0 0;
  font-size: 0.92rem;
  color: var(--nl-text-faint);

  a {
    color: var(--nl-text);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid var(--nl-border);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
`;
