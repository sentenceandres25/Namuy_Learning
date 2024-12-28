// GeneralProgress.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './GeneralProgressStyles.module.css'; // Importa el CSS Module con nombres únicos

const GeneralProgress = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/AcademicHistory');

  const progress = {
    resumenAvance: 75, // Porcentaje
    cursosTomados: 8,
    cursosPendientes: 2,
  };

  const circleDashOffset = 472 - (472 * progress.resumenAvance) / 100;

  return (
    <div className={styles.generalProgressContainer}>
      <h2 className={styles.generalProgressTitle}>{t('generalProgress')}</h2>
      <div className={styles.generalProgressCircle}>
        <svg>
          <circle
            className={styles.generalCircleBackground}
            cx="75"
            cy="75"
            r="75"
          ></circle>
          <motion.circle
            className={styles.generalCircleProgress}
            cx="75"
            cy="75"
            r="75"
            strokeDashoffset="472"
            animate={{ strokeDashoffset: circleDashOffset }}
            transition={{ duration: 1 }}
          ></motion.circle>
        </svg>
        <div className={styles.generalProgressValue}>
          <h2>{progress.resumenAvance}%</h2>
        </div>
      </div>
      <p className={styles.generalProgressDetails}>
        {t('coursesTaken')}: {progress.cursosTomados}
      </p>
      <p className={styles.generalProgressDetails}>
        {t('pendingCourses')}: {progress.cursosPendientes}
      </p>
    </div>
  );
};

export default GeneralProgress;
