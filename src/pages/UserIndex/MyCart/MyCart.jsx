import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './MyCart.module.css';

import HeaderComponent from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import CartItem from '../../../components/UserIndex/MyCart/CartItem';
import CartSummary from '../../../components/UserIndex/MyCart/CartSummary';
import RecommendedCoursesCarousel from '../../../components/UserIndex/MyCourses/CoursesInProgress/RecommendedCoursesCarousel'; // Import the recommended courses carousel

const MyCart = () => {
  const [headerHeight, setHeaderHeight] = useState('auto');
  const { t } = useTranslation('UserIndex/MyCart/MyCart');

  // Datos de ejemplo para el carrito (Ahora son cursos con más info)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Curso de React para Principiantes',
      author: 'Juan Pérez',
      rating: 4.5,
      duration: '10 horas',
      level: 'Principiante',
      image: 'https://via.placeholder.com/100',
      price: 59.99,
      quantity: 2
    },
    {
      id: 2,
      name: 'Master en Node.js',
      author: 'María Gómez',
      rating: 4.8,
      duration: '15 horas',
      level: 'Intermedio',
      image: 'https://via.placeholder.com/100',
      price: 120.00,
      quantity: 1
    }
  ]);

  const handleQuantityChange = (id, newQty) => {
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCartItems(updatedItems);
  };

  const handleRemove = (id) => {
    const filteredItems = cartItems.filter(item => item.id !== id);
    setCartItems(filteredItems);
  };

  // Cálculo del total
  const total = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  // Ejemplo de descuentos aplicados:
  const discounts = [
    { name: 'Descuento de fin de temporada', amount: '-$10.00' },
    { name: 'Cupón de fidelidad', amount: '-$5.00' }
  ];

  return (
    <>
      <PageTitle titleKey="mycartTitle" />

      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.headerWrapper}
      >
        <HeaderComponent headerHeight={headerHeight} className="header-user-index"/>
      </motion.div>

      <div className={styles.container}>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={styles.pageTitle}
        >
          {t('myCartHeading')} ({cartItems.length})
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.cartSection}
        >
          <div className={styles.itemsAndSummary}>
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className={styles.emptyCart}
              >
                <p>{t('emptyCartMessage')}</p>
              </motion.div>
            ) : (
              <>
                <div className={styles.itemsList}>
                  {cartItems.map(item => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onQuantityChange={handleQuantityChange} 
                      onRemove={handleRemove}
                      t={t}
                    />
                  ))}
                </div>
                <CartSummary 
                  total={total}
                  discounts={discounts}
                  t={t}
                />
              </>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.recommendedSection}
        >
          <RecommendedCoursesCarousel />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
      >
        <Footer />
      </motion.div>
    </>
  );
};

export default MyCart;
