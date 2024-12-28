// Components/TermsAndConditions/StudentRights.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StudentRights.module.css';

const StudentRights = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.studentRights}>
      <h3>{t('studentRightsTitle')}</h3>
      <p>{t('studentRightsText')}</p>
    </div>
  );
};

export default StudentRights;
