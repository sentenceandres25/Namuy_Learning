// Components/LoginForm/LinksLogin.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LinksLogin.module.css';

const LinksLogin = () => {
  const { t } = useTranslation('LoginProgress/LoginForm');

  return (
    <div className={styles.linksContainer}>
      <a href="/forgot-password" className={styles.loginLink}>
        {t('forgotPassword')}
      </a>
      <span className={styles.separator}>|</span>
      <a href="/help" className={styles.loginLink}>
        {t('needHelp')}
      </a>
    </div>
  );
};

export default LinksLogin;
