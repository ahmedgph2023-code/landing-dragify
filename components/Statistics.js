import styles from '../styles/Statistics.module.css';
import StatCard from './StatCard';
import { motion } from 'framer-motion';
import { useLocalization } from '../context/LocalizationContext';

const Statistics = () => {
  const { t } = useLocalization();
  const stats = t('statistics.items');

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

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

  return (
    <section className={styles.statistics}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: t('statistics.title') }} />
          <p className={styles.subtitle}>
            {t('statistics.subtitle')}
          </p>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {stats.map((stat) => (
            <StatCard 
              key={stat.id} 
              percentage={stat.percentage} 
              description={stat.description} 
              details={stat.details} 
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;