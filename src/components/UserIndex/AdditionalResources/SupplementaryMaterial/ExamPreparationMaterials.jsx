// Components/SupplementaryMaterial/ExamPreparationMaterials.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExamPreparationMaterials.module.css';
import { Card, Button } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';

const ExamPreparationMaterials = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  // Sample data (replace with actual exam materials)
  const examMaterials = [
    {
      id: 1,
      title: 'Exam Simulator for Physics',
      downloadable: true,
    },
    // Add more materials as needed
  ];

  return (
    <div className={styles.examPreparationMaterials}>
      <h4>{t('examPreparationMaterials')}</h4>
      {examMaterials.map((material) => (
        <Card key={material.id} className={styles.materialItem}>
          <Card.Body>
            <Card.Title>{material.title}</Card.Title>
            {material.downloadable && (
              <Button variant="success">
                <FaDownload /> {t('download')}
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ExamPreparationMaterials;
