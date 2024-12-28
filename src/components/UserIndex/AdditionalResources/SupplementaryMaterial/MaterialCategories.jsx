// Components/SupplementaryMaterial/MaterialCategories.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MaterialCategories.module.css';
import { Button } from 'react-bootstrap';

const MaterialCategories = ({ categories, selectedCategory, onSelectCategory }) => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  return (
    <div className={styles.materialCategories}>
      <h4>{t('materialCategories')}</h4>
      <div className={styles.categoryButtons}>
        <Button
          variant={selectedCategory === '' ? 'primary' : 'outline-primary'}
          onClick={() => onSelectCategory('')}
        >
          {t('all')}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'outline-primary'}
            onClick={() => onSelectCategory(category)}
          >
            {t(category)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MaterialCategories;
