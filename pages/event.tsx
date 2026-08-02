import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const STARTUP_PASS_CODE = 'STARTUPPASS';
const QR_PATH = '/assets/startup-pass-qr.png';

export default function EventPage() {
  const router = useRouter();
  const couponQuery = router.query.coupon;
  const coupon = typeof couponQuery === 'string' ? couponQuery.trim().toUpperCase() : '';
  const hasCoupon = coupon === STARTUP_PASS_CODE;
  const consoleUrl = `https://console.dragify.ai/event?coupon=${encodeURIComponent(coupon || STARTUP_PASS_CODE)}`;

  return (
    <>
      <Head>
        <title>Dragify Startup Automation Pass</title>
        <meta
          name="description"
          content="Activate your Dragify Startup Automation Pass and get free credits to build your first AI agent."
        />
      </Head>

      <PageShell>
        <Hero>
          <HeroCopy>
            <Eyebrow>Free Dragify Startup Credits</Eyebrow>
            <Title>Build Your First AI Agent Today</Title>
            <Subtitle>
              Get free Dragify credits and start automating repetitive startup work in minutes.
            </Subtitle>

            <OfferBlock>
              <OfferLabel>Dragify Startup Automation Pass</OfferLabel>
              <OfferText>Includes 1000 free credits for event attendees.</OfferText>
              <Validity>Valid for 7 days only</Validity>
            </OfferBlock>

            {!hasCoupon ? (
              <ErrorMessage>
                This event link is missing a valid coupon. Please scan the event QR code again.
              </ErrorMessage>
            ) : null}

            <Actions>
              <PrimaryCta aria-disabled={!hasCoupon} href={hasCoupon ? consoleUrl : undefined}>
                Activate My Startup Pass
              </PrimaryCta>
              <SecondaryText>Scan to activate your Startup Automation Pass</SecondaryText>
            </Actions>
          </HeroCopy>

          <QrPanel aria-label="Startup pass QR code">
            <QrImage
              src={QR_PATH}
              alt="QR code for Dragify Startup Automation Pass"
              width={1200}
              height={1200}
              priority
            />
            <QrCaption>STARTUPPASS</QrCaption>
          </QrPanel>
        </Hero>
      </PageShell>
    </>
  );
}

const PageShell = styled.main`
  min-height: calc(100vh - 88px);
  padding: 8rem 1.5rem 4rem;
  background: ${({ theme }) => theme.colors.background};
`;

const Hero = styled.section`
  width: min(1120px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.65fr);
  gap: 3rem;
  align-items: center;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const HeroCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Eyebrow = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.accent.blue};
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  line-height: 1.02;
  letter-spacing: 0;
`;

const Subtitle = styled.p`
  margin: 1.25rem 0 0;
  max-width: 680px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: clamp(1.08rem, 2vw, 1.35rem);
  line-height: 1.65;
`;

const OfferBlock = styled.div`
  margin-top: 2rem;
  padding: 1.25rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: min(560px, 100%);
`;

const OfferLabel = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.25rem;
`;

const OfferText = styled.p`
  margin: 0.5rem 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const Validity = styled.p`
  margin: 0.75rem 0 0;
  color: ${({ theme }) => theme.colors.accent.blue};
  font-weight: 700;
`;

const ErrorMessage = styled.p`
  margin: 1rem 0 0;
  color: #dc2626;
  font-weight: 600;
`;

const Actions = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`;

const PrimaryCta = styled.a`
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.2rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  font-weight: 800;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

  &[aria-disabled='true'] {
    opacity: 0.45;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const SecondaryText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
`;

const QrPanel = styled.aside`
  justify-self: end;
  width: min(360px, 100%);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.medium};

  @media (max-width: 860px) {
    justify-self: start;
  }
`;

const QrImage = styled(Image)`
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
  background: #ffffff;
  border-radius: 6px;
`;

const QrCaption = styled.p`
  margin: 0.85rem 0 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 800;
`;
