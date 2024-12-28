// Components/TermsAndConditions/PaymentsCancellations.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PaymentsCancellations.module.css';

const PaymentsCancellations = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.paymentsCancellations}>
      <h3>{t('paymentsCancellationsTitle')}</h3>
      <p>{t('paymentsCancellationsText')}</p>
    </div>
  );
};

export default PaymentsCancellations;
