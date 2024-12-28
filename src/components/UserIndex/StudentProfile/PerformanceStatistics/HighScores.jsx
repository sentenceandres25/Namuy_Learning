// components/PerformanceStatistics/HighScores.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './HighScores.module.css';
import { useTranslation } from 'react-i18next';

const HighScores = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.highScores}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('high_scores')}</h3>
      <div className={styles.dataSection}>
        <p>{t('highest_score')}:</p>
        <p className={styles.dataValue}>98%</p>
      </div>
    </motion.div>
  );
};

export default HighScores;
