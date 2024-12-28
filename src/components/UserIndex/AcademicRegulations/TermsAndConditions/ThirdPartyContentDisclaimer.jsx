// Components/TermsAndConditions/ThirdPartyContentDisclaimer.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ThirdPartyContentDisclaimer.module.css';

const ThirdPartyContentDisclaimer = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.thirdPartyContentDisclaimer}>
      <h3>{t('thirdPartyContentDisclaimerTitle')}</h3>
      <p>{t('thirdPartyContentDisclaimerText')}</p>
    </div>
  );
};

export default ThirdPartyContentDisclaimer;
