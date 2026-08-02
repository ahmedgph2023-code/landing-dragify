import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PricingFAQ from '../components/PricingFAQ';
import PricingPlans from '../components/PricingPlans';
import { useLocalization } from '../context/LocalizationContext';
import Partners from '@/components/Partners';
import Image from 'next/image';

const MainContent = styled.main`
  display: flex;
  flex-direction: column;

  .images {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    margin-top: 30px;

    img {
      margin-bottom: 30px;
      object-fit: contain;
    }
  }
`;

const PricingHeaderSection = styled.section`
  padding: 10rem 0 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 700px;
  margin: 0 auto 3rem;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const PricingToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
`;

const ToggleText = styled.span<{ $active: boolean }>`
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active, theme }) => ($active ? theme.colors.text.primary : theme.colors.text.secondary)};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const ToggleSwitch = styled.div`
  width: 60px;
  height: 30px;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.accent.blue}, 
    ${({ theme }) => theme.colors.accent.purple}
  );
  margin: 0 1rem;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  padding: 2px;
`;

const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  left: ${({ $active }) => ($active ? 'calc(100% - 28px)' : '2px')};
  transition: left 0.3s ease;
`;

const ReviewsSection = styled.section`
  padding: 1rem 0 5rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 568px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const ReviewStars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  color: #fbbf24;
  font-size: 1.25rem;
`;

const ReviewText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.secondary};
  flex: 1;
  margin-bottom: 1.5rem;
`;

const ReviewAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const TrustSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.cardBackground};
`;

const TrustLogosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const TrustLogo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent.blue}15, ${({ theme }) => theme.colors.accent.purple}15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  
  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }
`;

const LogoName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const reviews = [
    {
      stars: 5,
      text: "Dragify AI has completely transformed how we handle customer support. Our response times dropped by 80% and customer satisfaction is at an all-time high.",
      name: "Sarah Mitchell",
      role: "VP of Operations, TechCorp",
      avatar: "/images/reviews/user1.jpg"
    },
    {
      stars: 5,
      text: "The multi-agent orchestration feature is a game-changer. We're processing 10x more data than before with half the resources. Incredible ROI.",
      name: "Michael Chen",
      role: "CTO, DataFlow Inc",
      avatar: "/images/reviews/user2.jpg"
    },
    {
      stars: 5,
      text: "We deployed our first AI agent in under 10 minutes. The one-click deployment is not just marketing — it actually works exactly as advertised.",
      name: "Emily Rodriguez",
      role: "Product Manager, StartupX",
      avatar: "/images/reviews/user3.jpg"
    },
    {
      stars: 5,
      text: "The API connections made integrating with our existing CRM and ERP systems seamless. No more data silos, everything just works together.",
      name: "David Thompson",
      role: "IT Director, GlobalRetail",
      avatar: "/images/reviews/user4.jpg"
    },
    {
      stars: 5,
      text: "Our team was skeptical about AI automation, but Dragify AI proved us wrong. The agents are reliable, accurate, and our team can focus on strategic work.",
      name: "Jennifer Park",
      role: "Head of Innovation, FinanceHub",
      avatar: "/images/reviews/user5.jpg"
    },
    {
      stars: 5,
      text: "Best investment we've made this year. The platform paid for itself within the first month through operational savings alone.",
      name: "Robert Williams",
      role: "CEO, ScaleUp Solutions",
      avatar: "/images/reviews/user6.jpg"
    }
  ];

const Pricing = () => {
  const { t } = useLocalization();
  const [isAnnual, setIsAnnual] = useState(true);
  
  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };
  
  return (
    <>
      <Head>
        <title>Pricing - Dragify AI</title>
        <meta name="description" content="Flexible pricing plans for Dragify AI. Choose the plan that best suits your business needs." />
      </Head>
      
        <MainContent>
          <PricingHeaderSection>
            <Container>
              <Title>{t('pricing.header.title')}</Title>
              <Description>
                {t('pricing.header.description')}
              </Description>
              
              <PricingToggle>
                {/* <ToggleText $active={!isAnnual} onClick={togglePricing}>
                  {t('pricing.header.monthly')}
                </ToggleText> */}
                {/* <ToggleSwitch onClick={togglePricing}>
                  <ToggleKnob $active={isAnnual} />
                </ToggleSwitch>
                */}
                {/* <ToggleText $active={!isAnnual} onClick={togglePricing}> 
                  {t('pricing.header.annually')} 
                  <span style={{ color: '#10b981' }}>{t('pricing.header.save')}</span> 
                </ToggleText> */}
              </PricingToggle>
            </Container>
          </PricingHeaderSection>
          
          <PricingPlans isAnnual={isAnnual} />
          <ReviewsSection>
            <Container>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t('pricing.reviewTitle')}
              </SectionTitle>
              <SectionSubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
               {t('pricing.reviewDescription')}
              </SectionSubtitle>

              <ReviewsGrid>
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <ReviewStars>
                      {[...Array(review.stars)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </ReviewStars>
                    <ReviewText>"{review.text}"</ReviewText>
                    <ReviewAuthor>
                      {/* <AuthorAvatar>
                        <img src={review.avatar} alt={review.name} />
                      </AuthorAvatar> */}
                      <AuthorInfo>
                        <h4>{review.name}</h4>
                        <p>{review.role}</p>
                      </AuthorInfo>
                    </ReviewAuthor>
                  </ReviewCard>
                ))}
              </ReviewsGrid>
            </Container>
          </ReviewsSection>

          <TrustSection>
            <Container>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t('pricing.trustTitle')}
              </SectionTitle>
              <SectionSubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('pricing.trustDescription')}
              </SectionSubtitle>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="images"
              >
                <Image src="/qatarr.svg" alt="logo" width={ 400 } height={ 75 } style={{ marginRight: '40px', marginLeft: '40px' }} />
                <Image src="/f6.png" alt="logo" width={ 180 } height={ 50 } />
                <Image src="/itida1.png" alt="logo" width={ 180 } height={ 50 } />
                <Image src="/TIEC1.png" alt="logo" width={ 180 } height={ 50 } />
              </motion.div>
            </Container>
          </TrustSection>
          <PricingFAQ />
        </MainContent>
    </>
  );
};
export default Pricing;
