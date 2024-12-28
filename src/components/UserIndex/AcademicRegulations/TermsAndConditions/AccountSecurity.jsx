// Components/TermsAndConditions/AccountSecurity.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AccountSecurity.module.css';

const AccountSecurity = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.accountSecurity}>
      <h3>{t('accountSecurityTitle')}</h3>
      <p>{t('accountSecurityText')}</p>
    </div>
  );
};

export default AccountSecurity;
