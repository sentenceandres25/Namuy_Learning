// Components/TutoringHistory/TutoringsList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutoringsList.module.css';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher } from 'react-icons/fa';

const TutoringsList = ({ tutorings, selectedTutoring, onSelectTutoring }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');

  return (
    <motion.div
      className={styles.tutoringsList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.cardContainer}>
        {tutorings.map((tutoring) => (
          <div
            key={tutoring.id}
            className={`${styles.tutoringCard} ${
              selectedTutoring && selectedTutoring.id === tutoring.id
                ? styles.selected
                : ''
            }`}
            onClick={() => onSelectTutoring(tutoring)}
          >
            <FaChalkboardTeacher className={styles.icon} />
            <h4>{tutoring.course}</h4>
            <p>{t('date')}: {tutoring.date}</p>
            <p>{t('time')}: {tutoring.time}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TutoringsList;
