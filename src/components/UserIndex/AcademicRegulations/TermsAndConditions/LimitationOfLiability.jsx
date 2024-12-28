// Components/TermsAndConditions/LimitationOfLiability.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LimitationOfLiability.module.css';

const LimitationOfLiability = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.limitationOfLiability}>
      <h3>{t('limitationOfLiabilityTitle')}</h3>
      <p>{t('limitationOfLiabilityText')}</p>
    </div>
  );
};

export default LimitationOfLiability;
