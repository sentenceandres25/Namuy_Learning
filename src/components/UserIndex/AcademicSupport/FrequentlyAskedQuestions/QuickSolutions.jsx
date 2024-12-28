// Components/FrequentlyAskedQuestions/QuickSolutions.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './QuickSolutions.module.css';
import { ListGroup } from 'react-bootstrap';

const QuickSolutions = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');

  const solutions = [
    t('solution1'),
    t('solution2'),
    t('solution3'),
    // Add more solutions as needed
  ];

  return (
    <div className={styles.quickSolutions}>
      <h4>{t('quickSolutions')}</h4>
      <ListGroup>
        {solutions.map((solution, index) => (
          <ListGroup.Item key={index}>{solution}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default QuickSolutions;
