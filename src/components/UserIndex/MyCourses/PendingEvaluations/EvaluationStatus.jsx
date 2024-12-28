// Components/PendingEvaluations/EvaluationStatus.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EvaluationStatus.module.css';

const EvaluationStatus = ({ status }) => {
  const { t } = useTranslation('UserIndex/MyCourses/PendingEvaluations');

  let statusClass = '';
  switch (status) {
    case 'No Iniciada':
      statusClass = styles.notStarted;
      break;
    case 'En Progreso':
      statusClass = styles.inProgress;
      break;
    case 'Requiere Revisión':
      statusClass = styles.needsReview;
      break;
    default:
      statusClass = styles.defaultStatus;
      break;
  }

  return (
    <div className={`${styles.status} ${statusClass}`}>
      <p><strong>{t('status')}:</strong> {t(status)}</p>
    </div>
  );
};

export default EvaluationStatus;
