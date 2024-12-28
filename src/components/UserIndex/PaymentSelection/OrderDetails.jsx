// OrderDetails.jsx
import React from 'react';
import styles from './OrderDetails.module.css';

const OrderDetails = ({ t, course }) => {
  return (
    <div className={styles.orderDetailsSection}>
      <h2>{t('orderDetails')}</h2>
      <div className={styles.orderDetailItem}>
        <span>{t('quantity')}: {course.quantity}</span>
      </div>
      <div className={styles.orderDetailItem}>
        <img src={course.image} alt={course.name} className={styles.courseImage}/>
        <div>
          <p>{t('courseName')}: {course.name}</p>
          <p>{t('price')}: ${course.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
