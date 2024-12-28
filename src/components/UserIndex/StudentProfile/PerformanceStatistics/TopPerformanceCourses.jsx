// components/PerformanceStatistics/TopPerformanceCourses.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './TopPerformanceCourses.module.css';
import { useTranslation } from 'react-i18next';

const TopPerformanceCourses = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.topPerformanceCourses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('top_performance_courses')}</h3>
      <div className={styles.dataSection}>
        <p>{t('highlighted_course')}:</p>
        <p className={styles.dataValue}>{t('cyber_security')}</p>
      </div>
    </motion.div>
  );
};

export default TopPerformanceCourses;
