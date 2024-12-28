// Components/TermsAndConditions/ComplianceWithLaws.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ComplianceWithLaws.module.css';

const ComplianceWithLaws = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.complianceWithLaws}>
      <h3>{t('complianceWithLawsTitle')}</h3>
      <p>{t('complianceWithLawsText')}</p>
    </div>
  );
};

export default ComplianceWithLaws;
