// Components/CompletedCourses/CourseList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CourseList.module.css';
import { motion } from 'framer-motion';

const CourseList = ({ courses, selectedCourse, onSelectCourse }) => {
  const { t } = useTranslation('UserIndex/MyCourses/CompletedCourses');

  return (
    <motion.div
      className={styles.courseList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('completedCourses')}</h3>
      <ul>
        {courses.map((course) => (
          <li
            key={course.id}
            className={selectedCourse && selectedCourse.id === course.id ? styles.selected : ''}
            onClick={() => onSelectCourse(course)}
          >
            <h4>{course.title}</h4>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default CourseList;
