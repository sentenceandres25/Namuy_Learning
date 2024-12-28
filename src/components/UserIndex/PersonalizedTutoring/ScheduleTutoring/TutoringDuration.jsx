// Components/ScheduleTutoring/TutoringDuration.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutoringDuration.module.css';
import { Form, Button } from 'react-bootstrap';

const TutoringDuration = ({ duration, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/ScheduleTutoring');

  const availableDurations = [
    { time: '30 minutes', cost: '$20' },
    { time: '1 hour', cost: '$35' },
    { time: '2 hours', cost: '$60' },
  ];

  return (
    <div className={styles.tutoringDuration}>
      <h3>{t('tutoringDuration')}</h3>
      <Form.Group controlId="formDuration">
        <Form.Label>{t('selectDuration')}</Form.Label>
        <Form.Control
          as="select"
          value={duration}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{t('selectDuration')}</option>
          {availableDurations.map((d) => (
            <option key={d.time} value={d.time}>
              {d.time} - {d.cost}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!duration}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default TutoringDuration;
