// Components/StartNewConversation/SelectCategory.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SelectCategory.module.css';
import { Form, Button } from 'react-bootstrap';

const SelectCategory = ({ category, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');

  const categories = ['Study Techniques', 'Course Questions', 'Additional Resources'];

  return (
    <div className={styles.selectCategory}>
      <h3>{t('selectCategory')}</h3>
      <Form.Group controlId="formCategory">
        <Form.Label>{t('chooseCategory')}</Form.Label>
        <Form.Control
          as="select"
          value={category}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{t('selectCategoryPlaceholder')}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {t(cat)}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!category}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default SelectCategory;
