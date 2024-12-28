// Components/SupplementaryMaterial/InstructionsForUse.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './InstructionsForUse.module.css';
import { ListGroup } from 'react-bootstrap';

const InstructionsForUse = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  const instructions = [
    t('instruction1'),
    t('instruction2'),
    t('instruction3'),
    // Add more instructions as needed
  ];

  return (
    <div className={styles.instructionsForUse}>
      <h4>{t('instructionsForUse')}</h4>
      <ListGroup>
        {instructions.map((instruction, index) => (
          <ListGroup.Item key={index}>{instruction}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default InstructionsForUse;
