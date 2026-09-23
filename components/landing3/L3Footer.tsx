import Link from 'next/link';
import styled from 'styled-components';
import { Container, useL3 } from './shared';

const hrefs = {
  product: ['#stage', '#teams', '#stack', '/pricing'],
  company: ['/resources/blog', '/contact', '/resources/changelog'],
  resources: ['https://docs.dragify.ai/', '/resources/security', '/resources/integrations'],
  legal: ['/terms', '/privacy', '/refund'],
};

export default function L3Footer() {
  const { c } = useL3();
  const year = new Date().getFullYear();
  const cols = ['product', 'company', 'resources', 'legal'] as const;

  return (
    <Wrap>
      <Container>
        <Top>
          <Brand>
            <BrandName>Dragify AI</BrandName>
            <Tag>{c('footer.tagline')}</Tag>
          </Brand>
          <Cols>
            {cols.map((key) => {
              const col = c(`footer.columns.${key}`) as { title: string; links: string[] };
              return (
                <Col key={key}>
                  <ColTitle>{col.title}</ColTitle>
                  {col.links.map((label, i) => {
                    const href = hrefs[key][i];
                    const external = href.startsWith('http');
                    return external ? (
                      <A key={label} href={href} target="_blank" rel="noopener noreferrer">{label}</A>
                    ) : (
                      <A as={Link} key={label} href={href}>{label}</A>
                    );
                  })}
                </Col>
              );
            })}
          </Cols>
        </Top>
        <Bottom>
          <span>© {year} Dragify AI. {c('footer.copyright')}</span>
          <BottomLinks>
            <A as={Link} href="/terms">{c('footer.bottom.terms')}</A>
            <A as={Link} href="/privacy">{c('footer.bottom.privacy')}</A>
            <A as={Link} href="/refund">{c('footer.bottom.refunds')}</A>
          </BottomLinks>
        </Bottom>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.footer`
  padding: 4.5rem 0 2rem;
  border-top: 1px solid var(--l3-line);
  background: var(--l3-bg-deep);
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--l3-line);
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Brand = styled.div`
  max-width: 280px;
`;

const BrandName = styled.div`
  font-family: inherit;
  font-weight: 750;
  font-size: 1.25rem;
  color: var(--l3-ink);
  margin-bottom: 0.65rem;
`;

const Tag = styled.p`
  margin: 0;
  color: var(--l3-muted);
  font-size: 0.95rem;
  line-height: 1.55;
`;

const Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const ColTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--l3-faint);
  margin-bottom: 0.4rem;
`;

const A = styled.a`
  font-size: 0.92rem;
  color: var(--l3-ink-soft) !important;
  text-decoration: none !important;
  transition: color 0.2s ease;
  &:hover { color: var(--l3-ink) !important; }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--l3-faint);
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.25rem;
`;
