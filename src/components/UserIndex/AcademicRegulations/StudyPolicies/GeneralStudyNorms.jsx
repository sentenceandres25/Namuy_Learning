// Components/StudyPolicies/GeneralStudyNorms.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './GeneralStudyNorms.module.css';

const GeneralStudyNorms = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.generalStudyNorms}>
      <h3>{t('generalStudyNorms')}</h3>
      <p>{t('generalNormsText')}</p>
    </div>
  );
};

export default GeneralStudyNorms;
