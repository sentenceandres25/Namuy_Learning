// Components/StudyPolicies/CourseRequirements.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CourseRequirements.module.css';

const CourseRequirements = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.courseRequirements}>
      <h3>{t('courseRequirements')}</h3>
      <p>{t('requirementsText')}</p>
    </div>
  );
};

export default CourseRequirements;
