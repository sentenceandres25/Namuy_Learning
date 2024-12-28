// Components/VirtualLibrary/ResourceCategories.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ResourceCategories.module.css';
import { Button } from 'react-bootstrap';

const ResourceCategories = ({ categories, selectedCategory, onSelectCategory }) => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');

  return (
    <div className={styles.resourceCategories}>
      <h4>{t('resourceCategories')}</h4>
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

export default ResourceCategories;
