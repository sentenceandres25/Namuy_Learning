// Components/ExpiredCertificates/RenewalReminder.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RenewalReminder.module.css';
import { FaBell } from 'react-icons/fa';

const RenewalReminder = ({ certificateId }) => {
  const { t } = useTranslation('UserIndex/Certifications/ExpiredCertificates');
  const [reminderSet, setReminderSet] = useState(false);

  const handleSetReminder = () => {
    setReminderSet(true);
    // Lógica para configurar el recordatorio (por ejemplo, llamada a una API)
    alert(t('renewalReminderSet'));
  };

  return (
    <div className={styles.renewalReminder}>
      <button
        className={styles.reminderButton}
        onClick={handleSetReminder}
        disabled={reminderSet}
      >
        <FaBell /> {reminderSet ? t('reminderSet') : t('setRenewalReminder')}
      </button>
    </div>
  );
};

export default RenewalReminder;
