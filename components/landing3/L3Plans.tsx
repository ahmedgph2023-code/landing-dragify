import Link from 'next/link';
import styled from 'styled-components';
import {
  Arrow,
  Container,
  Display,
  GradientWord,
  Kicker,
  Lead,
  PrimaryCTA,
  Reveal,
  useL3,
} from './shared';

const CHECKOUT = [
  'https://console.dragify.ai/payment/billing?planId=8202',
  'https://console.dragify.ai/payment/billing?planId=8206',
  'https://console.dragify.ai/payment/billing?planId=8207',
];

export default function L3Plans() {
  const { c } = useL3();
  const plans = (c('plans.plans') as {
    name: string;
    description: string;
    price: number;
    features: string[];
  }[]) || [];

  return (
    <Wrap id="plans">
      <Container>
        <Header>
          <Reveal>
            <Kicker>{c('plans.kicker')}</Kicker>
            <Display>
              {c('plans.titlePre')}{' '}
              <GradientWord>{c('plans.titleGrad')}</GradientWord>
            </Display>
            <Lead>{c('plans.sub')}</Lead>
          </Reveal>
        </Header>

        <Grid>
          {plans.map((p, i) => {
            const popular = i === 1;
            return (
              <Reveal key={p.name} delay={i * 0.08}>
                <Card $popular={popular}>
                  {popular && <Badge>{c('plans.mostPopular')}</Badge>}
                  <Name>{p.name}</Name>
                  <Desc>{p.description}</Desc>
                  <Price>
                    <Currency>EGP</Currency>
                    <Amount>{p.price}</Amount>
                    <Per>{c('plans.perMonth')}</Per>
                  </Price>
                  <Features>
                    {p.features.map((f) => (
                      <li key={f}>
                        <Check aria-hidden>✓</Check>
                        {f}
                      </li>
                    ))}
                  </Features>
                  <PrimaryCTA
                    href={CHECKOUT[i] || 'https://console.dragify.ai/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                  >
                    {c('plans.cta')} <Arrow size={14} />
                  </PrimaryCTA>
                </Card>
              </Reveal>
            );
          })}
        </Grid>

        <Foot>
          {c('plans.footnote')}{' '}
          <Link href="/pricing">{c('plans.footnoteLink')}</Link>
        </Foot>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  padding-block: clamp(4.5rem, 10vw, 7.5rem);
  background: var(--l3-bg);
`;

const Header = styled.div`
  max-width: 680px;
  margin: 0 auto 2.75rem;
  text-align: center;
  ${Lead} { margin-inline: auto; }
  ${Kicker}, ${Display} { justify-content: center; }
  ${Display} { text-align: center; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
  align-items: stretch;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin-inline: auto;
  }
`;

const Card = styled.div<{ $popular?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.6rem 1.45rem 1.5rem;
  border-radius: 20px;
  border: 1px solid ${({ $popular }) => ($popular ? 'transparent' : 'var(--l3-line)')};
  background: ${({ $popular }) => ($popular ? 'var(--l3-elevated)' : 'var(--l3-bg-deep)')};
  box-shadow: ${({ $popular }) =>
    $popular
      ? '0 0 0 2px color-mix(in srgb, var(--l3-blue) 70%, var(--l3-violet)), var(--l3-shadow)'
      : 'none'};
  min-height: 100%;
`;

const Badge = styled.div`
  position: absolute;
  top: -11px;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  background: var(--l3-grad-btn);
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  white-space: nowrap;
`;

const Name = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--l3-ink);
  margin: 0.35rem 0 0.4rem;
`;

const Desc = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  color: var(--l3-muted);
  line-height: 1.45;
  min-height: 2.8em;
`;

const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid var(--l3-line);
`;

const Currency = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--l3-faint);
`;

const Amount = styled.span`
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--l3-ink);
  line-height: 1;
`;

const Per = styled.span`
  font-size: 0.88rem;
  color: var(--l3-faint);
`;

const Features = styled.ul`
  list-style: none;
  margin: 0 0 1.4rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  li {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    font-size: 0.92rem;
    color: var(--l3-ink-soft);
    line-height: 1.4;
  }
`;

const Check = styled.span`
  color: var(--l3-blue);
  font-weight: 800;
  flex-shrink: 0;
`;

const Foot = styled.p`
  margin: 1.75rem 0 0;
  text-align: center;
  color: var(--l3-muted);
  font-size: 0.95rem;
  a {
    color: var(--l3-blue) !important;
    font-weight: 700;
    text-decoration: underline !important;
    text-underline-offset: 3px;
  }
`;
