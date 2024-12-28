// Components/StartNewConversation/TopicVerification.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TopicVerification.module.css';
import { Button } from 'react-bootstrap';

const TopicVerification = ({ conversationData, onPublish, onBack }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');

  return (
    <div className={styles.topicVerification}>
      <h3>{t('topicVerification')}</h3>
      <p>
        <strong>{t('title')}:</strong> {conversationData.title}
      </p>
      <p>
        <strong>{t('category')}:</strong> {conversationData.category}
      </p>
      <p>
        <strong>{t('description')}:</strong> {conversationData.description}
      </p>
      <p>
        <strong>{t('filesOrLinks')}:</strong>{' '}
        {conversationData.filesOrLinks.map((item, index) => (
          <span key={index}>
            {item.type}: {item.value};{' '}
          </span>
        ))}
      </p>
      <p>
        <strong>{t('privacy')}:</strong> {conversationData.privacy}
      </p>
      <p>
        <strong>{t('tags')}:</strong> {conversationData.tags.join(', ')}
      </p>
      <p>
        <strong>{t('notifications')}:</strong>{' '}
        {conversationData.notifications ? t('yes') : t('no')}
      </p>
      <p>
        <strong>{t('visibility')}:</strong> {conversationData.visibility}
      </p>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="success" onClick={onPublish}>
          {t('publish')}
        </Button>
      </div>
    </div>
  );
};

export default TopicVerification;
