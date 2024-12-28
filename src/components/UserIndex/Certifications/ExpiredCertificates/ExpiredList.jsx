// Components/ExpiredCertificates/ExpiredList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExpiredList.module.css';
import { motion } from 'framer-motion';
import { FaRegTimesCircle } from 'react-icons/fa';

const ExpiredList = ({ certificates, selectedCertificate, onSelectCertificate }) => {
  const { t } = useTranslation('UserIndex/Certifications/ExpiredCertificates');

  return (
    <motion.div
      className={styles.expiredList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
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
            <FaRegTimesCircle className={styles.icon} />
            <h4>{certificate.courseName}</h4>
            <p>{t('expiredOn')}: {certificate.expiredDate}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExpiredList;
