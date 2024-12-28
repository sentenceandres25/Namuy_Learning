// components/PerformanceStatistics/SpecialAchievements.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './SpecialAchievements.module.css';
import { useTranslation } from 'react-i18next';

const SpecialAchievements = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.specialAchievements}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('special_achievements')}</h3>
      <div className={styles.dataSection}>
        <p>{t('unique_achievements')}:</p>
        <p className={styles.dataValue}>5</p>
      </div>
    </motion.div>
  );
};

export default SpecialAchievements;
