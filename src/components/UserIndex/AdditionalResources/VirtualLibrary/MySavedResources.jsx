// Components/VirtualLibrary/MySavedResources.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MySavedResources.module.css';
import { Card, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const MySavedResources = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');

  // Sample data (replace with actual saved resources)
  const savedResources = [
    {
      id: 1,
      title: 'Effective Study Techniques',
      author: 'John Doe',
    },
    // Add more resources as needed
  ];

  const handleRemove = (id) => {
    // Logic to remove resource from saved list
    alert(`${t('removedResource')} ${id}`);
  };

  return (
    <div className={styles.mySavedResources}>
      <h4>{t('mySavedResources')}</h4>
      {savedResources.length > 0 ? (
        savedResources.map((resource) => (
          <Card key={resource.id} className={styles.resourceItem}>
            <Card.Body>
              <Card.Title>{resource.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {t('author')}: {resource.author}
              </Card.Subtitle>
              <Button variant="outline-danger" onClick={() => handleRemove(resource.id)}>
                <FaTrash /> {t('remove')}
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>{t('noSavedResources')}</p>
      )}
    </div>
  );
};

export default MySavedResources;
