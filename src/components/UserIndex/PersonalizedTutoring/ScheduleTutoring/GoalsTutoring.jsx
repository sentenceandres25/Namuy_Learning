// Components/ScheduleTutoring/GoalsTutoring.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './GoalsTutoring.module.css';
import { Form, Button } from 'react-bootstrap';

const GoalsTutoring = ({ goals, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/ScheduleTutoring');

  return (
    <div className={styles.goalsTutoring}>
      <h3>{t('goalsTutoring')}</h3>
      <Form.Group controlId="formGoals">
        <Form.Label>{t('addGoals')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={goals}
          onChange={(e) => onChange(e.target.value)}
        />
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!goals}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default GoalsTutoring;
