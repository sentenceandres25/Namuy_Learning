// Components/TutoringHistory/TopicsCoveredSummary.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TopicsCoveredSummary.module.css';
import { FaListAlt } from 'react-icons/fa';

const TopicsCoveredSummary = ({ topics }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <div className={styles.topicsCoveredSummary}>
      <h4><FaListAlt /> {t('topicsCovered')}</h4>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopicsCoveredSummary;
