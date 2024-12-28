// Components/FrequentlyAskedQuestions/FAQCategories.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FAQCategories.module.css';
import { ListGroup } from 'react-bootstrap';

const FAQCategories = ({ categories, onSelectCategory }) => {
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');

  return (
    <div className={styles.faqCategories}>
      <h4>{t('categories')}</h4>
      <ListGroup>
        {categories.map((category) => (
          <ListGroup.Item
            key={category}
            action
            onClick={() => onSelectCategory(category)}
          >
            {t(category)}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default FAQCategories;
