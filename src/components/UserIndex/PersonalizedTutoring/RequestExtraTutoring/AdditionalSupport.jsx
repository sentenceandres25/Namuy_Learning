// Components/RequestExtraTutoring/AdditionalSupport.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdditionalSupport.module.css';
import { FaLifeRing } from 'react-icons/fa';

const AdditionalSupport = () => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');

  const handleContactSupport = () => {
    // Logic to contact support
    alert(t('contactSupport'));
  };

  return (
    <div className={styles.additionalSupport}>
      <button className={styles.supportButton} onClick={handleContactSupport}>
        <FaLifeRing /> {t('contactAcademicSupport')}
      </button>
    </div>
  );
};

export default AdditionalSupport;
