// Components/TechnicalAssistance/SystemStatus.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SystemStatus.module.css';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const SystemStatus = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  // Sample system status (replace with real data)
  const isSystemOperational = true;

  return (
    <div className={styles.systemStatus}>
      <h3>{t('systemStatus')}</h3>
      {isSystemOperational ? (
        <p className={styles.operational}>
          <FaCheckCircle /> {t('systemOperational')}
        </p>
      ) : (
        <p className={styles.down}>
          <FaExclamationTriangle /> {t('systemDown')}
        </p>
      )}
    </div>
  );
};

export default SystemStatus;
