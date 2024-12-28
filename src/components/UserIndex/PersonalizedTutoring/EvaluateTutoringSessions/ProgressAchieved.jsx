// Components/EvaluateTutoringSessions/ProgressAchieved.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProgressAchieved.module.css';
import { Form } from 'react-bootstrap';

const ProgressAchieved = ({ progress, onChange }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  const options = [
    t('significantProgress'),
    t('someProgress'),
    t('noProgress'),
  ];

  return (
    <div className={styles.progressAchieved}>
      <h4>{t('progressAchieved')}</h4>
      <Form.Group controlId="formProgressAchieved">
        {options.map((option) => (
          <Form.Check
            key={option}
            type="radio"
            label={option}
            name="progressOptions"
            value={option}
            checked={progress === option}
            onChange={(e) => onChange(e.target.value)}
          />
        ))}
      </Form.Group>
    </div>
  );
};

export default ProgressAchieved;
