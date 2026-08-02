import Link from 'next/link';
import styles from '../styles/FeatureCard.module.css';
import { motion } from 'framer-motion';
import { useLocalization } from '@/context/LocalizationContext';

const FeatureCard = ({ title, description, icon, link }) => {
  const { t, language } = useLocalization();
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
      boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  // SVG icons based on the icon prop
  const renderIcon = () => {
    switch (icon) {
      case 'agent':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="var(--accent-blue)"/>
          </svg>
        );
      case 'orchestration':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="var(--accent-purple)"/>
          </svg>
        );
      case 'deploy':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM10 14.17L7.83 12L6.41 13.41L10 17L18 9L16.59 7.58L10 14.17Z" fill="var(--accent-blue)"/>
          </svg>
        );
      case 'api':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18ZM6 12H10V14H6V12ZM6 8H14V10H6V8ZM16 16H6V15H16V16ZM18 9H16V8H18V9ZM18 11H16V10H18V11ZM18 13H16V12H18V13ZM18 15H16V14H18V15Z" fill="var(--accent-purple)"/>
          </svg>
        );
      case 'interface':
      default:
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="var(--accent-blue)"/>
          </svg>
        );
    }
  };

  return (
    <motion.div 
      className={styles.card}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={styles.iconWrapper}>
        {renderIcon()}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <Link href={ link } style={{ marginTop: '15px', textAlign: language === 'ar' ? 'left' : 'right' }}>{t('blog.readMore')}</Link>
    </motion.div>
  );
};

export default FeatureCard;
