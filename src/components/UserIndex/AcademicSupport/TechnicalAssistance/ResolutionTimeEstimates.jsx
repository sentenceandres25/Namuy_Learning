// Components/TechnicalAssistance/ResolutionTimeEstimates.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ResolutionTimeEstimates.module.css';
import { Table } from 'react-bootstrap';

const ResolutionTimeEstimates = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  const estimates = [
    { issue: t('issue1'), time: t('time1') },
    { issue: t('issue2'), time: t('time2') },
    // Add more estimates as needed
  ];

  return (
    <div className={styles.resolutionTimeEstimates}>
      <h3>{t('resolutionTimeEstimates')}</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('issue')}</th>
            <th>{t('estimatedTime')}</th>
          </tr>
        </thead>
        <tbody>
          {estimates.map((estimate, index) => (
            <tr key={index}>
              <td>{estimate.issue}</td>
              <td>{estimate.time}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResolutionTimeEstimates;
