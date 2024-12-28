// Components/EvaluateTutoringSessions/TutorRating.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutorRating.module.css';
import { FaStar } from 'react-icons/fa';

const TutorRating = ({ rating, onChange }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (value) => {
    onChange(value);
  };

  return (
    <div className={styles.tutorRating}>
      <h4>{t('tutorRating')}</h4>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <FaStar
            key={value}
            className={styles.star}
            size={30}
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            color={value <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9'}
          />
        ))}
      </div>
    </div>
  );
};

export default TutorRating;
