// Components/ScheduleTutoring/ConfirmTutoring.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmTutoring.module.css';
import { Button } from 'react-bootstrap';

const ConfirmTutoring = ({ tutoringData, onConfirm, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/ScheduleTutoring');

  return (
    <div className={styles.confirmTutoring}>
      <h3>{t('confirmTutoring')}</h3>
      <p><strong>{t('course')}:</strong> {tutoringData.course}</p>
      <p><strong>{t('tutor')}:</strong> {tutoringData.tutor}</p>
      <p><strong>{t('date')}:</strong> {new Date(tutoringData.date).toLocaleDateString()}</p>
      <p><strong>{t('time')}:</strong> {tutoringData.time}</p>
      <p><strong>{t('tutoringMode')}:</strong> {tutoringData.mode}</p>
      <p><strong>{t('duration')}:</strong> {tutoringData.duration}</p>
      <p><strong>{t('goalsTutoring')}:</strong> {tutoringData.goals}</p>
      <p><strong>{t('notifications')}:</strong> {tutoringData.notifications.join(', ')}</p>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="success" onClick={onConfirm}>
          {t('confirmTutoring')}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmTutoring;
