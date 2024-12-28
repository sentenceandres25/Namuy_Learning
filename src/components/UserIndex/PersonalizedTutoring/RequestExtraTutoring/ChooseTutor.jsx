// src/components/RequestExtraTutoring/ChooseTutor.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChooseTutor.module.css';
import { Form, Button, Card } from 'react-bootstrap';

const ChooseTutor = ({ course, tutor, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring'); // Ensure correct namespace

  // Sample data of available tutors
  const availableTutors = [
    { id: 1, name: 'Ana Gomez', experience: '5 years', rating: 4.8 },
    { id: 2, name: 'Luis Fernandez', experience: '3 years', rating: 4.5 },
    // Add more tutors as needed
  ];

  return (
    <div className={styles.chooseTutor}>
      <h3>{t('chooseTutor')}</h3>
      <div className={styles.tutorsList}>
        {availableTutors.map((tutorItem) => (
          <Card
            key={tutorItem.id}
            className={`${styles.tutorCard} ${
              tutor === tutorItem.name ? styles.selected : ''
            }`}
            onClick={() => onChange(tutorItem.name)}
          >
            <Card.Body>
              <Card.Title>{tutorItem.name}</Card.Title>
              <Card.Text>
                {t('experience')}: {tutorItem.experience}
              </Card.Text>
              <Card.Text>
                {t('rating')}: {tutorItem.rating}/5
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default ChooseTutor;
