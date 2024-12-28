// Components/ExpiredCertificates/SuggestedCourses.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SuggestedCourses.module.css';
import { FaLightbulb } from 'react-icons/fa';

const SuggestedCourses = ({ courses }) => {
  const { t } = useTranslation('UserIndex/Certifications/ExpiredCertificates');

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div className={styles.suggestedCourses}>
      <h4>
        <FaLightbulb /> {t('suggestedUpdatedCourses')}
      </h4>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <a href={course.url}>{course.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedCourses;
