// Components/StudyPolicies/EvaluationFeedback.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EvaluationFeedback.module.css';

const EvaluationFeedback = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.evaluationFeedback}>
      <h3>{t('evaluationFeedback')}</h3>
      <p>{t('evaluationText')}</p>
    </div>
  );
};

export default EvaluationFeedback;
