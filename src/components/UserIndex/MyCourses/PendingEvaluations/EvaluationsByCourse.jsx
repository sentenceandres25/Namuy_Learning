// Components/PendingEvaluations/EvaluationsByCourse.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EvaluationsByCourse.module.css';
import { motion } from 'framer-motion';

const EvaluationsByCourse = ({ evaluations, selectedEvaluation, onSelectEvaluation }) => {
  const { t } = useTranslation('UserIndex/MyCourses/PendingEvaluations');

  // Agrupar evaluaciones por curso
  const evaluationsByCourse = evaluations.reduce((acc, evaluation) => {
    if (!acc[evaluation.course]) {
      acc[evaluation.course] = [];
    }
    acc[evaluation.course].push(evaluation);
    return acc;
  }, {});

  return (
    <motion.div
      className={styles.evaluationsByCourse}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('evaluationsByCourse')}</h3>
      {Object.keys(evaluationsByCourse).map((course) => (
        <div key={course} className={styles.courseSection}>
          <h4>{course}</h4>
          <ul>
            {evaluationsByCourse[course].map((evaluation) => (
              <li
                key={evaluation.id}
                onClick={() => onSelectEvaluation(evaluation)}
                className={
                  selectedEvaluation && selectedEvaluation.id === evaluation.id
                    ? styles.selectedEvaluation
                    : ''
                }
              >
                <p>{evaluation.title}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </motion.div>
  );
};

export default EvaluationsByCourse;
