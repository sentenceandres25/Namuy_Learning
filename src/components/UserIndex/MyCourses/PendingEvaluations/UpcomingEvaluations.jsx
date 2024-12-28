// Components/PendingEvaluations/UpcomingEvaluations.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UpcomingEvaluations.module.css';
import { motion } from 'framer-motion';

const UpcomingEvaluations = ({ evaluations, onSelectEvaluation }) => {
  const { t } = useTranslation('UserIndex/MyCourses/PendingEvaluations');

  // Filtrar evaluaciones con fecha límite próxima (por ejemplo, próximas 7 días)
  const upcomingEvaluations = evaluations.filter((evaluation) => {
    const dueDate = new Date(evaluation.dueDate);
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  return (
    <motion.div
      className={styles.upcomingEvaluations}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('upcomingEvaluations')}</h3>
      {upcomingEvaluations.length > 0 ? (
        <ul>
          {upcomingEvaluations.map((evaluation) => (
            <li key={evaluation.id} onClick={() => onSelectEvaluation(evaluation)}>
              <h4>{evaluation.title}</h4>
              <p>
                {t('dueDate')}: {evaluation.dueDate}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('noUpcomingEvaluations')}</p>
      )}
    </motion.div>
  );
};

export default UpcomingEvaluations;
