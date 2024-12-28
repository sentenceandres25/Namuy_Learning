// PaymentSelection.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import HeaderComponent from '../../../components/UserIndex/PaymentSelection/Header';
import Footer from '../../../components/UserIndex/PaymentSelection/Footer';
import styles from './PaymentSelection.module.css';

import PaymentMethodSelector from '../../../components/UserIndex/PaymentSelection/PaymentMethodSelector';
import OrderDetails from '../../../components/UserIndex/PaymentSelection/OrderDetails';
import OrderSummary from '../../../components/UserIndex/PaymentSelection/OrderSummary';
import { Link } from 'react-router-dom';

const PaymentSelection = () => {
  const { t, i18n } = useTranslation('UserIndex/PaymentSelection/PaymentSelection');
  
  // Datos simulados del curso
  const course = {
    image: 'https://via.placeholder.com/100', 
    name: 'Full Stack Web Development Course',
    price: 199.99,
    quantity: 1
  };

  const [selectedMethod, setSelectedMethod] = useState('paypal');

  const handleMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  // Determinar la ruta al hacer clic en continuar
  const getCheckoutRoute = () => {
    if (selectedMethod === 'paypal') {
      return `/user/PayPalCheckout/${i18n.language}`;
    } else {
      return `/user/PSECheckout/${i18n.language}`;
    }
  };

  return (
    <div className={styles.gradientBackground}>
      <HeaderComponent 
        rightOption={t('cancel')} 
        t={t}
      />

      <div className={styles.container}>
        <motion.div 
          className={styles.leftColumn}
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.01 }} // Ligero hover
        >
          <h1 className={styles.payTitle}>{t('payTitle')}</h1>
          <p className={styles.billingAddress}>{t('billingAddress')}</p>
          <p className={styles.taxesNote}>{t('taxesNote')}</p>
          
          <PaymentMethodSelector 
            t={t} 
            selectedMethod={selectedMethod} 
            onMethodChange={handleMethodChange}
          />

          <OrderDetails 
            t={t}
            course={course}
          />

          {/* Botón para continuar dependiendo del método elegido */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.continueButtonWrapper}
          >
            <Link to={getCheckoutRoute()} className={styles.continueButton}>
              {t('continue')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.rightColumn}
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.01 }}
        >
          <OrderSummary 
            t={t}
            course={course}
          />
        </motion.div>
      </div>

      <Footer t={t} />
    </div>
  );
};

export default PaymentSelection;
