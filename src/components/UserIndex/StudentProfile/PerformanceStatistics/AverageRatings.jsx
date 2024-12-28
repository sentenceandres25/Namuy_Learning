// components/PerformanceStatistics/AverageRatings.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './AverageRatings.module.css';
import { useTranslation } from 'react-i18next';

const AverageRatings = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.averageRatings}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('average_ratings')}</h3>
      <div className={styles.dataSection}>
        <p>{t('average')}:</p>
        <p className={styles.dataValue}>4.7/5</p>
      </div>
    </motion.div>
  );
};

export default AverageRatings;
