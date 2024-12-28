// Components/CertificatesInProgress/ProgressList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProgressList.module.css';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher } from 'react-icons/fa';

const ProgressList = ({ certificates, selectedCertificate, onSelectCertificate }) => {
  const { t } = useTranslation('UserIndex/Certifications/CertificatesInProgress');

  return (
    <motion.div
      className={styles.progressList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.cardsContainer}>
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
            <FaChalkboardTeacher className={styles.icon} />
            <h4>{certificate.courseName}</h4>
            <p>{t('progress')}: {certificate.progress}%</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${certificate.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProgressList;
