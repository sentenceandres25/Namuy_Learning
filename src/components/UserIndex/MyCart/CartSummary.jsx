// CartSummary.jsx
import React from 'react';
import styles from './CartSummary.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Importamos Link

const CartSummary = ({ total, discounts }) => {
  const { t, i18n } = useTranslation('UserIndex/MyCart/MyCart'); // Usamos i18n también

  const paymentSelectionRoute = `/user/PaymentSelection/${i18n.language}`;

  return (
    <motion.div 
      className={styles.summaryContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className={styles.title}>{t('orderSummary')}</h3>
      <p className={styles.subtotal}>{t('subtotal')}: <strong>${total.toFixed(2)}</strong></p>

      {discounts && discounts.length > 0 && (
        <div className={styles.discounts}>
          <h4 className={styles.discountTitle}>Descuentos aplicados:</h4>
          <ul className={styles.discountList}>
            {discounts.map((discount, index) => (
              <li key={index} className={styles.discountItem}>
                {discount.name} <span className={styles.discountAmount}>{discount.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ahora el botón es un Link a la página de selección de pago */}
      <Link to={paymentSelectionRoute} className={styles.checkoutButton}>
        {t('checkout')}
      </Link>
    </motion.div>
  );
};

export default CartSummary;
