import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Container, Eyebrow, GradientSpan, Reveal, SectionSubtitle, SectionTitle, useContent } from './shared';

type Item = { label: string; color: string; icon?: ReactNode; mono?: string };

const ICON_ITEMS: Item[] = [
  { label: 'WhatsApp', color: '#25D366', icon: <path d="M7 4h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H10l-4 3v-3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" /> },
  { label: 'Gmail', color: '#EA4335', icon: <path d="M4 6h16v12H4V6Zm0 0 8 7 8-7" fill="none" /> },
  { label: 'Slack', color: '#9b6bff', icon: <rect x="9" y="3" width="6" height="18" rx="2" /> },
  { label: 'Shopify', color: '#95BF47', icon: <path d="M6 9h12l-1 11H7L6 9Zm3 0V7a3 3 0 0 1 6 0v2" fill="none" /> },
  { label: 'Instagram', color: '#f472b6', icon: <rect x="4" y="4" width="16" height="16" rx="5" fill="none" /> },
  { label: 'Messenger', color: '#22d3ee', icon: <path d="M4 12a8 6.5 0 1 1 8 6.4c-1 0-2-.15-2.9-.4L5 20l1-4A6.4 6.4 0 0 1 4 12Z" /> },
  { label: 'CRM', color: '#facc15', icon: <path d="M12 4a5 5 0 0 0-4.9 6H6a3 3 0 0 0 0 6h12a3 3 0 0 0 0-6h-1.1A5 5 0 0 0 12 4Z" /> },
  { label: 'Sheets', color: '#34d399', icon: <path d="M6 3h9l5 5v13H6V3Zm9 0v5h5" fill="none" /> },
];

/** Long-tail integrations rendered as clean monogram tiles — same card, no hand-drawn glyph needed. */
const MONO_ITEMS: Item[] = [
  { label: 'Google Drive', color: '#4285F4', mono: 'GD' },
  { label: 'Outlook', color: '#0A66C2', mono: 'OL' },
  { label: 'Salesforce', color: '#00A1E0', mono: 'SF' },
  { label: 'Notion', color: '#8f8f8f', mono: 'N' },
  { label: 'Telegram', color: '#26A5E4', mono: 'TG' },
  { label: 'Discord', color: '#5865F2', mono: 'DC' },
  { label: 'Trello', color: '#0079BF', mono: 'TR' },
  { label: 'Asana', color: '#F06A6A', mono: 'AS' },
  { label: 'HubSpot', color: '#FF7A59', mono: 'HS' },
  { label: 'Zendesk', color: '#03363D', mono: 'ZD' },
  { label: 'Stripe', color: '#635BFF', mono: '$' },
  { label: 'Teams', color: '#6264A7', mono: 'TM' },
  { label: 'Calendly', color: '#006BFF', mono: 'CL' },
  { label: 'Zoom', color: '#2D8CFF', mono: 'ZM' },
  { label: 'Airtable', color: '#F82B60', mono: 'AT' },
  { label: 'Mailchimp', color: '#FFE01B', mono: 'MC' },
  { label: 'Dropbox', color: '#0061FF', mono: 'DB' },
  { label: 'Jira', color: '#2684FF', mono: 'JR' },
  { label: 'Linear', color: '#5E6AD2', mono: 'LN' },
  { label: 'Figma', color: '#A259FF', mono: 'FG' },
];

const ALL_ITEMS: Item[] = [...ICON_ITEMS, ...MONO_ITEMS];

function chunk<T>(arr: T[], parts: number): T[][] {
  const out: T[][] = Array.from({ length: parts }, () => []);
  arr.forEach((item, i) => out[i % parts].push(item));
  return out;
}

const ROWS = chunk(ALL_ITEMS, 3);

function IntegrationCard({ item }: { item: Item }) {
  return (
    <Card>
      <Bubble style={{ background: `${item.color}1c` }}>
        {item.icon ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={item.color} stroke={item.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {item.icon}
          </svg>
        ) : (
          <Mono style={{ color: item.color }}>{item.mono}</Mono>
        )}
      </Bubble>
      <CardLabel>{item.label}</CardLabel>
    </Card>
  );
}

export default function NLIntegrations() {
  const { c } = useContent();

  return (
    <Wrap id="integrations">
      <Container>
        <Reveal>
          <Head>
            <Eyebrow>{c('integrations.eyebrow')}</Eyebrow>
            <SectionTitle style={{ textAlign: 'center' }}>
              {c('integrations.title')} <GradientSpan>{c('integrations.titleGradient')}</GradientSpan>
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto', textAlign: 'center' }}>{c('integrations.subtitle')}</SectionSubtitle>
            <Stat>
              <strong>{c('integrations.statNumber')}</strong> {c('integrations.statLabel')}
            </Stat>
          </Head>
        </Reveal>
      </Container>

      <Reveal delay={0.1}>
        <Wall>
          {ROWS.map((row, i) => (
            <Row key={i} $duration={34 + i * 8} $reverse={i % 2 === 1}>
              {[...row, ...row].map((item, j) => (
                <IntegrationCard key={`${item.label}-${j}`} item={item} />
              ))}
            </Row>
          ))}
        </Wall>
      </Reveal>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  padding: 8rem 0;
  background: var(--nl-bg);
  overflow: hidden;
`;

const Head = styled.div`
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Stat = styled.div`
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: var(--nl-text-dim);
  text-align: center;

  strong {
    color: var(--nl-text);
    font-size: 1.4rem;
    display: block;
    margin-bottom: 0.25rem;
  }
`;

const Wall = styled.div`
  margin-top: 4.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
`;

const Row = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 1rem;
  width: max-content;
  animation: ${({ $reverse }) => ($reverse ? 'nlIntegMarqueeRev' : 'nlIntegMarquee')} ${({ $duration }) => $duration}s linear infinite;

  @keyframes nlIntegMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes nlIntegMarqueeRev { from { transform: translateX(-50%); } to { transform: translateX(0); } }

  &:hover { animation-play-state: paused; }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Card = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 1.15rem 0.7rem 0.7rem;
  border-radius: 13px;
  background: var(--nl-bg-elevated);
  border: 1px solid var(--nl-border);
  box-shadow: var(--nl-card-inset), var(--nl-shadow-sm);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: var(--nl-border-strong);
    box-shadow: var(--nl-card-inset), var(--nl-shadow-md);
  }
`;

const Bubble = styled.div`
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Mono = styled.span`
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const CardLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--nl-text-dim);
  white-space: nowrap;
`;
