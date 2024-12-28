// Components/EvaluateTutoringSessions/TutorRecommendation.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutorRecommendation.module.css';
import { Form } from 'react-bootstrap';

const TutorRecommendation = ({ recommendation, onChange }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  return (
    <div className={styles.tutorRecommendation}>
      <h4>{t('tutorRecommendation')}</h4>
      <Form.Group controlId="formTutorRecommendation">
        <Form.Check
          type="radio"
          label={t('wouldRecommend')}
          name="recommendationOptions"
          className="form-check"
          value="yes"
          checked={recommendation === 'yes'}
          onChange={(e) => onChange(e.target.value)}
        />
        <Form.Check
          type="radio"
          label={t('wouldNotRecommend')}
          name="recommendationOptions"
          className="form-check"
          value="no"
          checked={recommendation === 'no'}
          onChange={(e) => onChange(e.target.value)}
        />
      </Form.Group>
      {recommendation === 'no' && (
        <Form.Group controlId="formRecommendationReason">
          <Form.Label>{t('reason')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder={t('writeReason')}
            onChange={(e) => onChange({ ...recommendation, reason: e.target.value })}
          />
        </Form.Group>
      )}
    </div>
  );
};

export default TutorRecommendation;
