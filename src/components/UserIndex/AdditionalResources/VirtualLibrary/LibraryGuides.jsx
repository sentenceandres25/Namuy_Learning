// Components/VirtualLibrary/LibraryGuides.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LibraryGuides.module.css';
import { ListGroup } from 'react-bootstrap';

const LibraryGuides = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');

  const guides = [
    { id: 1, title: t('guide1'), link: '#' },
    { id: 2, title: t('guide2'), link: '#' },
    // Add more guides as needed
  ];

  return (
    <div className={styles.libraryGuides}>
      <h4>{t('libraryGuides')}</h4>
      <ListGroup>
        {guides.map((guide) => (
          <ListGroup.Item key={guide.id}>
            <a href={guide.link}>{guide.title}</a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default LibraryGuides;
