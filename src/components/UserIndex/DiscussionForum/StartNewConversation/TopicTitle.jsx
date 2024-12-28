// Components/StartNewConversation/TopicTitle.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TopicTitle.module.css';
import { Form, Button } from 'react-bootstrap';

const TopicTitle = ({ title, onChange, onNext }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');

  return (
    <div className={styles.topicTitle}>
      <h3>{t('topicTitle')}</h3>
      <Form.Group controlId="formTopicTitle">
        <Form.Label>{t('enterTopicTitle')}</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('topicTitlePlaceholder')}
        />
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="primary" onClick={onNext} disabled={!title}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default TopicTitle;
