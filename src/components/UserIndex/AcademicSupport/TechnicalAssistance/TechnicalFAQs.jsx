// Components/TechnicalAssistance/TechnicalFAQs.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TechnicalFAQs.module.css';
import Accordion from 'react-bootstrap/Accordion';

const TechnicalFAQs = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  const faqs = [
    {
      id: '0',
      question: t('techFAQ1'),
      answer: t('answerTechFAQ1'),
    },
    // Add more FAQs as needed
  ];

  return (
    <div className={styles.technicalFAQs}>
      <h3>{t('technicalFAQs')}</h3>
      <Accordion defaultActiveKey="0">
        {faqs.map((faq) => (
          <Accordion.Item eventKey={faq.id} key={faq.id}>
            <Accordion.Header>{faq.question}</Accordion.Header>
            <Accordion.Body>{faq.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default TechnicalFAQs;
