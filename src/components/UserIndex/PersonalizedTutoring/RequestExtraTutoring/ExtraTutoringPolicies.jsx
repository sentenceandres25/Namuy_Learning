// Components/RequestExtraTutoring/ExtraTutoringPolicies.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExtraTutoringPolicies.module.css';

const ExtraTutoringPolicies = () => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');

  return (
    <div className={styles.extraTutoringPolicies}>
      <h4>{t('extraTutoringPolicies')}</h4>
      <p>{t('policiesText')}</p>
    </div>
  );
};

export default ExtraTutoringPolicies;
