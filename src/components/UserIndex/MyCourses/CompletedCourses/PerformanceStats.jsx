// Components/CompletedCourses/PerformanceStats.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PerformanceStats.module.css';
import { motion } from 'framer-motion';

const PerformanceStats = ({ course }) => {
  const { t } = useTranslation('UserIndex/MyCourses/CompletedCourses');

  if (!course) {
    return null;
  }

  // Datos simulados de estadísticas
  const stats = {
    totalTime: '15 horas',
    averageRating: 4.5,
    achievements: ['Completado', 'Mejor estudiante'],
  };

  return (
    <motion.div
      className={styles.stats}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('performanceStats')}</h3>
      <p><strong>{t('totalTime')}:</strong> {stats.totalTime}</p>
      <p><strong>{t('averageRating')}:</strong> {stats.averageRating}/5</p>
      <p><strong>{t('achievements')}:</strong></p>
      <ul>
        {stats.achievements.map((achievement, index) => (
          <li key={index}>{achievement}</li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PerformanceStats;
