// Components/StartNewConversation/ConversationPrivacy.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConversationPrivacy.module.css';
import { Form, Button } from 'react-bootstrap';

const ConversationPrivacy = ({ privacy, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');

  return (
    <div className={styles.conversationPrivacy}>
      <h3>{t('conversationPrivacy')}</h3>
      <Form.Group controlId="formPrivacy">
        <Form.Label>{t('choosePrivacy')}</Form.Label>
        <Form.Check
          type="radio"
          label={t('public')}
          name="privacyOptions"
          value="public"
          checked={privacy === 'public'}
          onChange={(e) => onChange(e.target.value)}
        />
        <Form.Check
          type="radio"
          label={t('private')}
          name="privacyOptions"
          value="private"
          checked={privacy === 'private'}
          onChange={(e) => onChange(e.target.value)}
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

export default ConversationPrivacy;
