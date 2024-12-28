// RelatedSearches.jsx
import React from 'react';
import styles from './RelatedSearches.module.css';

const RelatedSearches = ({ t }) => {
  // Ejemplo de búsquedas relacionadas
  const searches = ["Full stack development", "Data science fundamentals", "React for beginners"];

  return (
    <div className={styles.relatedSearches}>
      <h3>{t('relatedSearches')}</h3>
      <div className={styles.searchLinks}>
        {searches.map((item, index) => (
          <a key={index} href={`#${item.replace(/\s+/g, '-')}`} className={styles.searchLink}>
            {item}
          </a>
        ))}
      </div>
    </div>
  );
};

export default RelatedSearches;
