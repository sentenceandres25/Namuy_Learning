// Components/RecentTopics/SubscribeToTopics.jsx

import React from 'react';
import styles from './SubscribeToTopics.module.css';
import { FaBell } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const SubscribeToTopics = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  const handleSubscribe = () => {
    // Logic to subscribe to topics
    alert(t('subscribedToTopics'));
  };

  return (
    <div className={styles.subscribeSection}>
      <button className={styles.subscribeButton} onClick={handleSubscribe}>
        <FaBell /> {t('subscribeToTopics')}
      </button>
    </div>
  );
};

export default SubscribeToTopics;
