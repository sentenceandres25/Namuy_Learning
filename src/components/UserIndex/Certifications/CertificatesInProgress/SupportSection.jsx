// Components/CertificatesInProgress/SupportSection.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SupportSection.module.css';
import { FaHandsHelping } from 'react-icons/fa';

const SupportSection = ({ supportContact }) => {
  const { t } = useTranslation('UserIndex/Certifications/CertificatesInProgress');

  const handleContactSupport = () => {
    // Lógica para contactar al soporte
    window.location.href = supportContact;
  };

  return (
    <div className={styles.supportSection}>
      <h4><FaHandsHelping /> {t('academicSupport')}</h4>
      <button className={styles.contactButton} onClick={handleContactSupport}>
        {t('contactSupport')}
      </button>
    </div>
  );
};

export default SupportSection;
