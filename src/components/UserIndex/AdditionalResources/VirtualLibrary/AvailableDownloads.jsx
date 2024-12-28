// Components/VirtualLibrary/AvailableDownloads.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AvailableDownloads.module.css';
import { Card, Button } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';

const AvailableDownloads = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');

  // Sample data (replace with actual downloadable resources)
  const downloadableResources = [
    {
      id: 1,
      title: 'Effective Study Techniques',
      author: 'John Doe',
    },
    // Add more resources as needed
  ];

  return (
    <div className={styles.availableDownloads}>
      <h4>{t('availableDownloads')}</h4>
      {downloadableResources.map((resource) => (
        <Card key={resource.id} className={styles.resourceItem}>
          <Card.Body>
            <Card.Title>{resource.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {t('author')}: {resource.author}
            </Card.Subtitle>
            <Button variant="success">
              <FaDownload /> {t('download')}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default AvailableDownloads;
