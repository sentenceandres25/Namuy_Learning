// Components/ScheduleTutoring/CancellationPolicies.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CancellationPolicies.module.css';

const CancellationPolicies = () => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/ScheduleTutoring');

  return (
    <div className={styles.cancellationPolicies}>
      <h4>{t('cancellationPolicies')}</h4>
      <p>{t('policiesText')}</p>
    </div>
  );
};

export default CancellationPolicies;
