import { useState, useEffect, useRef } from 'react';
import styles from '../styles/StatCard.module.css';
import { motion, useInView } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';

const StatCard = ({ percentage, description, details }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const isNumeric = !isNaN(parseInt(percentage));
  const numericValue = isNumeric ? parseInt(percentage) : 0;
  const suffix = isNumeric ? '%' : '';

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    
    if (isInView && isNumeric) {
      // Set duration based on the size of the number
      const duration = 2000;
      const step = Math.max(1, Math.floor(end / (duration / 16)));
      
      const timer = setInterval(() => {
        start += step;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue, isNumeric]);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const { t } = useLocalization();

  return (
    <motion.div 
      className={styles.card}
      variants={cardVariants}
      whileHover="hover"
      ref={ref}
    >
      <h3 className={styles.percentage}>
        {isNumeric ? count + suffix : percentage}
      </h3>
      <p className={styles.description}>{description}</p>
      <p className={styles.details}>{details}</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.learnMoreBtn} onClick={ _=> window.open('/resources/blog', '_blank') } type="button">{t('statistics.learnMore')}</button>
      </div>
    </motion.div>
  );
};

export default StatCard;
