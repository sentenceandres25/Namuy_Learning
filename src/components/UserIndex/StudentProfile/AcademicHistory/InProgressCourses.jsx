// InProgressCourses.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './InProgressCoursesStyles.module.css'; // Importa el CSS Module con nombres únicos

const InProgressCourses = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/AcademicHistory');

  const courses = [
    {
      nombre: 'Inteligencia Artificial',
      estado: 'En progreso',
      porcentajeAvance: 60,
      fechaEstimada: '30/11/2021',
    },
    {
      nombre: 'Diseño de Interfaces',
      estado: 'Pausado',
      porcentajeAvance: 30,
      fechaEstimada: '15/12/2021',
    },
  ];

  return (
    <div className={styles.inProgressCoursesContainer}>
      <h2 className={styles.inProgressCoursesTitle}>{t('inProgressCourses')}</h2>
      {courses.map((course, index) => {
        const progressWidth = `${course.porcentajeAvance}%`;

        return (
          <motion.div
            key={index}
            className={styles.inProgressCourseCard}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <h3 className={styles.inProgressCourseTitle}>{course.nombre}</h3>
            <p className={styles.inProgressCourseContent}>
              {t('status')}: {course.estado}
            </p>
            <p className={styles.inProgressCourseContent}>
              {t('progressPercentage')}: {course.porcentajeAvance}%
            </p>
            <p className={styles.inProgressCourseContent}>
              {t('estimatedCompletion')}: {course.fechaEstimada}
            </p>
            <div className={styles.inProgressBarContainer}>
              <div
                className={styles.inProgressBar}
                style={{ width: progressWidth }}
              ></div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InProgressCourses;
