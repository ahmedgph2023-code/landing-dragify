import styled from 'styled-components';
import { BrandLogo, Container, Eyebrow, GradientSpan, Reveal, SectionSubtitle, SectionTitle, useContent } from './shared';

function Stars() {
  return (
    <StarRow aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8 5.9 21l1.5-6.8-5.2-4.7 6.9-.7L12 2.5Z" />
        </svg>
      ))}
    </StarRow>
  );
}

function Quote({ r }: { r: { text: string; name: string; role: string } }) {
  return (
    <QuoteBox>
      <QuoteTop>
        <Mark>&ldquo;</Mark>
        <Stars />
      </QuoteTop>
      <Text>{r.text}</Text>
      <Author>
        <Avatar>{r.name.charAt(0)}</Avatar>
        <div>
          <Name>{r.name}</Name>
          <Role>{r.role}</Role>
        </div>
      </Author>
    </QuoteBox>
  );
}

export default function NLTestimonials() {
  const { c } = useContent();
  const reviews: { text: string; name: string; role: string }[] = c('testimonials.items');
  const rowA = [...reviews.slice(0, 3), ...reviews.slice(0, 3)];
  const rowB = [...reviews.slice(3), ...reviews.slice(3)];

  return (
    <Wrap>
      <Container>
        <Reveal>
          <Head>
            <Eyebrow>{c('testimonials.eyebrow')}</Eyebrow>
            <SectionTitle>
              {c('testimonials.title')} <GradientSpan>{c('testimonials.titleGradient')}</GradientSpan>{' '}
              {c('testimonials.titlePost')} <BrandLogo height={34} />
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>{c('testimonials.subtitle')}</SectionSubtitle>
          </Head>
        </Reveal>
      </Container>

      <MarqueeMask>
        <Row $duration={50}>
          {rowA.map((r, i) => <Quote key={i} r={r} />)}
        </Row>
        <Row $duration={56} $reverse style={{ marginTop: '1.5rem' }}>
          {rowB.map((r, i) => <Quote key={i} r={r} />)}
        </Row>
      </MarqueeMask>
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

const MarqueeMask = styled.div`
  /* Clip horizontally only — hovered cards can still lift/glow past the
     row's vertical bounds instead of being cut off by the section edge. */
  overflow-x: hidden;
  overflow-y: visible;
  padding-block: 0.75rem;
  margin-block: -0.75rem;
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
`;

const Row = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 1rem;
  width: max-content;
  animation: ${({ $reverse }) => ($reverse ? 'nlMarqueeRev' : 'nlMarquee2')} ${({ $duration }) => $duration}s linear infinite;

  @keyframes nlMarquee2 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes nlMarqueeRev { from { transform: translateX(-50%); } to { transform: translateX(0); } }

  &:hover { animation-play-state: paused; }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const QuoteBox = styled.div`
  flex-shrink: 0;
  width: 380px;
  padding: 1.85rem 1.85rem 1.6rem;
  border-radius: var(--nl-radius);
  background:
    radial-gradient(80% 60% at 8% 0%, rgba(59,130,246,0.1), transparent 55%),
    var(--nl-bg-elevated);
  border: 1px solid var(--nl-border);
  box-shadow: var(--nl-card-inset), var(--nl-shadow-sm);
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: var(--nl-border-strong);
    transform: translateY(-4px);
    box-shadow: var(--nl-card-inset), var(--nl-shadow-md);
  }
`;

const QuoteTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.4rem;
`;

const StarRow = styled.div`
  display: flex;
  gap: 0.15rem;
  color: #f5b700;
  margin-top: 0.35rem;
`;

const Mark = styled.div`
  font-size: 2.5rem;
  line-height: 1;
  color: var(--nl-violet);
  font-family: Georgia, serif;
`;

const Text = styled.p`
  font-size: 0.98rem;
  line-height: 1.65;
  color: var(--nl-text-dim);
  margin: 0 0 1.75rem;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--nl-border);
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.92rem;
  color: #fff;
  background: var(--nl-gradient-brand);
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--nl-text);
`;

const Role = styled.div`
  font-size: 0.8rem;
  color: var(--nl-text-faint);
`;
