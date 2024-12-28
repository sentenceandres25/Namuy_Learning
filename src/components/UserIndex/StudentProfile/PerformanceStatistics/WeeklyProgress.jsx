// components/PerformanceStatistics/WeeklyProgress.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './WeeklyProgress.module.css';
import { useTranslation } from 'react-i18next';

const WeeklyProgress = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.weeklyProgress}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('weekly_progress')}</h3>
      <div className={styles.dataSection}>
        <p>{t('progress')}:</p>
        <p className={styles.dataValue}>75%</p>
      </div>
    </motion.div>
  );
};

export default WeeklyProgress;
