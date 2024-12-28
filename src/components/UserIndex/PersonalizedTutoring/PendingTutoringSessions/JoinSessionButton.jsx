// Components/PendingTutoringSessions/JoinSessionButton.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './JoinSessionButton.module.css';
import { FaVideo } from 'react-icons/fa';

const JoinSessionButton = ({ sessionLink }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');

  const handleJoinSession = () => {
    // Logic to join the session
    window.location.href = sessionLink;
  };

  return (
    <button className={styles.joinButton} onClick={handleJoinSession}>
      <FaVideo /> {t('joinSession')}
    </button>
  );
};

export default JoinSessionButton;
