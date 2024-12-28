// Components/PendingTutoringSessions/ContactTutor.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ContactTutor.module.css';
import { FaEnvelope } from 'react-icons/fa';

const ContactTutor = ({ contactLink }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');

  const handleContactTutor = () => {
    // Logic to contact the tutor
    window.location.href = contactLink;
  };

  return (
    <button className={styles.contactButton} onClick={handleContactTutor}>
      <FaEnvelope /> {t('contactTutor')}
    </button>
  );
};

export default ContactTutor;
