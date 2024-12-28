// components/PerformanceStatistics/CommitmentLevel.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './CommitmentLevel.module.css';
import { useTranslation } from 'react-i18next';

const CommitmentLevel = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.commitmentLevel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('commitment_level')}</h3>
      <div className={styles.dataSection}>
        <p>{t('commitment')}:</p>
        <p className={styles.dataValue}>90%</p>
      </div>
    </motion.div>
  );
};

export default CommitmentLevel;
