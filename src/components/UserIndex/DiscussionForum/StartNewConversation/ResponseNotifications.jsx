// Components/StartNewConversation/ResponseNotifications.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ResponseNotifications.module.css';
import { Form, Button } from 'react-bootstrap';

const ResponseNotifications = ({ notifications, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');

  return (
    <div className={styles.responseNotifications}>
      <h3>{t('responseNotifications')}</h3>
      <Form.Group controlId="formNotifications">
        <Form.Check
          type="checkbox"
          label={t('receiveNotifications')}
          checked={notifications}
          onChange={(e) => onChange(e.target.checked)}
        />
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

export default ResponseNotifications;
