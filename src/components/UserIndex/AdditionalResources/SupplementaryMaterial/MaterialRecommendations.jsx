// Components/SupplementaryMaterial/MaterialRecommendations.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MaterialRecommendations.module.css';
import { Card, Carousel } from 'react-bootstrap';

const MaterialRecommendations = ({ materials }) => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  // Assuming materials array contains recommended materials
  const recommendedMaterials = materials.slice(0, 5); // Get first 5 materials as an example

  return (
    <div className={styles.materialRecommendations}>
      <h3>{t('materialRecommendations')}</h3>
      <Carousel>
        {recommendedMaterials.map((material) => (
          <Carousel.Item key={material.id}>
            <Card className={styles.materialCard}>
              <Card.Body>
                <Card.Title>{material.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {t('type')}: {material.type}
                </Card.Subtitle>
                <Card.Text>{material.description}</Card.Text>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default MaterialRecommendations;
