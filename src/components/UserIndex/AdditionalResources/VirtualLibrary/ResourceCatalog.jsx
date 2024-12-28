// Components/VirtualLibrary/ResourceCatalog.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ResourceCatalog.module.css';
import { Card, Button } from 'react-bootstrap';
import { FaDownload, FaEye, FaHeart } from 'react-icons/fa';

const ResourceCatalog = ({ resources }) => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');

  return (
    <div className={styles.resourceCatalog}>
      <h3>{t('resourceCatalog')}</h3>
      {resources.length > 0 ? (
        resources.map((resource) => (
          <Card key={resource.id} className={styles.resourceItem}>
            <Card.Body>
              <Card.Title>{resource.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {t('author')}: {resource.author}
              </Card.Subtitle>
              <Card.Text>{resource.description}</Card.Text>
              <div className={styles.buttons}>
                {resource.onlineAccess && (
                  <Button variant="primary">
                    <FaEye /> {t('viewOnline')}
                  </Button>
                )}
                {resource.downloadable && (
                  <Button variant="success">
                    <FaDownload /> {t('download')}
                  </Button>
                )}
                <Button variant="outline-danger">
                  <FaHeart /> {t('saveResource')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>{t('noResourcesFound')}</p>
      )}
    </div>
  );
};

export default ResourceCatalog;
