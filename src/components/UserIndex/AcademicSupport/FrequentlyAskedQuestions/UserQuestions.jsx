// Components/FrequentlyAskedQuestions/UserQuestions.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserQuestions.module.css';
import { Form, Button } from 'react-bootstrap';

const UserQuestions = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit the question
    alert(t('questionSubmitted'));
    setQuestion('');
  };

  return (
    <div className={styles.userQuestions}>
      <h4>{t('userQuestions')}</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserQuestion">
          <Form.Label>{t('enterYourQuestion')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('questionPlaceholder')}
          />
        </Form.Group>
        <Button variant="success" type="submit" disabled={!question}>
          {t('submitQuestion')}
        </Button>
      </Form>
    </div>
  );
};

export default UserQuestions;
