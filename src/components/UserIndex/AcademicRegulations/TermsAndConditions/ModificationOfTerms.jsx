// Components/TermsAndConditions/ModificationOfTerms.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ModificationOfTerms.module.css';

const ModificationOfTerms = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.modificationOfTerms}>
      <h3>{t('modificationOfTermsTitle')}</h3>
      <p>{t('modificationOfTermsText')}</p>
    </div>
  );
};

export default ModificationOfTerms;
