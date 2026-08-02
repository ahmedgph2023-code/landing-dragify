import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocalization } from "../context/LocalizationContext";

const PricingPlansSection = styled.section`
  padding: 2rem 0 5rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled(motion.div)<{ $popular?: boolean }>`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;

  ${({ $popular }) =>
    $popular &&
    `
    transform: scale(1.05);
    
    @media (max-width: 992px) {
      transform: scale(1);
    }
  `}
`;

const PopularBadge = styled.div<{ $isRTL?: boolean }>`
  position: absolute;
  top: 25px;
  ${({ $isRTL }) => ($isRTL ? "left: -40px;" : "right: -40px;")}
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.accent.blue}, 
    ${({ theme }) => theme.colors.accent.purple}
  );
  color: white;
  padding: 0.5rem 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  transform: ${({ $isRTL }) => ($isRTL ? "rotate(-45deg)" : "rotate(45deg)")};
  width: 160px;
  text-align: center;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PlanDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const PlanPrice = styled.div`
  margin-bottom: 1.5rem;
`;

const Price = styled.span`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const BillingCycle = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  flex-grow: 1;
`;

const Feature = styled.li<{ $isRTL?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  gap: 0.75rem;

  svg {
    color: #10b981;
    flex-shrink: 0;
  }
`;

const PlanButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 0.875rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $primary }) =>
    $primary
      ? `
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      
      &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
    `
      : `
      background: transparent;
      color: #3b82f6;
      border: 2px solid #3b82f6;
      
      &:hover {
        background: rgba(59, 130, 246, 0.1);
      }
    `}
`;

interface PricingPlansProps {
  isAnnual?: boolean;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ isAnnual = true }) => {
  const { t, language } = useLocalization();
  const isRTL = language === "ar";

  const plans = [
    {
      name: t("pricing.plans.starter.name"),
      description: t("pricing.plans.starter.description"),
      monthlyPrice: 500,
      annualPrice: 500,
      features: t("pricing.plans.starter.features"),
      popular: false,
      primary: false,
      checkoutUrl: "https://console.dragify.ai/payment/billing?planId=8202",
    },
    {
      name: t("pricing.plans.growth.name"),
      description: t("pricing.plans.growth.description"),
      monthlyPrice: 800,
      annualPrice: 800,
      features: t("pricing.plans.growth.features"),
      popular: true,
      primary: true,
      checkoutUrl: "https://console.dragify.ai/payment/billing?planId=8206",
    },
    {
      name: t("pricing.plans.professional.name"),
      description: t("pricing.plans.professional.description"),
      monthlyPrice: 1500,
      annualPrice: 1500,
      features: t("pricing.plans.professional.features"),
      popular: false,
      primary: false,
      checkoutUrl: "https://console.dragify.ai/payment/billing?planId=8207",
    },
  ];

  return (
    <PricingPlansSection>
      <Container>
        <PlansGrid>
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.name}
              $popular={plan.popular}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}>
              {plan.popular && (
                <PopularBadge $isRTL={isRTL}>
                  {t("pricing.plans.mostPopular")}
                </PopularBadge>
              )}
              <PlanName>{plan.name}</PlanName>
              <PlanDescription>{plan.description}</PlanDescription>
              <PlanPrice>
                <Price>
                  <span className="currency">EGP</span>
                  {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </Price>
                <BillingCycle>{t("pricing.plans.perMonth")}</BillingCycle>
              </PlanPrice>
              <FeaturesList>
                {plan.features.map((feature: any, i: any) => (
                  <Feature key={`${plan.name}-feature-${i}`} $isRTL={isRTL}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7"></path>
                    </svg>
                    {feature}
                  </Feature>
                ))}
              </FeaturesList>
              <PlanButton
                onClick={(_) => {
                  window.open(plan.checkoutUrl, "_blank", "noopener,noreferrer");
                }}
                $primary={plan.primary}>
                {t("pricing.plans.getStarted")}
              </PlanButton>
            </PlanCard>
          ))}
        </PlansGrid>
      </Container>
    </PricingPlansSection>
  );
};

export default PricingPlans;
