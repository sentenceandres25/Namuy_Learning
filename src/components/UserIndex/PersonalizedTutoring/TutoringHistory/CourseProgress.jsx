// Components/TutoringHistory/CourseProgress.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CourseProgress.module.css';
import { FaChartLine } from 'react-icons/fa';

const CourseProgress = ({ progress }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');

  return (
    <div className={styles.courseProgress}>
      <h4><FaChartLine /> {t('courseProgress')}</h4>
      <p>{progress}</p>
    </div>
  );
};

export default CourseProgress;
