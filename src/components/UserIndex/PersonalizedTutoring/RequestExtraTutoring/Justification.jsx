// Components/RequestExtraTutoring/Justification.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Justification.module.css';
import { Form, Button } from 'react-bootstrap';

const Justification = ({ justification, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');

  return (
    <div className={styles.justification}>
      <h3>{t('justification')}</h3>
      <Form.Group controlId="formJustification">
        <Form.Label>{t('explainJustification')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={justification}
          onChange={(e) => onChange(e.target.value)}
        />
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!justification}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default Justification;
