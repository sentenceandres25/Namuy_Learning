// Components/StartNewConversation/TopicDescription.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TopicDescription.module.css';
import { Form, Button } from 'react-bootstrap';

const TopicDescription = ({ description, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');

  return (
    <div className={styles.topicDescription}>
      <h3>{t('topicDescription')}</h3>
      <Form.Group controlId="formTopicDescription">
        <Form.Label>{t('enterTopicDescription')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={description}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('topicDescriptionPlaceholder')}
        />
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!description}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default TopicDescription;
