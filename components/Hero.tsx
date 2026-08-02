import { motion, Variants } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { Workflow } from './workflow';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useLocalization } from '../context/LocalizationContext';

export default function Hero() {
  const [textIndex, setTextIndex] = React.useState(0);
  const [displayedText, setDisplayedText] = React.useState('');
  const [charIndex, setCharIndex] = React.useState(0);
  const themeData = useTheme();
  const { t, language } = useLocalization();
  
  const writerTexts = t('hero.writerTexts') || ['Acts', 'Thinks', 'Leaps'];

  // Reset animation when language changes
  React.useEffect(() => {
    setDisplayedText('');
    setCharIndex(0);
    setTextIndex(0);
  }, [writerTexts]);

  // ---
  React.useEffect(() => {
    const currentText = writerTexts[textIndex];

    if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + currentText.charAt(charIndex));
          setCharIndex(prev => prev + 1);
        }, 100);
        return () => clearTimeout(timeout);
    } else {
        const pause = setTimeout(() => {
          setDisplayedText('');
          setCharIndex(0);
          setTextIndex(prev => (prev + 1) % writerTexts.length);
        }, 2000);
        return () => clearTimeout(pause);
    }
  }, [charIndex, textIndex, writerTexts]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <HeroSection>
      <Container>
        <Content
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Title variants={itemVariants}>
            <span dangerouslySetInnerHTML={{
              __html: t('hero.title')
                .replace('{displayedText}', displayedText)
                .replace(/<highlight>/g, '<span class="highlight">')
                .replace(/<\/highlight>/g, '</span>')
            }} />
            <span className="blinker">|</span>
          </Title>
          <Subtitle variants={itemVariants}>
            {t('hero.subtitle')}
          </Subtitle>
          <CTA variants={itemVariants}>
            <PrimaryButton onClick={ _=> window.open('https://console.dragify.ai/', '_blank') }>{t('hero.getStarted')}</PrimaryButton>
            <SecondaryButton onClick={ _=> window.open('https://calendly.com/cloudilic', '_blank') }>{t('hero.requestDemo')}</SecondaryButton>
          </CTA>
          <div style={{ marginTop: '10px' }}>
            <Link href="#" target="_blank" style={{ marginRight: '20px' }}>
              <Image src="/placee.png" alt="" width={ 170 } height={ 80 } style={{ objectFit: 'contain' }} />
            </Link>
            <Link href="https://www.f6s.com/cloudilic" target="_blank">
              <Image src={ themeData.isDarkMode ? '/topLight.png' : '/topp.png' } alt="" width={ 225 } height={ 90 } style={{ objectFit: 'contain' }} />
            </Link>
          </div>
        </Content>
        <ImageContainer
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          style={{ height: 500 }}
          $isRTL={language === 'ar'}
        >
          <div className="mIcon">
            <Image src="/robot.png" alt="" width={ 45 } height={ 45 } />
          </div>
          <Workflow />
        </ImageContainer>
      </Container>
    </HeroSection>
  );
};

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8rem 0 4rem;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
  height: 100vh;

  .blinker {
    color: #3A59EB;
    animation: blink 1s step-start infinite;
    @keyframes blink { 50% { opacity: 0 }};
  }
  @media (max-width: 1200px) {
    height: auto;
  }
`;

const Container = styled.div`
  width: 100% ;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Content = styled(motion.div)`
  min-width: 560px;
  width: 560px;
  
  @media (max-width: 1200px) {
    max-width: 100%;
    margin-bottom: 3rem;
  }
  @media (max-width: 768px) {
    min-width: 100%;
    width: 100%;
  }
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  
  .highlight {
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.accent.blue}, 
      ${({ theme }) => theme.colors.accent.purple}
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Highlight = styled.span`
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.accent.blue}, 
    ${({ theme }) => theme.colors.accent.purple}
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CTA = styled(motion.div)`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 1200px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.accent.blue}, 
    ${({ theme }) => theme.colors.accent.purple}
  );
  color: white;
  border: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent.blue};
    color: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const ImageContainer = styled(motion.div)<{ $isRTL: boolean }>`
  direction: ltr !important;
  position: relative;
  width: calc(100% + 99px);
  height: 500px;
  z-index: 99;

  &::before {
    content: '';
    position: absolute;
    bottom: -1%;
    left: 2.5%;
    background-color: rgba(255, 255, 255, 0.98);
    border: 1px solid #e6e6e6;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px 0px;
    transform: perspective(1000px) rotateX(4deg) rotateY(-26deg) rotateZ(4deg);
    border-radius: 25px;
    width: 90%;
    height: 58%;
    z-index: -1;
  }
  .mIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 180px;
    ${({ $isRTL }) => $isRTL ? 'left: 0;' : 'right: 0;'}
    width: 70px;
    height: 70px;
    padding: 7.5px;
    z-index: 99;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px 0px;
    background-color: #fff;
    border-radius: 15px;
    animation: floatUpDown 2s ease-in-out infinite;

    @keyframes floatUpDown {
      0%, 100% {
        transform: translateY(-5px);
      }
      50% {
        transform: translateY(5px); /* ممكن تغير الرقم حسب النسبة اللي تحبها */
      }
    }
  }
  .react-flow {
    z-index: 99;
    pointer-events: none !important;
    // overscroll-behavior: auto !important;

    .react-flow__edge-path {
        stroke: #059CFB; // #565c6e
        stroke-width: 2px;
        pointer-events: none !important;
    }
    .react-flow__pane, .react-flow__edge, .react-flow__node {
        cursor: default !important;
        pointer-events: none !important;
    }
    .react-flow__handle {
      opacity: 0;
    }
  }
  .customNode {
    position: relative;
    cursor: default !important;
    background-color: rgba(255, 255, 255, 0.96);
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px 0px;
    border: 1px solid #d9d9d9;
    color: #0B0E13;
    width: 370px;
    border-radius: 15px;
    padding: 20px 17px;
    z-index: 1;

    &.autoWidth {
        width: 190px;
    }
    .animated {
        opacity: 0;
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        transition: all .2s ease-in-out;

        &.start {
          opacity: 1;
          .border-box:before, .border-box-glow:before {
              animation: rotate 3s linear 1;
          }
        }
        .border-box:after {
          content: '';
          position: absolute;
          z-index: -1;
          left: 5px;
          top: 5px;
          width: calc(100% - 10px);
          height: calc(100% - 10px);
          background-color: rgba(255, 255, 255, 0.96);
          border-radius: 7px;
        }
        .border-box, .border-box-glow{
          height: 100%;
          width: 100%;
          position: absolute;
          overflow: hidden; 
          z-index: 0;
          border-radius: 10px;
        }
        .border-box:before, .border-box-glow:before {
          content: '';
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(180deg);
          position: absolute;
          width: 99999px;
          height: 99999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(rgba(0,0,0,0), rgba(5, 156, 251, 0.8), rgba(0,0,0,0) 50%);
        }
        @keyframes rotate {
          100% {
              transform: translate(-50%, -50%) rotate(540deg);
          }
        }
    }
    .trigger {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
        gap: 15px;

        h3 {
          position: relative;
          top: 5px;
          font-weight: 400;
          font-size: 24px;
          color: #1e293b;
          margin: 0;
        }
    }
    .ai {
        display: inline-flex;
        align-items: center;
        background-color: rgba(5, 156, 251, 0.125);
        border-radius: 5px;
        padding: 3px 10px;
        font-size: 15px;
        color: #059CFB;
        gap: 7.5px;

        img {
          margin: 0;
        }
    }
    .info {
        display: flex;
        align-items: center;
        margin: 7.5px 0 10px;
        gap: 15px;

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(5, 156, 251, 0.3);
          width: 65px;
          height: 65px;
          border-radius: 50%;
          margin: 0;
          padding-top: 5px;

          img {
            object-fit: contain;
          }
        }
        h3 {
          font-weight: 400;
          font-size: 23px;
          color: #1e293b;
          margin-bottom: 0;
        }
        span {
          color: #025e97;
          font-size: 20px;
        }
    }
    .apps {
        position: relative;
        display: flex;
        align-items: center;
        height: 40px;
        gap: 10px;

        img {
          margin: 0;
          object-fit: contain;
        }
        &.start {
          img {
              animation: zoomLoop 2s ease-in-out 1;

              &:nth-of-type(1) {
                animation-delay: 0s;
              }
              &:nth-of-type(2) {
                animation-delay: 0.8333333333333334s;
              }
              &:nth-of-type(3) {
                animation-delay: 1.6666666666666667s;
              }
              &:nth-of-type(4) {
                animation-delay: 2.5s;
              }
              @keyframes zoomLoop {
                0% { width: 25px; height: 25px }
                25% { width: 35px; height: 35px }
                55% { width: 25px; height: 25px }
                100% { width: 25px; height: 25px }
              }
          }
        }
    }
  }
  @media (max-width: 1200px) {
    width: 100%;
  }
  @media (max-width: 650px) {
    width: 100%;
    height: 400px;
  }
`;