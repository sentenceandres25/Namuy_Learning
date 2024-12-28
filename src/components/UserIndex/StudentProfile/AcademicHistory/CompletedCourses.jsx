// CompletedCourses.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './CompletedCoursesStyles.module.css'; // Importa el CSS Module con nombres relacionados al tema

const CompletedCourses = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/AcademicHistory');

  const courses = [
    {
      nombre: 'Matemáticas Avanzadas',
      fechaFinalizacion: '20/05/2021',
      calificacion: '95',
      comentarios: 'Excelente desempeño.',
    },
    {
      nombre: 'Programación en React',
      fechaFinalizacion: '15/08/2021',
      calificacion: '98',
      comentarios: 'Proyecto destacado.',
    },
  ];

  return (
    <div className={styles.completedCoursesContainer}>
      <h2 className={styles.completedCoursesTitle}>{t('completedCourses')}</h2>
      {courses.map((course, index) => (
        <motion.div
          key={index}
          className={styles.completedCourseCard} // Usamos la clase del CSS Module
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <h3 className={styles.completedCourseTitle}>{course.nombre}</h3>
          <p className={styles.completedCourseContent}>
            {t('completionDate')}: {course.fechaFinalizacion}
          </p>
          <p className={styles.completedCourseContent}>
            {t('grade')}: {course.calificacion}
          </p>
          <p className={`${styles.completedCourseContent} ${styles.completedCourseComments}`}>
            {t('comments')}: {course.comentarios}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default CompletedCourses;
