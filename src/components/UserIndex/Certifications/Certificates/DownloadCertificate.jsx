// Components/Certificates/DownloadCertificate.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DownloadCertificate.module.css';
import { FaDownload } from 'react-icons/fa';

const DownloadCertificate = ({ certificateId }) => {
  const { t } = useTranslation('UserIndex/Certifications/Certificates');

  const handleDownload = () => {
    // Lógica para descargar el certificado
    alert(`${t('downloadingCertificate')} ID: ${certificateId}`);
  };

  return (
    <button className={styles.downloadButton} onClick={handleDownload}>
      <FaDownload /> {t('downloadCertificate')}
    </button>
  );
};

export default DownloadCertificate;
