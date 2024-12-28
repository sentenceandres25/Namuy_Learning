// Components/RequestExtraTutoring/TutoringMode.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutoringMode.module.css';
import { Form, Button } from 'react-bootstrap';

const TutoringMode = ({ mode, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');

  const modesAvailable = ['Virtual', 'In-person'];

  return (
    <div className={styles.tutoringMode}>
      <h3>{t('tutoringMode')}</h3>
      <Form.Group controlId="formMode">
        <Form.Label>{t('selectMode')}</Form.Label>
        <Form.Control
          as="select"
          value={mode}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{t('selectModePlaceholder')}</option>
          {modesAvailable.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!mode}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default TutoringMode;
