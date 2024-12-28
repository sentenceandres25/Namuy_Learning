// Components/PendingEvaluations/StartEvaluationButton.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StartEvaluationButton.module.css';

const StartEvaluationButton = ({ evaluation }) => {
  const { t } = useTranslation('UserIndex/MyCourses/PendingEvaluations');

  const handleClick = () => {
    // Lógica para iniciar la evaluación
    alert(`${t('startingEvaluation')}: ${evaluation.title}`);
  };

  return (
    <button className={styles.startButton} onClick={handleClick}>
      {t('startEvaluation')}
    </button>
  );
};

export default StartEvaluationButton;
