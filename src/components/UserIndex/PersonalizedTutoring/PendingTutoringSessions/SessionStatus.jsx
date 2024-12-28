// Components/PendingTutoringSessions/SessionStatus.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SessionStatus.module.css';
import { FaInfoCircle } from 'react-icons/fa';

const SessionStatus = ({ status }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return '#10b981';
      case 'Pending Confirmation':
        return '#fbbf24';
      case 'Rescheduled':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={styles.sessionStatus}>
      <FaInfoCircle style={{ color: getStatusColor(status) }} />
      <p style={{ color: getStatusColor(status) }}>
        {t('status')}: {t(status)}
      </p>
    </div>
  );
};

export default SessionStatus;
