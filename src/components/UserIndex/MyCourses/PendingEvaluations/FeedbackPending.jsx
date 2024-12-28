// Components/PendingEvaluations/FeedbackPending.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FeedbackPending.module.css';
import { motion } from 'framer-motion';

const FeedbackPending = ({ evaluations }) => {
  const { t } = useTranslation('UserIndex/MyCourses/PendingEvaluations');

  if (!evaluations || evaluations.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={styles.feedbackPending}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('feedbackPending')}</h3>
      <ul>
        {evaluations.map((evaluation) => (
          <li key={evaluation.id}>
            <h4>{evaluation.title}</h4>
            <p>
              {t('submissionDate')}: {evaluation.submissionDate}
            </p>
            <p>
              {t('status')}: {t(evaluation.status)}
            </p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FeedbackPending;
