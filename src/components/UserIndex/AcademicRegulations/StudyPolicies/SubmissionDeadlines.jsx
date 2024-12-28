// Components/StudyPolicies/SubmissionDeadlines.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SubmissionDeadlines.module.css';

const SubmissionDeadlines = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.submissionDeadlines}>
      <h3>{t('submissionDeadlines')}</h3>
      <p>{t('deadlinesText')}</p>
    </div>
  );
};

export default SubmissionDeadlines;
