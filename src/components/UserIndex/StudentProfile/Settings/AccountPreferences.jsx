// components/Settings/AccountPreferences.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './AccountPreferences.module.css';

const AccountPreferences = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');

  return (
    <motion.div
      className={styles.accountPreferences}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('accountPreferences')}</h2>
      <div className={styles.settingItem}>
        <label>{t('identityVerification')}</label>
        <button>{t('manage')}</button>
      </div>
      <div className={styles.settingItem}>
        <label>{t('subscriptionManagement')}</label>
        <button>{t('manage')}</button>
      </div>
      <div className={styles.settingItem}>
        <label>{t('downloadHistory')}</label>
        <button>{t('view')}</button>
      </div>
    </motion.div>
  );
};

export default AccountPreferences;
