// Components/StudyPolicies/ConsequencesOfNonCompliance.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConsequencesOfNonCompliance.module.css';

const ConsequencesOfNonCompliance = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.consequencesOfNonCompliance}>
      <h3>{t('consequencesOfNonCompliance')}</h3>
      <p>{t('consequencesText')}</p>
    </div>
  );
};

export default ConsequencesOfNonCompliance;
