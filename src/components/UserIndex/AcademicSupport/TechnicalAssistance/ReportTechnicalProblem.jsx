// Components/TechnicalAssistance/ReportTechnicalProblem.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ReportTechnicalProblem.module.css';

const ReportTechnicalProblem = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  return (
    <div className={styles.reportTechnicalProblem}>
      <h3>{t('reportTechnicalProblem')}</h3>
      <p>{t('reportInstructions')}</p>
    </div>
  );
};

export default ReportTechnicalProblem;
