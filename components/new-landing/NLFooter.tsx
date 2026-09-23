import Link from 'next/link';
import styled from 'styled-components';
import { BrandLogo, Container, useContent } from './shared';

const hrefs = {
  product: ['#features', '#agents', '#integrations', '/pricing'],
  company: ['/resources/blog', '/contact', '/resources/changelog'],
  resources: ['https://docs.dragify.ai/', '/resources/security', '/resources/integrations'],
  legal: ['/terms', '/privacy', '/refund'],
};

const externalCols: Record<string, boolean[]> = {
  product: [false, false, false, false],
  company: [false, false, false],
  resources: [true, false, false],
  legal: [false, false, false],
};

export default function NLFooter() {
  const { c } = useContent();
  const year = new Date().getFullYear();
  const cols = ['product', 'company', 'resources', 'legal'] as const;

  return (
    <Wrap>
      <Container>
        <Top>
          <Brand>
            <BrandLogo height={36} />
            <Tagline>{c('footer.tagline')}</Tagline>
            <Socials>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.7512 2.96094H20.818L14.1179 10.6187L22 21.0391H15.8284L10.9946 14.7191L5.4636 21.0391H2.39492L9.56132 12.8483L2 2.96094H8.32824L12.6976 8.73762L17.7512 2.96094ZM16.6748 19.2035H18.3742L7.40492 4.70014H5.58132L16.6748 19.2035Z" fill="currentColor"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/dragifyai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8.5 18.5H5.5V9.5H8.5V18.5ZM7 8.4C6.17 8.4 5.5 7.73 5.5 6.9C5.5 6.07 6.17 5.4 7 5.4C7.83 5.4 8.5 6.07 8.5 6.9C8.5 7.73 7.83 8.4 7 8.4ZM18.5 18.5H15.5V13.9C15.5 12.97 14.97 12.5 14.3 12.5C13.63 12.5 13 13.07 13 13.9V18.5H10V9.5H13V10.97C13.33 10.18 14.3 9.3 15.5 9.3C17.08 9.3 18.5 10.63 18.5 12.77V18.5Z" fill="currentColor"/></svg>
              </a>
              <a href="https://github.com/Cloudilic" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1.27C5.99 1.27 1.05 6.22 1.05 12.22C1.05 17.02 4.24 21.1 8.67 22.53C9.21 22.63 9.41 22.31 9.41 22.04C9.41 21.79 9.4 21.02 9.4 20.11C6.2 20.73 5.56 18.67 5.56 18.67C5.07 17.41 4.33 17.09 4.33 17.09C3.33 16.43 4.41 16.44 4.41 16.44C5.51 16.52 6.09 17.55 6.09 17.55C7.08 19.17 8.65 18.72 9.44 18.45C9.54 17.77 9.84 17.32 10.17 17.07C7.61 16.81 4.92 15.91 4.92 11.75C4.92 10.56 5.35 9.58 6.11 8.81C6 8.55 5.62 7.47 6.21 6.01C6.21 6.01 7.15 5.74 9.39 7.24C10.23 7.01 11.13 6.9 12.02 6.89C12.9 6.9 13.79 7.01 14.64 7.24C16.87 5.74 17.81 6.01 17.81 6.01C18.4 7.47 18.02 8.55 17.91 8.81C18.67 9.58 19.1 10.56 19.1 11.75C19.1 15.92 16.4 16.81 13.83 17.06C14.25 17.39 14.62 18.04 14.62 19.03C14.62 20.46 14.6 21.7 14.6 22.04C14.6 22.31 14.8 22.63 15.35 22.52C19.78 21.1 22.96 17.02 22.96 12.22C22.96 6.22 18.02 1.27 12 1.27Z" fill="currentColor"/></svg>
              </a>
            </Socials>
          </Brand>

          <Cols>
            {cols.map((key) => {
              const col = c(`footer.columns.${key}`);
              return (
                <Col key={key}>
                  <ColTitle>{col.title}</ColTitle>
                  {col.links.map((label: string, i: number) =>
                    externalCols[key][i] ? (
                      <ColA key={label} href={hrefs[key][i]} target="_blank" rel="noopener noreferrer">{label}</ColA>
                    ) : (
                      <ColLink key={label} href={hrefs[key][i]}>{label}</ColLink>
                    )
                  )}
                </Col>
              );
            })}
          </Cols>
        </Top>

        <Bottom>
          <CopyLine>
            <span>&copy; {year}</span>
            <BrandLogo height={16} />
            <span>{c('footer.copyright')}</span>
          </CopyLine>
          <BottomLinks>
            <ColLink href="/terms">{c('footer.bottom.terms')}</ColLink>
            <ColLink href="/privacy">{c('footer.bottom.privacy')}</ColLink>
            <ColLink href="/refund">{c('footer.bottom.refunds')}</ColLink>
          </BottomLinks>
        </Bottom>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.footer`
  position: relative;
  padding: 5rem 0 2.5rem;
  background: var(--nl-bg);
  border-top: 1px solid var(--nl-border);
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4rem;
  padding-bottom: 3.5rem;
  border-bottom: 1px solid var(--nl-border);

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const Brand = styled.div`
  max-width: 300px;

  > span:first-child {
    margin-bottom: 0.75rem;
  }
`;

const Tagline = styled.p`
  color: var(--nl-text-dim);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0.75rem 0 1.5rem;
`;

const Socials = styled.div`
  display: flex;
  gap: 0.75rem;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--nl-surface);
    border: 1px solid var(--nl-border);
    color: var(--nl-text-dim);
    transition: color 0.2s ease, border-color 0.2s ease;
    &:hover {
      color: var(--nl-text);
      border-color: var(--nl-border-strong);
    }
  }
`;

const Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  flex: 1;
  max-width: 640px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const ColTitle = styled.h4`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--nl-text-faint);
  margin: 0 0 0.35rem;
`;

const ColLink = styled(Link)`
  font-size: 0.92rem;
  color: var(--nl-text-dim);
  text-decoration: none;
  transition: color 0.2s ease;
  &:hover {
    color: var(--nl-text);
  }
`;

const ColA = styled.a`
  font-size: 0.92rem;
  color: var(--nl-text-dim);
  text-decoration: none;
  transition: color 0.2s ease;
  &:hover {
    color: var(--nl-text);
  }
`;

const Bottom = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--nl-text-faint);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const CopyLine = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
`;
