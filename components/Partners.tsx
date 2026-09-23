import styles from '../styles/Partners.module.css';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import styled from 'styled-components';
import { useLocalization } from '../context/LocalizationContext';
import { PARTNER_LOGOS } from '../lib/particles/sections/homeAssets';

const slickSettings = {
  arrows: false,
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  speed: 5000,
  autoplaySpeed: 0,
  cssEase: 'linear',
  touchMove: false,
  variableWidth: true,
};

export default function Partners() {
  const { t } = useLocalization();

  return (
    <Images className={styles.partners}>
      <div className={styles.container}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('partners.title')}
        </motion.h2>

        <div className="slickImages" style={{ width: '100%' }}>
          <Slider {...slickSettings} pauseOnFocus={false} pauseOnHover={false}>
            {PARTNER_LOGOS.map((logo) => (
              <div key={logo.src}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.w}
                  height={logo.h}
                  style={{ margin: '0 16px', objectFit: 'contain' }}
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="images">
          {PARTNER_LOGOS.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={logo.h}
              style={{ objectFit: 'contain' }}
            />
          ))}
        </div>
      </div>
    </Images>
  );
}

const Images = styled.div`
  .images {
    display: none;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    margin-top: 30px;
    gap: 12px 24px;

    img {
      margin-bottom: 20px;
    }
  }
  @media (max-width: 1024px) {
    .slickImages {
      display: none;
    }
    .images {
      display: flex;
      margin-top: 15px;
    }
  }
`;
