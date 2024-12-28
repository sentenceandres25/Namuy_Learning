// Components/PendingTutoringSessions/SessionDetails.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SessionDetails.module.css';
import { motion } from 'framer-motion';
import SessionStatus from './SessionStatus';
import JoinSessionButton from './JoinSessionButton';
import RescheduleOrCancelOptions from './RescheduleOrCancelOptions';
import SessionObjectives from './SessionObjectives';
import PreSessionMaterials from './PreSessionMaterials';
import ReminderNotifications from './ReminderNotifications';
import ContactTutor from './ContactTutor';

const SessionDetails = ({ session }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');

  return (
    <motion.div
      className={styles.sessionDetails}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{session.course}</h3>
      <p>
        <strong>{t('tutor')}:</strong> {session.tutor}
      </p>
      <p>
        <strong>{t('date')}:</strong> {session.date}
      </p>
      <p>
        <strong>{t('time')}:</strong> {session.time}
      </p>
      <p>
        <strong>{t('mode')}:</strong> {session.mode}
      </p>
      <p>
        <strong>{t('duration')}:</strong> {session.duration}
      </p>

      <SessionStatus status={session.status} />
      <JoinSessionButton sessionLink={session.sessionLink} />
      <RescheduleOrCancelOptions sessionId={session.id} />
      <SessionObjectives objectives={session.objectives} />
      <PreSessionMaterials materials={session.materials} />
      <ReminderNotifications sessionId={session.id} />
      <ContactTutor contactLink={session.contactTutorLink} />
    </motion.div>
  );
};

export default SessionDetails;
