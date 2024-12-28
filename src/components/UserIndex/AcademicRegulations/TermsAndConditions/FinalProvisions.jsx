// Components/TermsAndConditions/FinalProvisions.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FinalProvisions.module.css';

const FinalProvisions = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.finalProvisions}>
      <h3>{t('finalProvisionsTitle')}</h3>
      <p>{t('finalProvisionsText')}</p>
    </div>
  );
};

export default FinalProvisions;
