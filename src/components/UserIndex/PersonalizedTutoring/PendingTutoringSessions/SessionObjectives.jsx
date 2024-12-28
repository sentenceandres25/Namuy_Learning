// Components/PendingTutoringSessions/SessionObjectives.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SessionObjectives.module.css';
import { FaBullseye } from 'react-icons/fa';

const SessionObjectives = ({ objectives }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');

  return (
    <div className={styles.sessionObjectives}>
      <h4>
        <FaBullseye /> {t('sessionObjectives')}
      </h4>
      <p>{objectives}</p>
    </div>
  );
};

export default SessionObjectives;
