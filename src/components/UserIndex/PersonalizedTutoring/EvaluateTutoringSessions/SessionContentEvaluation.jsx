// Components/EvaluateTutoringSessions/SessionContentEvaluation.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SessionContentEvaluation.module.css';
import { Form } from 'react-bootstrap';

const SessionContentEvaluation = ({ evaluation, onChange }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  const aspects = [
    { id: 'clarity', label: t('clarityOfTutor') },
    { id: 'materials', label: t('qualityOfMaterials') },
    { id: 'objectivesMet', label: t('objectivesMet') },
  ];

  const options = [1, 2, 3, 4, 5];

  const handleAspectChange = (aspectId, value) => {
    onChange({ ...evaluation, [aspectId]: value });
  };

  return (
    <div className={styles.sessionContentEvaluation}>
      <h4>{t('sessionContentEvaluation')}</h4>
      {aspects.map((aspect) => (
        <Form.Group key={aspect.id} controlId={`form${aspect.id}`}>
          <Form.Label>{aspect.label}</Form.Label>
          <div className={styles.ratingOptions}>
            {options.map((option) => (
              <Form.Check
                key={option}
                type="radio"
                label={option}
                name={`aspect-${aspect.id}`}
                value={option}
                checked={evaluation[aspect.id] === option}
                onChange={(e) => handleAspectChange(aspect.id, parseInt(e.target.value))}
              />
            ))}
          </div>
        </Form.Group>
      ))}
    </div>
  );
};

export default SessionContentEvaluation;
