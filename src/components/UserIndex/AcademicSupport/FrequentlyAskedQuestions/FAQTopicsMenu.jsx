// Components/FrequentlyAskedQuestions/FAQTopicsMenu.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FAQTopicsMenu.module.css';
import { Button } from 'react-bootstrap';

const FAQTopicsMenu = ({ categories, selectedCategory, onSelectCategory }) => {
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');

  return (
    <div className={styles.faqTopicsMenu}>
      <h4>{t('faqByTopic')}</h4>
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

export default FAQTopicsMenu;
