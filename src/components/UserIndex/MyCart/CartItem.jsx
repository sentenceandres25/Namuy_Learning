import React from 'react';
import styles from './CartItem.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push('★');
  }
  if (halfStar) {
    stars.push('★');
  }
  return stars.join('');
};

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { t } = useTranslation('UserIndex/MyCart/MyCart'); 

  const handleQuantity = (e) => {
    onQuantityChange(item.id, parseInt(e.target.value, 10));
  };

  const handleRemoveClick = () => {
    onRemove(item.id);
  };

  return (
    <motion.div 
      className={styles.cartItem}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={styles.imageWrapper}>
        <img src={item.image} alt={item.name} />
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.leftColumn}>
          <h4 className={styles.title}>{item.name}</h4>
          <p className={styles.author}>{item.author}</p>
          <p className={styles.rating}>
            {renderStars(item.rating)} <span className={styles.ratingNumber}>({item.rating.toFixed(1)})</span>
          </p>
          <p className={styles.additionalInfo}>
            {item.duration} · {item.level}
          </p>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.topRight}>
            <p className={styles.price}>$ {item.price.toFixed(2)}</p>
            <div className={styles.quantity}>
              <label>
                {t('cartItemQuantity')}:
                <select value={item.quantity} onChange={handleQuantity}>
                  {[...Array(10).keys()].map(num => (
                    <option key={num} value={num+1}>{num+1}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className={styles.extraActions}>
            <button 
              className={`${styles.actionBtn} ${styles.deleteBtn}`} 
              onClick={handleRemoveClick}
            >
              {t('delete')}
            </button>
            <button className={`${styles.actionBtn} ${styles.saveBtn}`}>{t('saveForLater')}</button>
            <button className={`${styles.actionBtn} ${styles.wishlistBtn}`}>{t('moveToWishlist')}</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
