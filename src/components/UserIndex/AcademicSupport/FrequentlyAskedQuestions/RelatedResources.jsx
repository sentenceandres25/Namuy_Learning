// Components/FrequentlyAskedQuestions/RelatedResources.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RelatedResources.module.css';
import { ListGroup } from 'react-bootstrap';

const RelatedResources = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');

  const resources = [
    { id: 1, title: t('resource1'), link: '#' },
    { id: 2, title: t('resource2'), link: '#' },
    // Add more resources as needed
  ];

  return (
    <div className={styles.relatedResources}>
      <h4>{t('relatedResources')}</h4>
      <ListGroup>
        {resources.map((resource) => (
          <ListGroup.Item key={resource.id}>
            <a href={resource.link}>{resource.title}</a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default RelatedResources;
