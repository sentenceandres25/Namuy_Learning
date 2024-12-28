// components/PerformanceStatistics/StudyHours.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './StudyHours.module.css';
import { useTranslation } from 'react-i18next';

const StudyHours = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.studyHours}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('study_hours')}</h3>
      <div className={styles.dataSection}>
        <p>{t('total_hours')}:</p>
        <p className={styles.dataValue}>120</p>
      </div>
    </motion.div>
  );
};

export default StudyHours;
