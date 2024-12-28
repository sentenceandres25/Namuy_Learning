// components/PerformanceStatistics/AverageTime.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './AverageTime.module.css';
import { useTranslation } from 'react-i18next';

const AverageTime = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.averageTime}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('average_time')}</h3>
      <div className={styles.dataSection}>
        <p>{t('average_time_per_course')}:</p>
        <p className={styles.dataValue}>30 hours</p>
      </div>
    </motion.div>
  );
};

export default AverageTime;
