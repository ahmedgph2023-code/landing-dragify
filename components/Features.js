import React from 'react';
import styles from '../styles/Features.module.css';
import FeatureCard from './FeatureCard';
import { motion } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';

const Features = () => {
  const { t } = useLocalization();
  
  const features = [
    {
      id: 1,
      title: t('features.items.0.title'),
      description: t('features.items.0.description'),
      icon: 'agent',
      link: '/services/custom-ai-agents'
    },
    {
      id: 2,
      title: t('features.items.1.title'),
      description: t('features.items.1.description'),
      icon: 'orchestration',
      link: '/services/deploy-fast'
    },
    {
      id: 3,
      title: t('features.items.2.title'),
      description: t('features.items.2.description'),
      icon: 'deploy',
      link: '/services/multi-agent-orchestration'
    },
    {
      id: 4,
      title: t('features.items.3.title'),
      description: t('features.items.3.description'),
      icon: 'api',
      link: '/services/scalable-api-connections'
    }
  ];

  // ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className={styles.title} dangerouslySetInnerHTML={{
            __html: t('features.title')
              .replace(/<highlight>/g, '<span class="gradient-text">')
              .replace(/<\/highlight>/g, '</span>')
          }} />
          <p className={styles.description}>
            {t('features.description')}
          </p>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature) => (
            <FeatureCard 
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              link={ feature.link }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;