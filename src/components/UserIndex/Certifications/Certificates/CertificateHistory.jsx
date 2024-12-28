// Components/Certificates/CertificateHistory.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CertificateHistory.module.css';
import { motion } from 'framer-motion';

const CertificateHistory = ({ certificates }) => {
  const { t } = useTranslation('UserIndex/Certifications/Certificates');

  return (
    <motion.div
      className={styles.history}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('certificateHistory')}</h3>
      <ul>
        {certificates.map((certificate) => (
          <li key={certificate.id}>
            <p>
              <strong>{certificate.courseName}</strong> - {certificate.obtainedDate}
            </p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default CertificateHistory;
