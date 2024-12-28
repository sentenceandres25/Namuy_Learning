// Components/VirtualLibrary/OnlineAccess.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OnlineAccess.module.css';

const OnlineAccess = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');

  return (
    <div className={styles.onlineAccess}>
      <h4>{t('onlineAccess')}</h4>
      <p>{t('onlineAccessInfo')}</p>
    </div>
  );
};

export default OnlineAccess;
