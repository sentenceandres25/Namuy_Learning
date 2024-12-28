// Components/TermsAndConditions/ServiceInterruption.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ServiceInterruption.module.css';

const ServiceInterruption = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.serviceInterruption}>
      <h3>{t('serviceInterruptionTitle')}</h3>
      <p>{t('serviceInterruptionText')}</p>
    </div>
  );
};

export default ServiceInterruption;
