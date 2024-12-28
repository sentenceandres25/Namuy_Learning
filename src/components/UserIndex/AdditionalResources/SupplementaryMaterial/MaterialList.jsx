// Components/SupplementaryMaterial/MaterialList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MaterialList.module.css';
import { Card, Button } from 'react-bootstrap';
import { FaDownload, FaEye } from 'react-icons/fa';

const MaterialList = ({ materials }) => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  return (
    <div className={styles.materialList}>
      <h3>{t('materialList')}</h3>
      {materials.length > 0 ? (
        materials.map((material) => (
          <Card key={material.id} className={styles.materialItem}>
            <Card.Body>
              <Card.Title>{material.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {t('type')}: {material.type}
              </Card.Subtitle>
              <Card.Text>{material.description}</Card.Text>
              <div className={styles.buttons}>
                {material.onlineView && (
                  <Button variant="primary">
                    <FaEye /> {t('viewOnline')}
                  </Button>
                )}
                {material.downloadable && (
                  <Button variant="success">
                    <FaDownload /> {t('download')}
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>{t('noMaterialsFound')}</p>
      )}
    </div>
  );
};

export default MaterialList;
