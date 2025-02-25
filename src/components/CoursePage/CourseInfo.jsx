// CourseInfo.jsx
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './CourseInfo.module.css';

const CourseInfo = ({ course }) => {
  const { t } = useTranslation('CoursePage');

  // Imprime en consola el objeto recibido para verificar su estructura
  useEffect(() => {
    console.log('Course object:', course);
  }, [course]);

  // Extrae la traducción (si existe)
  const translation = course?.translation || {};

  // Se utiliza translation.name si course.name no está presente.
  const displayName = course?.name || translation.name;
  const displayDescription = course?.description || translation.description || t('course_description');
  const displayRating = course?.rating || 4.5;
  const displayDuration = course?.duration;
  const displayLevel = course?.level || t('beginner');
  const displayPrice =
    course?.price !== undefined
      ? course.price === 0
        ? t('free')
        : `$ ${course.price}`
      : t('free');
  const displayInstructor = course?.instructor || translation.instructor || 'Jonas Schmedtmann';
  const displayLanguages = course?.languages || translation.languages || 'English, Spanish';

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = '★'.repeat(fullStars) + (halfStar ? '☆' : '');
    return `${stars} (${rating}/5)`;
  };

  return (
    <motion.div
      className={styles.courseInfoContainer}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h2>{displayName}</h2>
      <p>{displayDescription}</p>

      <div className={styles.courseRating}>{renderStars(displayRating)}</div>

      <p>
        <strong>{t('duration')}:</strong> {displayDuration}
      </p>
      <p>
        <strong>{t('level')}:</strong> {displayLevel}
      </p>
      <p>
        <strong>{t('price')}:</strong> {displayPrice}
      </p>
      <p>
        <strong>{t('instructor')}:</strong> {displayInstructor}
      </p>
      <p>
        <strong>{t('languages')}:</strong> {displayLanguages}
      </p>

      <Button variant="primary" className={styles.enrollButton}>
        {t('enroll_now')}
      </Button>
    </motion.div>
  );
};

export default CourseInfo;
