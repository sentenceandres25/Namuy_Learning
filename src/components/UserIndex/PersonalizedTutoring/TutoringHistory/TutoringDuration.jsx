// Components/TutoringHistory/TutoringDuration.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutoringDuration.module.css';
import { FaClock } from 'react-icons/fa';

const TutoringDuration = ({ duration }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');

  return (
    <div className={styles.tutoringDuration}>
      <h4><FaClock /> {t('tutoringDuration')}</h4>
      <p>{duration}</p>
    </div>
  );
};

export default TutoringDuration;
