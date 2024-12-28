// Components/PendingEvaluations/StudyResources.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StudyResources.module.css';

const StudyResources = ({ resources }) => {
  const { t } = useTranslation('UserIndex/MyCourses/PendingEvaluations');

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className={styles.resources}>
      <h4>{t('studyResources')}</h4>
      <ul>
        {resources.map((resource) => (
          <li key={resource.id}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              {resource.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudyResources;
