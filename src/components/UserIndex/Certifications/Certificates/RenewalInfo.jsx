// Components/Certificates/RenewalInfo.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RenewalInfo.module.css';

const RenewalInfo = ({ certificate }) => {
  const { t } = useTranslation('UserIndex/Certifications/Certificates');

  const isExpired = new Date(certificate.validUntil) < new Date();

  if (!isExpired) {
    return null;
  }

  const handleRenew = () => {
    // Lógica para renovar la certificación
    alert(`${t('renewingCertificate')} ${certificate.courseName}`);
  };

  return (
    <div className={styles.renewalInfo}>
      <p>{t('certificateExpired')}</p>
      <button className={styles.renewButton} onClick={handleRenew}>
        {t('renewNow')}
      </button>
    </div>
  );
};

export default RenewalInfo;
