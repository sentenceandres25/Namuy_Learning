// Components/ScheduleTutoring/ReminderNotifications.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ReminderNotifications.module.css';
import { Form, Button } from 'react-bootstrap';

const ReminderNotifications = ({ notifications, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/ScheduleTutoring');

  const notificationOptions = [
    { id: 'email', label: t('email') },
    { id: 'sms', label: t('sms') },
    { id: 'app', label: t('appNotifications') },
  ];

  const handleCheckboxChange = (id) => {
    let updatedNotifications = [...notifications];
    if (updatedNotifications.includes(id)) {
      updatedNotifications = updatedNotifications.filter((item) => item !== id);
    } else {
      updatedNotifications.push(id);
    }
    onChange(updatedNotifications);
  };

  return (
    <div className={styles.reminderNotifications}>
      <h3>{t('reminderNotifications')}</h3>
      <Form.Group controlId="formNotifications">
        {notificationOptions.map((option) => (
          <Form.Check
            key={option.id}
            type="checkbox"
            label={option.label}
            checked={notifications.includes(option.id)}
            onChange={() => handleCheckboxChange(option.id)}
          />
        ))}
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default ReminderNotifications;
