// Components/EvaluateTutoringSessions/SessionsToEvaluateList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SessionsToEvaluateList.module.css';
import { motion } from 'framer-motion';
import { FaClipboardList } from 'react-icons/fa';

const SessionsToEvaluateList = ({ sessions, selectedSession, onSelectSession }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  return (
    <motion.div
      className={styles.sessionsList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('sessionsToEvaluate')}</h3>
      <div className={styles.cardContainer}>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`${styles.sessionCard} ${
              selectedSession && selectedSession.id === session.id ? styles.selected : ''
            }`}
            onClick={() => onSelectSession(session)}
          >
            <FaClipboardList className={styles.icon} />
            <h4>{session.course}</h4>
            <p>
              {t('topic')}: {session.topic}
            </p>
            <p>
              {t('tutor')}: {session.tutor}
            </p>
            <p>
              {t('date')}: {session.date}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SessionsToEvaluateList;
