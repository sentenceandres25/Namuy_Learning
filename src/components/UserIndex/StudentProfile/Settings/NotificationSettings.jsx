// components/Settings/NotificationSettings.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './NotificationSettings.module.css';

const NotificationSettings = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [dndStart, setDndStart] = useState('22:00');
  const [dndEnd, setDndEnd] = useState('07:00');

  const handleEmailNotificationsChange = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleSmsNotificationsChange = () => {
    setSmsNotifications(!smsNotifications);
  };

  const handleDoNotDisturbChange = () => {
    setDoNotDisturb(!doNotDisturb);
  };

  return (
    <motion.div
      className={styles.notificationSettings}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('notifications')}</h2>
      <div className={styles.settingItem}>
        <label>{t('emailNotifications')}</label>
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={handleEmailNotificationsChange}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('smsNotifications')}</label>
        <input
          type="checkbox"
          checked={smsNotifications}
          onChange={handleSmsNotificationsChange}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('doNotDisturb')}</label>
        <input
          type="checkbox"
          checked={doNotDisturb}
          onChange={handleDoNotDisturbChange}
        />
      </div>
      {doNotDisturb && (
        <div className={styles.dndTimes}>
          <div className={styles.dndItem}>
            <label>{t('dndStart')}</label>
            <input
              type="time"
              value={dndStart}
              onChange={(e) => setDndStart(e.target.value)}
            />
          </div>
          <div className={styles.dndItem}>
            <label>{t('dndEnd')}</label>
            <input
              type="time"
              value={dndEnd}
              onChange={(e) => setDndEnd(e.target.value)}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationSettings;
