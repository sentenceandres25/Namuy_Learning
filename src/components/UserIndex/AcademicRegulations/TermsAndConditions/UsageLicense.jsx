// Components/TermsAndConditions/UsageLicense.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UsageLicense.module.css';

const UsageLicense = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.usageLicense}>
      <h3>{t('usageLicenseTitle')}</h3>
      <p>{t('usageLicenseText')}</p>
    </div>
  );
};

export default UsageLicense;
