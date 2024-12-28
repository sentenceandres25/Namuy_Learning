// Components/CertificatesInProgress/PerformanceStats.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PerformanceStats.module.css';
import { FaChartLine } from 'react-icons/fa';

const PerformanceStats = ({ stats }) => {
  const { t } = useTranslation('UserIndex/Certifications/CertificatesInProgress');

  if (!stats) {
    return null;
  }

  return (
    <div className={styles.performanceStats}>
      <h4><FaChartLine /> {t('performanceStats')}</h4>
      <p><strong>{t('averageScore')}:</strong> {stats.averageScore}%</p>
      <p><strong>{t('timeInvested')}:</strong> {stats.timeInvested}</p>
    </div>
  );
};

export default PerformanceStats;
