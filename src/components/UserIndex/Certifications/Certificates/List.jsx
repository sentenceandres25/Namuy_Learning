// Components/Certificates/List.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './List.module.css';
import { motion } from 'framer-motion';
import { FaCertificate } from 'react-icons/fa';

const CertificateList = ({ certificates, selectedCertificate, onSelectCertificate }) => {
  const { t } = useTranslation('UserIndex/Certifications/Certificates');

  return (
    <motion.div
      className={styles.certificateList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('yourCertificates')}</h3>
      <div className={styles.cardContainer}>
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className={`${styles.certificateCard} ${
              selectedCertificate && selectedCertificate.id === certificate.id
                ? styles.selected
                : ''
            }`}
            onClick={() => onSelectCertificate(certificate)}
          >
            <FaCertificate className={styles.icon} />
            <h4>{certificate.courseName}</h4>
            <p>{t('obtainedOn')}: {certificate.obtainedDate}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CertificateList;
