// Components/TermsAndConditions/IntellectualProperty.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './IntellectualProperty.module.css';

const IntellectualProperty = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.intellectualProperty}>
      <h3>{t('intellectualPropertyTitle')}</h3>
      <p>{t('intellectualPropertyText')}</p>
    </div>
  );
};

export default IntellectualProperty;
