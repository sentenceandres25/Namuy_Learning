// Components/PendingTutoringSessions/RescheduleOrCancelOptions.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RescheduleOrCancelOptions.module.css';
import { FaCalendarAlt, FaTimesCircle } from 'react-icons/fa';

const RescheduleOrCancelOptions = ({ sessionId }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');

  const handleReschedule = () => {
    // Logic to reschedule the session
    alert(t('rescheduleSession'));
  };

  const handleCancel = () => {
    // Logic to cancel the session
    alert(t('cancelSession'));
  };

  return (
    <div className={styles.options}>
      <button className={styles.rescheduleButton} onClick={handleReschedule}>
        <FaCalendarAlt /> {t('reschedule')}
      </button>
      <button className={styles.cancelButton} onClick={handleCancel}>
        <FaTimesCircle /> {t('cancel')}
      </button>
    </div>
  );
};

export default RescheduleOrCancelOptions;
