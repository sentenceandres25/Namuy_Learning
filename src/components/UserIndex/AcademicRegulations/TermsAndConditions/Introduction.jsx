// Components/TermsAndConditions/Introduction.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Introduction.module.css';

const Introduction = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');
  const introduction = t('introduction', { returnObjects: true });

  return (
    <div className={styles.introduction}>
      <h3 className={styles.title}>{introduction.title}</h3>
      <p className={styles.text}>{introduction.text}</p>
    </div>
  );
};

export default Introduction;
