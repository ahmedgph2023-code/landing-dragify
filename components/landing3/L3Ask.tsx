import { useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Display,
  GradientWord,
  Kicker,
  Lead,
  Reveal,
  useL3,
} from './shared';

export default function L3Ask() {
  const { c } = useL3();
  const items = (c('ask.items') as { q: string; a: string }[]) || [];
  const [open, setOpen] = useState(0);

  return (
    <Wrap id="ask">
      <Container>
        <Layout>
          <Side>
            <Reveal>
              <Kicker>{c('ask.kicker')}</Kicker>
              <Display>
                {c('ask.titlePre')}{' '}
                <GradientWord>{c('ask.titleGrad')}</GradientWord>
              </Display>
              <Lead>{c('ask.sub')}</Lead>
            </Reveal>
          </Side>

          <List>
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <Item key={it.q} $open={isOpen}>
                  <Q type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span>{it.q}</span>
                    <Icon $open={isOpen} aria-hidden />
                  </Q>
                  <A $open={isOpen}>
                    <div>{it.a}</div>
                  </A>
                </Item>
              );
            })}
          </List>
        </Layout>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.section`
  padding-block: clamp(4.5rem, 10vw, 7.5rem);
  background: var(--l3-bg-deep);
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 3rem;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Side = styled.div`
  position: sticky;
  top: 6rem;
  @media (max-width: 900px) { position: static; }
`;

const List = styled.div`
  border-top: 1px solid var(--l3-line);
`;

const Item = styled.div<{ $open: boolean }>`
  border-bottom: 1px solid var(--l3-line);
  background: ${({ $open }) => ($open ? 'var(--l3-elevated)' : 'transparent')};
  transition: background 0.25s ease;
`;

const Q = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.25rem 1rem;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: start;
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--l3-ink);
`;

const Icon = styled.span<{ $open: boolean }>`
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: var(--l3-ink);
    transition: transform 0.3s var(--l3-ease), opacity 0.3s ease;
  }
  &::before {
    inset-inline: 0;
    top: 8px;
    height: 2px;
  }
  &::after {
    inset-block: 0;
    left: 8px;
    width: 2px;
    transform: ${({ $open }) => ($open ? 'scaleY(0)' : 'scaleY(1)')};
  }
`;

const A = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.35s var(--l3-ease);
  div {
    overflow: hidden;
    padding: ${({ $open }) => ($open ? '0 1rem 1.2rem' : '0 1rem')};
    color: var(--l3-muted);
    font-size: 0.98rem;
    line-height: 1.65;
  }
`;
