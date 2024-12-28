// Components/TermsAndConditions/AcceptableUsePolicy.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AcceptableUsePolicy.module.css';

const AcceptableUsePolicy = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.acceptableUsePolicy}>
      <h3>{t('acceptableUsePolicyTitle')}</h3>
      <p>{t('acceptableUsePolicyText')}</p>
    </div>
  );
};

export default AcceptableUsePolicy;
