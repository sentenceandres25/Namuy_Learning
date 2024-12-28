// Components/RequestExtraTutoring/DurationSelection.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DurationSelection.module.css';
import { Form, Button } from 'react-bootstrap';

const DurationSelection = ({ duration, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');

  const durationsAvailable = [
    { time: '30 minutes', cost: '$20' },
    { time: '1 hour', cost: '$35' },
    { time: '2 hours', cost: '$60' },
  ];

  return (
    <div className={styles.durationSelection}>
      <h3>{t('durationSelection')}</h3>
      <Form.Group controlId="formDuration">
        <Form.Label>{t('selectDuration')}</Form.Label>
        <Form.Control
          as="select"
          value={duration}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{t('selectDurationPlaceholder')}</option>
          {durationsAvailable.map((d) => (
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

export default DurationSelection;
