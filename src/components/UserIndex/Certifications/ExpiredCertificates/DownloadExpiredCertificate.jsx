// Components/ExpiredCertificates/DownloadExpiredCertificate.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DownloadExpiredCertificate.module.css';
import { FaDownload } from 'react-icons/fa';

const DownloadExpiredCertificate = ({ downloadUrl }) => {
  const { t } = useTranslation('ExpiredCertificates');

  return (
    <a href={downloadUrl} className={styles.downloadButton} target="_blank" rel="noopener noreferrer">
      <FaDownload /> {t('UserIndex/Certifications/downloadExpiredCertificate')}
    </a>
  );
};

export default DownloadExpiredCertificate;
