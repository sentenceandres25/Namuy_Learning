// Components/TermsAndConditions/PlatformAccessRestrictions.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PlatformAccessRestrictions.module.css';

const PlatformAccessRestrictions = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.platformAccessRestrictions}>
      <h3>{t('platformAccessRestrictionsTitle')}</h3>
      <p>{t('platformAccessRestrictionsText')}</p>
    </div>
  );
};

export default PlatformAccessRestrictions;
