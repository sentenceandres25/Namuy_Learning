// Components/TechnicalAssistance/LiveSupport.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LiveSupport.module.css';
import { Button } from 'react-bootstrap';
import { FaComments } from 'react-icons/fa';

const LiveSupport = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  const handleLiveChat = () => {
    // Logic to initiate live chat
    alert(t('connectingLiveSupport'));
  };

  return (
    <div className={styles.liveSupport}>
      <h3>{t('liveSupport')}</h3>
      <Button variant="primary" onClick={handleLiveChat}>
        <FaComments /> {t('startLiveChat')}
      </Button>
    </div>
  );
};

export default LiveSupport;
