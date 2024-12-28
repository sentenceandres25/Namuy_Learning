// Pagination.jsx
import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ t, currentPage, totalPages }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i+1);

  return (
    <div className={styles.pagination}>
      <button disabled={currentPage === 1}>{t('prev')}</button>
      {pages.map(page => (
        <button 
          key={page} 
          className={page === currentPage ? styles.active : ''}>
          {page}
        </button>
      ))}
      <button disabled={currentPage === totalPages}>{t('next')}</button>
    </div>
  );
};

export default Pagination;
