// components/Settings/PrivacySettings.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './PrivacySettings.module.css';

const PrivacySettings = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleTwoFactorAuthChange = () => {
    setTwoFactorAuth(!twoFactorAuth);
  };

  return (
    <motion.div
      className={styles.privacySettings}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('privacy')}</h2>
      <div className={styles.settingItem}>
        <label>{t('twoFactorAuth')}</label>
        <button onClick={handleTwoFactorAuthChange}>
          {twoFactorAuth ? t('deactivate') : t('activate')}
        </button>
      </div>
      <div className={styles.settingItem}>
        <label>{t('activeSessions')}</label>
        <button>{t('manage')}</button>
      </div>
      <div className={styles.settingItem}>
        <label>{t('activityLog')}</label>
        <button>{t('view')}</button>
      </div>
      <div className={styles.settingItem}>
        <label>{t('temporaryLock')}</label>
        <button>{t('activate')}</button>
      </div>
    </motion.div>
  );
};

export default PrivacySettings;
