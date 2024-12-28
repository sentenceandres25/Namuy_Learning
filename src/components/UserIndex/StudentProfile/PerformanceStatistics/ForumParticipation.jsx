// components/PerformanceStatistics/ForumParticipation.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './ForumParticipation.module.css';
import { useTranslation } from 'react-i18next';

const ForumParticipation = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.forumParticipation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('forum_participation')}</h3>
      <div className={styles.dataSection}>
        <p>{t('number_of_posts')}:</p>
        <p className={styles.dataValue}>12</p>
      </div>
    </motion.div>
  );
};

export default ForumParticipation;
