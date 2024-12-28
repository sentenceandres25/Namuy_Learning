// Components/EvaluateTutoringSessions/TutorResponseTime.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutorResponseTime.module.css';
import { Form } from 'react-bootstrap';

const TutorResponseTime = ({ responseTime, onChange }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  const options = [
    t('veryQuick'),
    t('quick'),
    t('average'),
    t('slow'),
    t('verySlow'),
  ];

  return (
    <div className={styles.tutorResponseTime}>
      <h4>{t('tutorResponseTime')}</h4>
      <Form.Group controlId="formTutorResponseTime">
        {options.map((option) => (
          <Form.Check
            key={option}
            type="radio"
            label={option}
            name="responseTimeOptions"
            value={option}
            checked={responseTime === option}
            onChange={(e) => onChange(e.target.value)}
          />
        ))}
      </Form.Group>
    </div>
  );
};

export default TutorResponseTime;
