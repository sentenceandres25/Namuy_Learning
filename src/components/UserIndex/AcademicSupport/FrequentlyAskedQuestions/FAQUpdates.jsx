// Components/FrequentlyAskedQuestions/FAQUpdates.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FAQUpdates.module.css';

const FAQUpdates = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');

  return (
    <div className={styles.faqUpdates}>
      <h4>{t('faqUpdates')}</h4>
      <p>{t('updatesText')}</p>
    </div>
  );
};

export default FAQUpdates;
