// Components/FrequentlyAskedQuestions/ContactSupport.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ContactSupport.module.css';
import { Button } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';

const ContactSupport = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');

  const handleContactSupport = () => {
    // Logic to contact support
    alert(t('contactingSupport'));
  };

  return (
    <div className={styles.contactSupport}>
      <h4>{t('contactSupport')}</h4>
      <Button variant="primary" onClick={handleContactSupport}>
        <FaEnvelope /> {t('emailSupport')}
      </Button>
    </div>
  );
};

export default ContactSupport;
