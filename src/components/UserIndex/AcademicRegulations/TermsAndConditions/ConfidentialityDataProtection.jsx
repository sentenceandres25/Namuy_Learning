// Components/TermsAndConditions/ConfidentialityDataProtection.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConfidentialityDataProtection.module.css';

const ConfidentialityDataProtection = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.confidentialityDataProtection}>
      <h3>{t('confidentialityDataProtectionTitle')}</h3>
      <p>{t('confidentialityDataProtectionText')}</p>
    </div>
  );
};

export default ConfidentialityDataProtection;
