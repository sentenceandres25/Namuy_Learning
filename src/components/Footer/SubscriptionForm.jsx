// SubscriptionForm.jsx
import React from 'react';
import styles from './SubscriptionForm.module.css';

const SubscriptionForm = ({ title }) => (
  <div className={styles.footerSubscription}>
    <h4>{title}</h4>
    <form className={styles.form}>
      <input type="email" placeholder="Tu Email" />
      <button type="submit">Suscribir</button>
    </form>
    <form className={styles.form}>
      <select>
        <option value="+57">CO +57</option>
      </select>
      <input type="tel" placeholder="Cuenta de WhatsApp" />
      <button type="submit">Suscribir</button>
    </form>
  </div>
);

export default SubscriptionForm;
