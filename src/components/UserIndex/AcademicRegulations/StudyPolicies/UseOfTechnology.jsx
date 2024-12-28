// Components/StudyPolicies/UseOfTechnology.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UseOfTechnology.module.css';

const UseOfTechnology = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.useOfTechnology}>
      <h3>{t('useOfTechnology')}</h3>
      <p>{t('technologyText')}</p>
    </div>
  );
};

export default UseOfTechnology;
