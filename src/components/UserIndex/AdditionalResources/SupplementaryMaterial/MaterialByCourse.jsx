// Components/SupplementaryMaterial/MaterialByCourse.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MaterialByCourse.module.css';
import { Card } from 'react-bootstrap';

const MaterialByCourse = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  // Sample data (replace with actual course materials)
  const courseMaterials = [
    {
      id: 1,
      title: 'Practice Exercises for Calculus',
      course: 'Calculus 101',
    },
    // Add more materials as needed
  ];

  return (
    <div className={styles.materialByCourse}>
      <h4>{t('materialByCourse')}</h4>
      {courseMaterials.map((material) => (
        <Card key={material.id} className={styles.materialItem}>
          <Card.Body>
            <Card.Title>{material.title}</Card.Title>
            <Card.Text>
              {t('course')}: {material.course}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default MaterialByCourse;
