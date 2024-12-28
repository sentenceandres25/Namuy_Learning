// Components/MyContributions/ReplyNotifications.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ReplyNotifications.module.css';
import { FaBell } from 'react-icons/fa';

const ReplyNotifications = ({ notifications }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  const handleNotificationClick = (topicTitle) => {
    // Navigate to the reply thread
    alert(`Navigating to replies for: ${topicTitle}`);
  };

  return (
    <div className={styles.replyNotifications}>
      <h3>
        <FaBell /> {t('replyNotifications')}
      </h3>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className={styles.notificationItem} onClick={() => handleNotificationClick(notification.topicTitle)}>
            <p>
              {t('newReplyFrom')} {notification.replyFrom} {t('onTopic')} {notification.topicTitle}
            </p>
            <p>
              <strong>{t('date')}:</strong> {notification.date}
            </p>
          </div>
        ))
      ) : (
        <p>{t('noNotifications')}</p>
      )}
    </div>
  );
};

export default ReplyNotifications;
