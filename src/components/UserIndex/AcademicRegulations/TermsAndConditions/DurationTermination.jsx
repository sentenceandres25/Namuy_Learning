// Components/TermsAndConditions/DurationTermination.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DurationTermination.module.css';

const DurationTermination = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.durationTermination}>
      <h3>{t('durationTerminationTitle')}</h3>
      <p>{t('durationTerminationText')}</p>
    </div>
  );
};

export default DurationTermination;
