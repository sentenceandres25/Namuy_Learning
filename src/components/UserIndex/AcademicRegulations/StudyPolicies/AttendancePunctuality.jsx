// Components/StudyPolicies/AttendancePunctuality.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AttendancePunctuality.module.css';

const AttendancePunctuality = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.attendancePunctuality}>
      <h3>{t('attendancePunctuality')}</h3>
      <p>{t('attendanceText')}</p>
    </div>
  );
};

export default AttendancePunctuality;
