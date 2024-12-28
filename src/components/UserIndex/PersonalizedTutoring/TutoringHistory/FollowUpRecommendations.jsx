// Components/TutoringHistory/FollowUpRecommendations.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FollowUpRecommendations.module.css';
import { FaLightbulb } from 'react-icons/fa';

const FollowUpRecommendations = ({ recommendations }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className={styles.followUpRecommendations}>
      <h4><FaLightbulb /> {t('followUpRecommendations')}</h4>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default FollowUpRecommendations;
