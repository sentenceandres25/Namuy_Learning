// Components/StudyPolicies/UseOfMaterials.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UseOfMaterials.module.css';

const UseOfMaterials = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');

  return (
    <div className={styles.useOfMaterials}>
      <h3>{t('useOfMaterials')}</h3>
      <p>{t('materialsText')}</p>
    </div>
  );
};

export default UseOfMaterials;
