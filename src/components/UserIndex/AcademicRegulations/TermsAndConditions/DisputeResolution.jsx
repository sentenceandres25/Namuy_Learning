// Components/TermsAndConditions/DisputeResolution.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DisputeResolution.module.css';

const DisputeResolution = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.disputeResolution}>
      <h3>{t('disputeResolutionTitle')}</h3>
      <p>{t('disputeResolutionText')}</p>
    </div>
  );
};

export default DisputeResolution;
