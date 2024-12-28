// Components/EvaluateTutoringSessions/OverallSatisfaction.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OverallSatisfaction.module.css';
import { Form } from 'react-bootstrap';

const OverallSatisfaction = ({ satisfaction, onChange }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  const options = [
    t('verySatisfied'),
    t('satisfied'),
    t('neutral'),
    t('dissatisfied'),
    t('veryDissatisfied'),
  ];

  return (
    <div className={styles.overallSatisfaction}>
      <h4>{t('overallSatisfaction')}</h4>
      <Form.Group controlId="formOverallSatisfaction">
        {options.map((option, index) => (
          <div key={index} className={styles['overall-satisfaction-check']}>
            <Form.Check
              type="radio"
              id={`satisfaction-${index}`}
              name="satisfactionOptions"
              className={styles['overall-satisfaction-input']}
              value={option}
              checked={satisfaction === option}
              onChange={(e) => onChange(e.target.value)}
            />
            <Form.Check.Label
              htmlFor={`satisfaction-${index}`}
              className={styles['overall-satisfaction-label']}
            >
              {option}
            </Form.Check.Label>
          </div>
        ))}
      </Form.Group>
    </div>
  );
};

export default OverallSatisfaction;
