// PaymentMethodSelector.jsx
import React from 'react';
import styles from './PaymentMethodSelector.module.css';

const PaymentMethodSelector = ({ t, selectedMethod, onMethodChange }) => {
  return (
    <div className={styles.paymentMethodSection}>
      <h2>{t('choosePaymentMethod')}</h2>
      <div className={styles.methodOptions}>
        <label className={styles.methodOption}>
          <input 
            type="radio" 
            name="paymentMethod" 
            value="paypal" 
            checked={selectedMethod === 'paypal'} 
            onChange={onMethodChange} 
          />
          {t('paypalOption')}
        </label>
        <label className={styles.methodOption}>
          <input 
            type="radio" 
            name="paymentMethod" 
            value="pse" 
            checked={selectedMethod === 'pse'} 
            onChange={onMethodChange} 
          />
          {t('pseOption')}
        </label>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
