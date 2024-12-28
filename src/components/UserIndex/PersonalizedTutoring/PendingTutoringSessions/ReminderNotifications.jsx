// Components/PendingTutoringSessions/ReminderNotifications.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ReminderNotifications.module.css';
import { FaBell } from 'react-icons/fa';

const ReminderNotifications = ({ sessionId }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');
  const [notificationsSet, setNotificationsSet] = useState(false);

  const handleSetNotifications = () => {
    setNotificationsSet(true);
    // Logic to set notifications
    alert(t('notificationsSet'));
  };

  return (
    <div className={styles.reminderNotifications}>
      <button
        className={styles.notificationsButton}
        onClick={handleSetNotifications}
        disabled={notificationsSet}
      >
        <FaBell /> {notificationsSet ? t('notificationsEnabled') : t('enableNotifications')}
      </button>
    </div>
  );
};

export default ReminderNotifications;
