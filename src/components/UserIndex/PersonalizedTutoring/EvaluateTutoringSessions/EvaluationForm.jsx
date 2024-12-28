// Components/EvaluateTutoringSessions/EvaluationForm.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EvaluationForm.module.css';
import { Form, Button } from 'react-bootstrap';
import TutorRating from './TutorRating';
import ExperienceFeedback from './ExperienceFeedback';
import OverallSatisfaction from './OverallSatisfaction';
import TutorRecommendation from './TutorRecommendation';
import SessionContentEvaluation from './SessionContentEvaluation';
import TutorResponseTime from './TutorResponseTime';
import ProgressAchieved from './ProgressAchieved';
import AnonymousComments from './AnonymousComments';

const EvaluationForm = ({ session, onSubmit }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');

  const [formData, setFormData] = React.useState({
    tutorRating: 0,
    experienceFeedback: '',
    overallSatisfaction: '',
    tutorRecommendation: '',
    sessionContentEvaluation: {},
    tutorResponseTime: '',
    progressAchieved: '',
    anonymousComments: '',
  });

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit the evaluation (e.g., send data to server)
    alert(t('evaluationSubmitted'));
    onSubmit();
  };

  return (
    <div className={styles.evaluationForm}>
      <h3>{t('evaluateSession')}</h3>
      <Form onSubmit={handleSubmit}>
        <TutorRating
          rating={formData.tutorRating}
          onChange={(value) => handleFormChange('tutorRating', value)}
        />
        <ExperienceFeedback
          feedback={formData.experienceFeedback}
          onChange={(value) => handleFormChange('experienceFeedback', value)}
        />
        <OverallSatisfaction
          satisfaction={formData.overallSatisfaction}
          onChange={(value) => handleFormChange('overallSatisfaction', value)}
        />
        <TutorRecommendation
          recommendation={formData.tutorRecommendation}
          onChange={(value) => handleFormChange('tutorRecommendation', value)}
        />
        <SessionContentEvaluation
          evaluation={formData.sessionContentEvaluation}
          onChange={(value) => handleFormChange('sessionContentEvaluation', value)}
        />
        <TutorResponseTime
          responseTime={formData.tutorResponseTime}
          onChange={(value) => handleFormChange('tutorResponseTime', value)}
        />
        <ProgressAchieved
          progress={formData.progressAchieved}
          onChange={(value) => handleFormChange('progressAchieved', value)}
        />
        <AnonymousComments
          comments={formData.anonymousComments}
          onChange={(value) => handleFormChange('anonymousComments', value)}
        />
        <Button variant="success" type="submit">
          {t('submitEvaluation')}
        </Button>
      </Form>
    </div>
  );
};

export default EvaluationForm;
