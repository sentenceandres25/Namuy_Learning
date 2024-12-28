// components/PerformanceStatistics/CompletionRate.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './CompletionRate.module.css';
import { useTranslation } from 'react-i18next';

const CompletionRate = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.completionRate}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('completion_rate')}</h3>
      <div className={styles.dataSection}>
        <p>{t('completed')}:</p>
        <p className={styles.dataValue}>85%</p>
      </div>
    </motion.div>
  );
};

export default CompletionRate;
