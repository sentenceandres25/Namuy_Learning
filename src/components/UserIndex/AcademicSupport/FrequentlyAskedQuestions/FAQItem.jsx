// Components/FrequentlyAskedQuestions/FAQItem.jsx

import React, { useState } from 'react';
import styles from './FAQItem.module.css';
import { Card } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={styles.faqItem}>
      <Card.Header onClick={() => setIsOpen(!isOpen)}>
        {faq.question}
        {isOpen ? <FaMinus /> : <FaPlus />}
      </Card.Header>
      {isOpen && (
        <Card.Body>
          <Card.Text>{faq.answer}</Card.Text>
        </Card.Body>
      )}
    </Card>
  );
};

export default FAQItem;
