// Components/TutoringHistory/TutorRating.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutorRating.module.css';
import { FaStar } from 'react-icons/fa';

const TutorRating = ({ rating, comments }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');

  return (
    <div className={styles.tutorRating}>
      <h4><FaStar /> {t('tutorRating')}</h4>
      <p><strong>{t('rating')}:</strong> {rating}/5</p>
      <p><strong>{t('comments')}:</strong> {comments}</p>
    </div>
  );
};

export default TutorRating;
