// Components/VirtualLibrary/NewArrivals.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NewArrivals.module.css';
import { Card, Carousel } from 'react-bootstrap';

const NewArrivals = ({ resources }) => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');

  // Assuming resources array contains new arrivals
  const newResources = resources.slice(0, 5); // Get first 5 resources as an example

  return (
    <div className={styles.newArrivals}>
      <h3>{t('newArrivals')}</h3>
      <Carousel>
        {newResources.map((resource) => (
          <Carousel.Item key={resource.id}>
            <Card className={styles.resourceCard}>
              <Card.Body>
                <Card.Title>{resource.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {t('author')}: {resource.author}
                </Card.Subtitle>
                <Card.Text>{resource.description}</Card.Text>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default NewArrivals;
