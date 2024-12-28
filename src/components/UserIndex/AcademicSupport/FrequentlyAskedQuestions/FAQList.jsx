// Components/FrequentlyAskedQuestions/FAQList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FAQList.module.css';
import FAQItem from './FAQItem';

const FAQList = ({ faqs }) => {
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');

  return (
    <div className={styles.faqList}>
      <h3>{t('commonQuestions')}</h3>
      {faqs.length > 0 ? (
        faqs.map((faq) => <FAQItem key={faq.id} faq={faq} />)
      ) : (
        <p>{t('noResults')}</p>
      )}
    </div>
  );
};

export default FAQList;
