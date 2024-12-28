// Components/TermsAndConditions/NonTransferability.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NonTransferability.module.css';

const NonTransferability = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.nonTransferability}>
      <h3>{t('nonTransferabilityTitle')}</h3>
      <p>{t('nonTransferabilityText')}</p>
    </div>
  );
};

export default NonTransferability;
