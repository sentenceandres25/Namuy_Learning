// Components/VirtualLibrary/CourseRecommendedResources.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CourseRecommendedResources.module.css';
import { Card } from 'react-bootstrap';

const CourseRecommendedResources = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');

  // Sample data (replace with actual recommended resources)
  const recommendedResources = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      author: 'Jane Smith',
      course: 'Calculus 101',
    },
    // Add more resources as needed
  ];

  return (
    <div className={styles.courseRecommendedResources}>
      <h4>{t('courseRecommendedResources')}</h4>
      {recommendedResources.map((resource) => (
        <Card key={resource.id} className={styles.resourceItem}>
          <Card.Body>
            <Card.Title>{resource.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {t('author')}: {resource.author}
            </Card.Subtitle>
            <Card.Text>
              {t('recommendedFor')}: {resource.course}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default CourseRecommendedResources;
