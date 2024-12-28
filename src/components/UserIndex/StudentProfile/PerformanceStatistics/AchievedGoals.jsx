// components/PerformanceStatistics/AchievedGoals.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './AchievedGoals.module.css';
import { useTranslation } from 'react-i18next';

const AchievedGoals = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.achievedGoals}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('achieved_goals')}</h3>
      <div className={styles.dataSection}>
        <p>{t('number_of_goals')}:</p>
        <p className={styles.dataValue}>8</p>
      </div>
    </motion.div>
  );
};

export default AchievedGoals;
