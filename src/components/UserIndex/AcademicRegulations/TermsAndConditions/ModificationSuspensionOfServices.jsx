// Components/TermsAndConditions/ModificationSuspensionOfServices.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ModificationSuspensionOfServices.module.css';

const ModificationSuspensionOfServices = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.modificationSuspensionOfServices}>
      <h3>{t('modificationSuspensionOfServicesTitle')}</h3>
      <p>{t('modificationSuspensionOfServicesText')}</p>
    </div>
  );
};

export default ModificationSuspensionOfServices;
