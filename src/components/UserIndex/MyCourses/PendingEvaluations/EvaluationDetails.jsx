// Components/PendingEvaluations/EvaluationDetails.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EvaluationDetails.module.css';
import { motion } from 'framer-motion';
import EvaluationStatus from './EvaluationStatus';
import StudyResources from './StudyResources';
import StartEvaluationButton from './StartEvaluationButton';

const EvaluationDetails = ({ evaluation }) => {
  const { t } = useTranslation('UserIndex/MyCourses/PendingEvaluations');

  return (
    <motion.div
      className={styles.evaluationDetails}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{evaluation.title}</h3>
      <p><strong>{t('course')}:</strong> {evaluation.course}</p>
      <p><strong>{t('dueDate')}:</strong> {evaluation.dueDate}</p>
      <p><strong>{t('difficulty')}:</strong> {evaluation.difficulty}</p>
      <p><strong>{t('weight')}:</strong> {evaluation.weight}</p>
      <p><strong>{t('format')}:</strong> {evaluation.format}</p>
      <p><strong>{t('estimatedTime')}:</strong> {evaluation.estimatedTime}</p>
      <p><strong>{t('topics')}:</strong> {evaluation.topics.join(', ')}</p>
      <EvaluationStatus status={evaluation.status} />
      <StudyResources resources={evaluation.resources} />
      <StartEvaluationButton evaluation={evaluation} />
    </motion.div>
  );
};

export default EvaluationDetails;
