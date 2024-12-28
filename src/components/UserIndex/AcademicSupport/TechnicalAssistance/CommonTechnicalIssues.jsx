// Components/TechnicalAssistance/CommonTechnicalIssues.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CommonTechnicalIssues.module.css';
import { ListGroup } from 'react-bootstrap';

const CommonTechnicalIssues = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  const issues = [
    t('issue1'),
    t('issue2'),
    t('issue3'),
    // Add more issues as needed
  ];

  return (
    <div className={styles.commonTechnicalIssues}>
      <h3>{t('commonTechnicalIssues')}</h3>
      <ListGroup>
        {issues.map((issue, index) => (
          <ListGroup.Item key={index}>{issue}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default CommonTechnicalIssues;
