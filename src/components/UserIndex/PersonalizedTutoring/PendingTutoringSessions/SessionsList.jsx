// Components/PendingTutoringSessions/SessionsList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SessionsList.module.css';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';

const SessionsList = ({ sessions, selectedSession, onSelectSession }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');

  return (
    <motion.div
      className={styles.sessionsList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.cardContainer}>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`${styles.sessionCard} ${
              selectedSession && selectedSession.id === session.id ? styles.selected : ''
            }`}
            onClick={() => onSelectSession(session)}
          >
            <FaCalendarAlt className={styles.icon} />
            <h4>{session.course}</h4>
            <p>
              {t('tutor')}: {session.tutor}
            </p>
            <p>
              {t('date')}: {session.date}
            </p>
            <p>
              {t('time')}: {session.time}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SessionsList;
