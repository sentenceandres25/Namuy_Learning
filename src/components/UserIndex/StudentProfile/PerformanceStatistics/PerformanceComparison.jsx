// components/PerformanceStatistics/PerformanceComparison.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './PerformanceComparison.module.css';
import { useTranslation } from 'react-i18next';

const PerformanceComparison = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.performanceComparison}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('performance_comparison')}</h3>
      <div className={styles.dataSection}>
        <p>{t('compared_with_other_classes')}:</p>
        <p className={styles.dataValue}>{t('better')}</p>
      </div>
    </motion.div>
  );
};

export default PerformanceComparison;
