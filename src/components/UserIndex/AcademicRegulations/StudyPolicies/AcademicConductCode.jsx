// Components/StudyPolicies/AcademicConductCode.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AcademicConductCode.module.css';

const AcademicConductCode = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.academicConductCode}>
      <h3>{t('academicConductCode')}</h3>
      <p>{t('conductText')}</p>
    </div>
  );
};

export default AcademicConductCode;
