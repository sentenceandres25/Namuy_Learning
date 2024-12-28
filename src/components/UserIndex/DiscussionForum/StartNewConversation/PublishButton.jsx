// Components/StartNewConversation/PublishButton.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import styles from './PublishButton.module.css';

const PublishButton = ({ onPublish }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');

  return (
    <div className={styles.publishButtonContainer}>
      <Button variant="success" onClick={onPublish} className={styles.publishButton}>
        {t('publish')}
      </Button>
    </div>
  );
};

export default PublishButton;
