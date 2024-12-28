// Components/CertificatesInProgress/PendingRequirements.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PendingRequirements.module.css';
import { FaClipboardList } from 'react-icons/fa';

const PendingRequirements = ({ requirements }) => {
  const { t } = useTranslation('UserIndex/Certifications/CertificatesInProgress');

  if (!requirements || requirements.length === 0) {
    return null;
  }

  return (
    <div className={styles.pendingRequirements}>
      <h4><FaClipboardList /> {t('pendingRequirements')}</h4>
      <ul>
        {requirements.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequirements;
