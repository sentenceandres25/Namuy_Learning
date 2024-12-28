// components/PerformanceStatistics/ActiveDays.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './ActiveDays.module.css';
import { useTranslation } from 'react-i18next';

const ActiveDays = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.activeDays}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('active_days')}</h3>
      <div className={styles.dataSection}>
        <p>{t('total_days')}:</p>
        <p className={styles.dataValue}>45</p>
      </div>
    </motion.div>
  );
};

export default ActiveDays;
