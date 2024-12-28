// Components/TermsAndConditions/AcceptanceOfTerms.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AcceptanceOfTerms.module.css';

const AcceptanceOfTerms = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');
  const acceptance = t('acceptanceOfTerms', { returnObjects: true });

  return (
    <div className={styles.acceptanceOfTerms}>
      <h3 className={styles.title}>{acceptance.title}</h3>
      <p className={styles.text}>{acceptance.text}</p>
    </div>
  );
};

export default AcceptanceOfTerms;
