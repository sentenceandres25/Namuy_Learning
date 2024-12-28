// PerformanceStats.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PerformanceStatsStyles.module.css';

const PerformanceStats = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/AcademicHistory');

  const stats = {
    promedioCalificaciones: '96.5',
    tiempoPromedio: '40 horas',
    comparativaRendimiento: 'Alto rendimiento en Ciencias y Tecnología',
    cursosDestacados: ['Programación en React', 'Matemáticas Avanzadas'],
  };

  return (
    <div className={styles.performanceStatsContainer}>
      <h2 className={styles.performanceStatsTitle}>{t('performanceStats')}</h2>
      <div className={styles.statsContainer}>
        <div className={styles.performanceStatItem}>
          <span className={styles.performanceStatIcon}>📊</span>
          <span className={styles.performanceStatLabel}>{t('averageGrade')}:</span>
          <span className={styles.performanceStatValue}>{stats.promedioCalificaciones}</span>
        </div>
        <div className={styles.performanceStatItem}>
          <span className={styles.performanceStatIcon}>⏰</span>
          <span className={styles.performanceStatLabel}>{t('averageTimePerCourse')}:</span>
          <span className={styles.performanceStatValue}>{stats.tiempoPromedio}</span>
        </div>
        <div className={styles.performanceStatItem}>
          <span className={styles.performanceStatIcon}>💡</span>
          <span className={styles.performanceStatLabel}>{t('performanceComparison')}:</span>
          <span className={styles.performanceStatValue}>{stats.comparativaRendimiento}</span>
        </div>
        <div className={styles.performanceStatItem}>
          <span className={styles.performanceStatIcon}>🌟</span>
          <span className={styles.performanceStatLabel}>{t('highlightedCourses')}:</span>
          <span className={styles.performanceStatValue}>
            {stats.cursosDestacados.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;
