// Components/EvaluateTutoringSessions/AnonymousComments.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AnonymousComments.module.css';
import { Form } from 'react-bootstrap';

const AnonymousComments = ({ comments, onChange }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  return (
    <div className={styles.anonymousComments}>
      <h4>{t('anonymousComments')}</h4>
      <Form.Group controlId="formAnonymousComments">
        <Form.Control
          as="textarea"
          rows={4}
          value={comments}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('writeComments')}
        />
      </Form.Group>
    </div>
  );
};

export default AnonymousComments;
