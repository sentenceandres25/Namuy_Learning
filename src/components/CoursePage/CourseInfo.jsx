import React from 'react';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion'; // Importamos motion para animaciones
import { useTranslation } from 'react-i18next'; // Importamos para la traducción
import styles from './CourseInfo.module.css';

const CourseInfo = () => {
  const { t } = useTranslation('CoursePage'); // Usamos el namespace de traducción

  return (
    <motion.div
      className={styles.courseInfoContainer}  // Añadimos el nuevo estilo del contenedor
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }} // Animación suave de entrada
    >
      <h2>{t('course_title')}</h2>
      <p>{t('course_description')}</p>

      {/* Calificación con estrellas */}
      <div className={styles.courseRating}>
        ★★★★☆ (4.5/5)
      </div>

      <p><strong>{t('duration')}:</strong> 46 min</p>
      <p><strong>{t('students_enrolled')}:</strong> 765,294</p>
      <p><strong>{t('price')}:</strong> {t('free')}</p>

      {/* Nombre del creador */}
      <p><strong>{t('instructor')}:</strong> Jonas Schmedtmann</p>

      {/* Idiomas disponibles */}
      <p><strong>{t('languages')}:</strong> English, Spanish</p>

      {/* Botón de inscripción */}
      <Button variant="primary" className={styles.enrollButton}>{t('enroll_now')}</Button>
    </motion.div>
  );
};

export default CourseInfo;