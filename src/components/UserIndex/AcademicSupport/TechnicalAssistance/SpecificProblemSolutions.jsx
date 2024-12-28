// Components/TechnicalAssistance/SpecificProblemSolutions.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SpecificProblemSolutions.module.css';
import Accordion from 'react-bootstrap/Accordion';

const SpecificProblemSolutions = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');

  const problems = [
    {
      id: '0',
      question: t('specificProblem1'),
      answer: t('solutionSpecificProblem1'),
    },
    // Add more problems as needed
  ];

  return (
    <div className={styles.specificProblemSolutions}>
      <h3>{t('specificProblemSolutions')}</h3>
      <Accordion defaultActiveKey="0">
        {problems.map((problem) => (
          <Accordion.Item eventKey={problem.id} key={problem.id}>
            <Accordion.Header>{problem.question}</Accordion.Header>
            <Accordion.Body>{problem.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default SpecificProblemSolutions;
