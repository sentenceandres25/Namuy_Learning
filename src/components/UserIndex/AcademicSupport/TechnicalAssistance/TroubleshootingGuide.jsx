// Components/TechnicalAssistance/TroubleshootingGuide.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TroubleshootingGuide.module.css';
import { ListGroup } from 'react-bootstrap';

const TroubleshootingGuide = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  const steps = [
    t('step1'),
    t('step2'),
    t('step3'),
    // Add more steps as needed
  ];

  return (
    <div className={styles.troubleshootingGuide}>
      <h3>{t('troubleshootingGuide')}</h3>
      <ListGroup as="ol" numbered>
        {steps.map((step, index) => (
          <ListGroup.Item as="li" key={index}>
            {step}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TroubleshootingGuide;
