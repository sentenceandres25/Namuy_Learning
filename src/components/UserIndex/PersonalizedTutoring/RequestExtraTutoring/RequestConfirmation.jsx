// Components/RequestExtraTutoring/RequestConfirmation.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RequestConfirmation.module.css';
import { Button } from 'react-bootstrap';

const RequestConfirmation = ({ requestData, onConfirm, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');

  return (
    <div className={styles.requestConfirmation}>
      <h3>{t('requestConfirmation')}</h3>
      <p>
        <strong>{t('course')}:</strong> {requestData.course}
      </p>
      <p>
        <strong>{t('justification')}:</strong> {requestData.justification}
      </p>
      <p>
        <strong>{t('tutor')}:</strong> {requestData.tutor || t('noTutorSelected')}
      </p>
      <p>
        <strong>{t('date')}:</strong> {requestData.date.toLocaleDateString()}
      </p>
      <p>
        <strong>{t('time')}:</strong> {requestData.time}
      </p>
      <p>
        <strong>{t('duration')}:</strong> {requestData.duration}
      </p>
      <p>
        <strong>{t('mode')}:</strong> {requestData.mode}
      </p>
      <p>
        <strong>{t('notifications')}:</strong> {requestData.notifications.join(', ')}
      </p>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="success" onClick={onConfirm}>
          {t('confirm')}
        </Button>
      </div>
    </div>
  );
};

export default RequestConfirmation;
