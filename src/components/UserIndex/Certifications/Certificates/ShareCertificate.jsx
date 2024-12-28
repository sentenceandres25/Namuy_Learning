// Components/Certificates/ShareCertificate.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ShareCertificate.module.css';
import { FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';

const ShareCertificate = ({ certificateId }) => {
  const { t } = useTranslation('UserIndex/Certifications/Certificates');

  const handleShare = (platform) => {
    // Lógica para compartir en redes sociales
    alert(`${t('sharingOn')} ${platform}`);
  };

  return (
    <div className={styles.shareContainer}>
      <p>{t('shareCertificate')}:</p>
      <div className={styles.icons}>
        <FaLinkedin onClick={() => handleShare('LinkedIn')} />
        <FaTwitter onClick={() => handleShare('Twitter')} />
        <FaFacebook onClick={() => handleShare('Facebook')} />
      </div>
    </div>
  );
};

export default ShareCertificate;
