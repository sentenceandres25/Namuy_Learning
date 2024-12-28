// Components/StudyPolicies/ForumParticipationRules.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ForumParticipationRules.module.css';

const ForumParticipationRules = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.forumParticipationRules}>
      <h3>{t('forumParticipationRules')}</h3>
      <p>{t('forumRulesText')}</p>
    </div>
  );
};

export default ForumParticipationRules;
