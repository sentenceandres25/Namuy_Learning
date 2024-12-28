// Components/EvaluateTutoringSessions/EvaluationHistory.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EvaluationHistory.module.css';
import { FaHistory } from 'react-icons/fa';

const EvaluationHistory = ({ evaluations }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  return (
    <div className={styles.evaluationHistory}>
      <h3>
        <FaHistory /> {t('evaluationHistory')}
      </h3>
      {evaluations.length > 0 ? (
        <div className={styles.historyList}>
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className={styles.historyItem}>
              <h4>{evaluation.course}</h4>
              <p>
                {t('topic')}: {evaluation.topic}
              </p>
              <p>
                {t('tutor')}: {evaluation.tutor}
              </p>
              <p>
                {t('date')}: {evaluation.date}
              </p>
              <p>
                {t('rating')}: {evaluation.rating}/5
              </p>
              <p>
                {t('comments')}: {evaluation.comments}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('noEvaluations')}</p>
      )}
    </div>
  );
};

export default EvaluationHistory;
