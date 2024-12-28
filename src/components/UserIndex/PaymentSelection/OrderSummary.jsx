// OrderSummary.jsx
import React from 'react';
import styles from './OrderSummary.module.css';

const OrderSummary = ({ t, course }) => {
  return (
    <div className={styles.summaryContainer}>
      <h2>{t('orderSummary')}</h2>
      <p>{t('termsOfUseNote')}</p>
      <p>{t('moneyBackGuarantee')}</p>

      <div className={styles.summaryTotal}>
        <span>{t('price')}: ${course.price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
