// Components/StartNewConversation/VisibilityPreferences.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './VisibilityPreferences.module.css';
import { Form, Button } from 'react-bootstrap';

const VisibilityPreferences = ({ visibility, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');

  return (
    <div className={styles.visibilityPreferences}>
      <h3>{t('visibilityPreferences')}</h3>
      <Form.Group controlId="formVisibility">
        <Form.Label>{t('chooseVisibility')}</Form.Label>
        <Form.Check
          type="radio"
          label={t('everyone')}
          name="visibilityOptions"
          value="everyone"
          checked={visibility === 'everyone'}
          onChange={(e) => onChange(e.target.value)}
        />
        <Form.Check
          type="radio"
          label={t('selectGroup')}
          name="visibilityOptions"
          value="group"
          checked={visibility === 'group'}
          onChange={(e) => onChange(e.target.value)}
        />
        {/* Add logic to select specific group if 'group' is selected */}
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

export default VisibilityPreferences;
