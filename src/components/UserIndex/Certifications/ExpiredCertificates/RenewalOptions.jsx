// Components/ExpiredCertificates/RenewalOptions.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RenewalOptions.module.css';
import { FaRedo } from 'react-icons/fa';

const RenewalOptions = ({ renewalUrl }) => {
  const { t } = useTranslation('UserIndex/Certifications/ExpiredCertificates');

  const handleRenew = () => {
    window.location.href = renewalUrl;
  };

  return (
    <button className={styles.renewButton} onClick={handleRenew}>
      <FaRedo /> {t('renewCertificate')}
    </button>
  );
};

export default RenewalOptions;
