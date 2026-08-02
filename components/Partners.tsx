import styles from '../styles/Partners.module.css';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';
import styled from 'styled-components';
import { useLocalization } from '../context/LocalizationContext';

const slickSettings = { 
  arrows: false, infinite: true, slidesToShow: 5, slidesToScroll: 1, autoplay: true, 
  speed: 5000, autoplaySpeed: 0, cssEase: 'linear', touchMove: false, variableWidth: true
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
          <Slider { ...slickSettings } pauseOnFocus={ false } pauseOnHover={ false }>
              <div><Image src="/f6.png" alt="logo" width={ 180 } height={ 50 } style={{ top: '28px', margin: '0 20px' }} /></div>
              <div><Image src="/itida1.png" alt="logo" width={ 180 } height={ 75 } style={{ top: '16px', margin: '0 15px' }} /></div>
              <div><Image src="/amazon.png" alt="logo" width={ 180 } height={ 50 } style={{ top: '28px' }} /></div> 
              <div><Image src="/qatarr.svg" alt="logo" width={ 400 } height={ 75 } style={{ top: '12px', margin: '0 15px 0 15px' }} /></div>
              <div><Image src="/google.png" alt="logo" width={ 180 } height={ 100 } style={{ top: '5px', margin: '0 10px 0 30px' }}  /></div>
              <div><Image src="/TIEC1.png" alt="logo" width={ 180 } height={ 50 } style={{ top: '25px', margin: '0 15px' }} /></div>
              <div><Image src="/nvidia.png" alt="logo" width={ 180 } height={ 50 } style={{ top: '28px', margin: '0 40px 0 15px' }} /></div>
          </Slider>
        </div>
        <div className="images">
          <Image src="/qatarr.svg" alt="logo" width={ 400 } height={ 75 } style={{ marginRight: '40px' }} />
          <Image src="/f6.png" alt="logo" width={ 180 } height={ 50 } />
          <Image src="/itida1.png" alt="logo" width={ 180 } height={ 50 } />
          <Image src="/amazon.png" alt="logo" width={ 180 } height={ 50 } />
          <Image src="/google.png" alt="logo" width={ 180 } height={ 50 } />
          <Image src="/TIEC1.png" alt="logo" width={ 180 } height={ 50 } />
          <Image src="/nvidia.png" alt="logo" width={ 180 } height={ 50 } />
        </div>
      </div>
    </Images>
  );
};

const Images = styled.div`
  .images {
    display: none;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    margin-top: 30px;

    img {
      margin-bottom: 30px;
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