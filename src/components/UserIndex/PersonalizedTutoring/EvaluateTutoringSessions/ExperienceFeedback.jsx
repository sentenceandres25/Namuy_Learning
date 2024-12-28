// Components/EvaluateTutoringSessions/ExperienceFeedback.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExperienceFeedback.module.css';
import { Form } from 'react-bootstrap';

const ExperienceFeedback = ({ feedback, onChange }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  return (
    <div className={styles.experienceFeedback}>
      <h4>{t('experienceFeedback')}</h4>
      <Form.Group controlId="formExperienceFeedback">
        <Form.Control
          as="textarea"
          rows={4}
          value={feedback}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('writeFeedback')}
        />
      </Form.Group>
    </div>
  );
};

export default ExperienceFeedback;
