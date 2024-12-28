// Components/CompletedCourses/CourseDetails.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CourseDetails.module.css';
import { motion } from 'framer-motion';

const CourseDetails = ({ course }) => {
  const { t } = useTranslation('UserIndex/MyCourses/CompletedCourses');

  return (
    <motion.div
      className={styles.courseDetails}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{course.title}</h3>
      <p><strong>{t('instructor')}:</strong> {course.instructor}</p>
      <p><strong>{t('duration')}:</strong> {course.duration}</p>
      <p><strong>{t('startDate')}:</strong> {course.startDate}</p>
      <p><strong>{t('endDate')}:</strong> {course.endDate}</p>
      <p><strong>{t('progress')}:</strong> {course.progress}%</p>
    </motion.div>
  );
};

export default CourseDetails;
