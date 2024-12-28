// Components/TechnicalAssistance/TechnicalDocumentation.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TechnicalDocumentation.module.css';
import { ListGroup } from 'react-bootstrap';

const TechnicalDocumentation = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  const documents = [
    { id: 1, title: t('doc1'), link: '#' },
    { id: 2, title: t('doc2'), link: '#' },
    // Add more documents as needed
  ];

  return (
    <div className={styles.technicalDocumentation}>
      <h3>{t('technicalDocumentation')}</h3>
      <ListGroup>
        {documents.map((doc) => (
          <ListGroup.Item key={doc.id}>
            <a href={doc.link}>{doc.title}</a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TechnicalDocumentation;
